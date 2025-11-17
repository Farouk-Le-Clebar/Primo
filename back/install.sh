#!/bin/bash


# == Addock Data Download ==
echo "Starting addock data download..."
wget https://adresse.data.gouv.fr/data/ban/adresses/latest/addok/addok-france-bundle.zip

mkdir addok-data
unzip -d addok-data addok-france-bundle.zip

rm -rf addok-france-bundle.zip

echo "Addock data downloaded and extracted to addok-data/"

# == GraphHopper Data Download ==
echo "Starting GraphHopper data download..."
mkdir graphhopper-data
wget https://download.geofabrik.de/europe/france/midi-pyrenees-latest.osm.pbf -O graphhopper-data/occitanie.osm.pbf

echo "GraphHopper data downloaded to graphhopper-data/"

echo "Starting departements data download..."

# == Departements Data Download ==
set -e

TMP_DIR=$(mktemp -d)
git clone --depth=1 https://github.com/gregoiredavid/france-geojson.git "$TMP_DIR"


rm -rf ./data/departements
mkdir -p ./data/departements
cp -r "$TMP_DIR/departements"/* ./data/departements/

rm -rf "$TMP_DIR"

cd data/departements

rm -rf 97*

for folder in *; do
    if [ -d "$folder" ]; then
        short_code="${folder:0:2}"
        
        if [ ! -d "$short_code" ]; then
            mkdir -p "$short_code"
        fi
        
        mv "$folder"/* "$short_code/" 2>/dev/null || true
        
        if [ "$folder" != "$short_code" ]; then
            rm -rf "$folder"
        fi
    fi
done

find . -type f -name "cantons*" -delete
find . -type f -name "arrondissements*" -delete

for file in $(find . -type f -name "*.geojson"); do
    dir=$(dirname "$file")
    filename=$(basename "$file")
    
    if [[ "$filename" =~ ^communes-(..)-.* ]]; then
        dept_code="${BASH_REMATCH[1]}"
        new_filename="communes-${dept_code}.geojson"
        if [ "$filename" != "$new_filename" ]; then
            mv "$file" "$dir/$new_filename"
        fi
    fi
    
    if [[ "$filename" =~ ^departement-(..)-.* ]]; then
        dept_code="${BASH_REMATCH[1]}"
        new_filename="departement-${dept_code}.geojson"
        if [ "$filename" != "$new_filename" ]; then
            mv "$file" "$dir/$new_filename"
        fi
    fi
done

cd ../..

echo "Departements data downloaded and organized in data/departements/"

# == PostGIS Data script ==

echo "Setting up PostGIS data..."
echo "Install osmium-tool and osm2pgsql if not already installed."
echo "postgis container should be running !!"

wget https://download.geofabrik.de/europe/france-latest.osm.pbf -O france-latest.osm.pbf

OSM_FILE="france-latest.osm.pbf"
FILTERED_FILE="france-pois-filtered.osm.pbf"



filter_pois() {
    echo "Filtrage des POI avec osmium..."
    
    osmium tags-filter "$OSM_FILE" \
        nwr/amenity=hospital,pharmacy,school,college,university,library,cinema \
        nwr/shop=supermarket,mall,convenience,department_store \
        nwr/leisure=park,sports_centre,stadium,swimming_pool \
        -o "$FILTERED_FILE" \
        --overwrite
    
    local original_size=$(du -h "$OSM_FILE" | cut -f1)
    local filtered_size=$(du -h "$FILTERED_FILE" | cut -f1)

    echo "Filtered completed"
    echo "Original size : $original_size"
    echo "Filtered size : $filtered_size"
}

osm2pgsql \
        --create \
        --slim \
        --drop \
        --cache 1000 \
        --number-processes $(nproc) \
        --database "$DB_NAME" \
        --username "$DB_USER" \
        --host "$DB_HOST" \
        --port "$DB_PORT" \
        --output flex \
        --style poi-filter.lua \
        "$FILTERED_FILE"

echo "PostGIS data setup completed."

echo "Connect to the PostGIS database to verify the POI data has been imported with the command : 'SELECT * FROM planet_osm_point WHERE amenity IS NOT NULL;'"
echo "Then, you can create the different indexes on the planet_osm_point table for better performance."
echo "Create the following indexes as needed:"
echo ''
echo "CREATE INDEX idx_pois_geom ON pois_france USING GIST(geom);"
echo ''
echo "CREATE INDEX idx_pois_tags ON pois_france USING GIN(tags);"
echo ''
echo "CREATE INDEX idx_pois_hospital ON pois_france USING GIST(geom) 
WHERE tags->>'amenity' = 'hospital';"
echo ''
echo "CREATE INDEX idx_pois_pharmacy ON pois_france USING GIST(geom) 
WHERE tags->>'amenity' = 'pharmacy';"
echo ''
echo "CREATE INDEX idx_pois_school ON pois_france USING GIST(geom) 
WHERE tags->>'amenity' IN ('school', 'college', 'university');"
echo ''
echo "CREATE INDEX idx_pois_supermarket ON pois_france USING GIST(geom) 
WHERE tags->>'shop' = 'supermarket';"
echo ''
echo "CREATE INDEX idx_pois_cinema ON pois_france USING GIST(geom) 
WHERE tags->>'amenity' = 'cinema';"
echo ''
echo "Finish by optimizing the table with the command :"
echo "VACUUM ANALYZE pois_france;"