-- local wanted_amenities = {
--     hospital = true,
--     pharmacy = true,
--     -- doctors = true,
--     -- clinic = true,
--     -- dentist = true,
--     -- fire_station = true,
--     -- police = true,
    
--     school = true,
--     college = true,
--     university = true,
--     -- kindergarten = true,
--     -- library = true,
    
--     cinema = true,
--     -- theatre = true,
--     -- museum = true,
--     -- community_centre = true,
-- }

-- local wanted_shops = {
--     supermarket = true,
--     mall = true,
--     convenience = true,
--     department_store = true,
-- }

-- local wanted_leisure = {
--     park = true,
--     sports_centre = true,
--     stadium = true,
--     swimming_pool = true,
-- }

-- local function should_keep(tags)
--     if tags.amenity and wanted_amenities[tags.amenity] then
--         return true, 'amenity', tags.amenity
--     end
    
--     if tags.shop and wanted_shops[tags.shop] then
--         return true, 'shop', tags.shop
--     end
    
--     if tags.leisure and wanted_leisure[tags.leisure] then
--         return true, 'leisure', tags.leisure
--     end
    
--     return false
-- end

-- function osm2pgsql.process_node(object)
--     local keep, category, poi_type = should_keep(object.tags)
    
--     if keep then
--         local enriched_tags = {}
--         for k, v in pairs(object.tags) do
--             enriched_tags[k] = v
--         end
--         enriched_tags.poi_category = category
--         enriched_tags.poi_type = poi_type
        
--         tables.pois:insert({
--             tags = enriched_tags,
--             geom = object:as_point()
--         })
--     end
-- end

-- function osm2pgsql.process_way(object)
--     local keep, category, poi_type = should_keep(object.tags)
    
--     if keep then
--         local enriched_tags = {}
--         for k, v in pairs(object.tags) do
--             enriched_tags[k] = v
--         end
--         enriched_tags.poi_category = category
--         enriched_tags.poi_type = poi_type
        
--         if object.is_closed then
--             tables.pois:insert({
--                 tags = enriched_tags,
--                 geom = object:as_polygon():centroid()
--             })
--         else
--             tables.pois:insert({
--                 tags = enriched_tags,
--                 geom = object:as_linestring():centroid()
--             })
--         end
--     end
-- end

-- tables = {}
-- tables.pois = osm2pgsql.define_table({
--     name = 'pois_france',
--     ids = { type = 'any', id_column = 'osm_id' },
--     columns = {
--         { column = 'tags', type = 'jsonb' },
--         { column = 'geom', type = 'point', projection = 4326 }
--     }
-- })

-- ==================================================================
-- poi-filter.lua
--
-- Script "flex" osm2pgsql. Il ne fait QUE deux choses :
--   1. Charger le catalogue de types depuis poi-types.csv (source de
--      vérité unique, partagée avec install-pois-france-vps.sh).
--   2. Pour chaque node/way/relation dont un tag correspond à une
--      règle du catalogue, écrire une ligne dans la table de
--      staging `stg_infrastructures`, avec tous les tags OSM
--      d'origine conservés en jsonb.
--
-- La table de staging est ensuite fusionnée dans les tables
-- définitives (infrastructures / infrastructure_types) par le
-- script sql/merge.sql, exécuté par install-pois-france-vps.sh.
--
-- Pour ajouter un type d'infrastructure : éditer poi-types.csv.
-- Ce fichier n'a normalement jamais besoin d'être modifié.
-- ==================================================================

local CSV_PATH = os.getenv('POI_TYPES_CSV') or 'poi-types.csv'

-- RULES_BY_KEY[osm_key][osm_value] = { code = ..., famille = ..., label = ... }
local RULES_BY_KEY = {}

local function trim(s)
    return (s:gsub('^%s*(.-)%s*$', '%1'))
end

local function load_rules(path)
    local f = assert(io.open(path, 'r'),
        "poi-filter.lua: impossible d'ouvrir " .. path .. " (catalogue des types)")
    local n = 0
    for line in f:lines() do
        line = trim(line)
        if line ~= '' and line:sub(1, 1) ~= '#' and line:sub(1, 4) ~= 'code' then
            local parts = {}
            for field in (line .. ';'):gmatch('([^;]*);') do
                parts[#parts + 1] = trim(field)
            end
            local code, famille, key, value, label = parts[1], parts[2], parts[3], parts[4], parts[5]
            if code and code ~= '' and key and key ~= '' and value and value ~= '' then
                RULES_BY_KEY[key] = RULES_BY_KEY[key] or {}
                RULES_BY_KEY[key][value] = { code = code, famille = famille, label = label }
                n = n + 1
            end
        end
    end
    f:close()
    assert(n > 0, 'poi-filter.lua: aucune règle chargée depuis ' .. path)
    io.stderr:write(('poi-filter.lua: %d règles chargées depuis %s\n'):format(n, path))
    return n
end

load_rules(CSV_PATH)

-- Renvoie le code du premier type correspondant aux tags de l'objet,
-- ou nil si aucune règle ne matche (l'objet est alors ignoré).
local function match_type(tags)
    for key, values in pairs(RULES_BY_KEY) do
        local v = tags[key]
        if v and values[v] then
            return values[v].code
        end
    end
    return nil
end

-- Construit une adresse lisible à partir des tags addr:* (schéma FR/OSM standard)
local function build_adresse(tags)
    local housenumber = tags['addr:housenumber']
    local street = tags['addr:street']
    local postcode = tags['addr:postcode']
    local city = tags['addr:city']

    local line1
    if housenumber and street then
        line1 = housenumber .. ' ' .. street
    else
        line1 = street
    end

    local parts = {}
    if line1 then parts[#parts + 1] = line1 end
    if postcode or city then
        parts[#parts + 1] = trim((postcode or '') .. ' ' .. (city or ''))
    end

    local adresse = nil
    if #parts > 0 then
        adresse = table.concat(parts, ', ')
    end
    return adresse, housenumber, street, postcode, city
end

-- Table de staging : une ligne par infrastructure retenue.
-- Recréée à chaque exécution (osm2pgsql --create) : c'est voulu,
-- c'est une photo complète de l'extrait OSM du jour. La fusion vers
-- la table définitive `infrastructures` (upsert + suppression des
-- disparus) est gérée par sql/merge.sql, pas ici.
local staging = osm2pgsql.define_table({
    name = 'stg_infrastructures',
    ids = { type = 'any', id_column = 'osm_id' },
    columns = {
        { column = 'osm_type',      type = 'text',  not_null = true }, -- 'node' / 'way' / 'relation'
        { column = 'type_code',     type = 'text',  not_null = true }, -- référence infrastructure_types.code
        { column = 'nom',           type = 'text' },
        { column = 'adresse',       type = 'text' },
        { column = 'housenumber',   type = 'text' },
        { column = 'street',        type = 'text' },
        { column = 'postcode',      type = 'text' },
        { column = 'city',          type = 'text' },
        { column = 'phone',         type = 'text' },
        { column = 'website',       type = 'text' },
        { column = 'opening_hours', type = 'text' },
        { column = 'tags',          type = 'jsonb' }, -- tous les tags OSM bruts : rien n'est perdu
        { column = 'geom',          type = 'point', projection = 4326, not_null = true },
    }
})

local function insert_feature(object, geom)
    if not geom then return end

    local type_code = match_type(object.tags)
    if not type_code then return end

    local adresse, housenumber, street, postcode, city = build_adresse(object.tags)

    staging:insert({
        osm_type      = object.type,
        type_code     = type_code,
        nom           = object.tags.name or object.tags['name:fr'],
        adresse       = adresse,
        housenumber   = housenumber,
        street        = street,
        postcode      = postcode,
        city          = city,
        phone         = object.tags.phone or object.tags['contact:phone'],
        website       = object.tags.website or object.tags['contact:website'],
        opening_hours = object.tags.opening_hours,
        tags          = object.tags,
        geom          = geom,
    })
end

function osm2pgsql.process_node(object)
    insert_feature(object, object:as_point())
end

function osm2pgsql.process_way(object)
    if object.is_closed then
        insert_feature(object, object:as_polygon():centroid())
    else
        insert_feature(object, object:as_linestring():centroid())
    end
end

-- Facultatif : certains grands équipements (hôpitaux, campus,
-- parcs...) sont mappés en relation multipolygone dans OSM plutôt
-- qu'en way. Décommenter select_relation_members / process_relation
-- ci-dessous augmente la couverture mais ralentit l'import (plus de
-- mémoire utilisée pour assembler les géométries de relation).
--
-- function osm2pgsql.select_relation_members(relation)
--     if relation.tags.type == 'multipolygon' or relation.tags.type == 'boundary' then
--         return { ways = osm2pgsql.way_member_ids(relation) }
--     end
-- end
--
-- function osm2pgsql.process_relation(object)
--     if object.tags.type == 'multipolygon' or object.tags.type == 'boundary' then
--         local ok, geom = pcall(function() return object:as_multipolygon():centroid() end)
--         if ok then insert_feature(object, geom) end
--     end
-- end