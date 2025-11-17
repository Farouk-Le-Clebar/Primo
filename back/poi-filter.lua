local wanted_amenities = {
    hospital = true,
    pharmacy = true,
    -- doctors = true,
    -- clinic = true,
    -- dentist = true,
    -- fire_station = true,
    -- police = true,
    
    school = true,
    college = true,
    university = true,
    -- kindergarten = true,
    -- library = true,
    
    cinema = true,
    -- theatre = true,
    -- museum = true,
    -- community_centre = true,
}

local wanted_shops = {
    supermarket = true,
    mall = true,
    convenience = true,
    department_store = true,
}

local wanted_leisure = {
    park = true,
    sports_centre = true,
    stadium = true,
    swimming_pool = true,
}

local function should_keep(tags)
    if tags.amenity and wanted_amenities[tags.amenity] then
        return true, 'amenity', tags.amenity
    end
    
    if tags.shop and wanted_shops[tags.shop] then
        return true, 'shop', tags.shop
    end
    
    if tags.leisure and wanted_leisure[tags.leisure] then
        return true, 'leisure', tags.leisure
    end
    
    return false
end

function osm2pgsql.process_node(object)
    local keep, category, poi_type = should_keep(object.tags)
    
    if keep then
        local enriched_tags = {}
        for k, v in pairs(object.tags) do
            enriched_tags[k] = v
        end
        enriched_tags.poi_category = category
        enriched_tags.poi_type = poi_type
        
        tables.pois:insert({
            tags = enriched_tags,
            geom = object:as_point()
        })
    end
end

function osm2pgsql.process_way(object)
    local keep, category, poi_type = should_keep(object.tags)
    
    if keep then
        local enriched_tags = {}
        for k, v in pairs(object.tags) do
            enriched_tags[k] = v
        end
        enriched_tags.poi_category = category
        enriched_tags.poi_type = poi_type
        
        if object.is_closed then
            tables.pois:insert({
                tags = enriched_tags,
                geom = object:as_polygon():centroid()
            })
        else
            tables.pois:insert({
                tags = enriched_tags,
                geom = object:as_linestring():centroid()
            })
        end
    end
end

tables = {}
tables.pois = osm2pgsql.define_table({
    name = 'pois_france',
    ids = { type = 'any', id_column = 'osm_id' },
    columns = {
        { column = 'tags', type = 'jsonb' },
        { column = 'geom', type = 'point', projection = 4326 }
    }
})