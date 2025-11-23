#!/bin/bash

set -o allexport
source ./.env
set +o allexport

# == Addock Data Download ==
echo "Starting addock data download..."
wget https://adresse.data.gouv.fr/data/ban/adresses/latest/addok/addok-france-bundle.zip

mkdir addok-data
unzip -d addok-data addok-france-bundle.zip

# rm -rf addok-france-bundle.zip

echo "Addock data downloaded and extracted to addok-data/"

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
    echo "POI filtering with osmium..."
    
    osmium tags-filter "$OSM_FILE" \
        nwr/amenity=hospital,pharmacy,school,college,university,library,cinema \
        nwr/shop=supermarket,mall,convenience,department_store \
        nwr/leisure=park,sports_centre,stadium,swimming_pool \
        -o "$FILTERED_FILE" \
        --overwrite
    

    echo "Filtered completed"
}

import_with_osm2pgsql() {
    echo "Import with osm2pgsql..."

    if [ ! -f "poi-filter.lua" ]; then
        echo "The file poi-filter.lua is missing!"
        echo "Create it with the content provided earlier"
        exit 1
    fi
    
    export PGPASSWORD="$POSTGIS_PASSWORD"
    
    osm2pgsql \
        --create \
        --slim \
        --drop \
        --cache 1000 \
        --number-processes $(nproc) \
        --database "$POSTGIS_DATABASE" \
        --username "$POSTGIS_USER" \
        --host "$POSTGIS_HOST" \
        --port "$POSTGIS_PORT" \
        --output flex \
        --style poi-filter.lua \
        "$FILTERED_FILE"

    echo "Import completed"
}


create_indexes() {
    echo "Creating indexes..."

    export PGPASSWORD="$POSTGIS_PASSWORD"
   
   cat <<'EOF' | docker exec -i \
        --env PGPASSWORD="$POSTGIS_PASSWORD" \
        back_postgis_1 \
        psql -v ON_ERROR_STOP=1 -U "$POSTGIS_USER" -d "$POSTGIS_DATABASE"

CREATE INDEX IF NOT EXISTS idx_pois_tags ON pois_france USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_pois_hospital ON pois_france USING GIST(geom) 
WHERE tags->>'amenity' = 'hospital';

CREATE INDEX IF NOT EXISTS idx_pois_pharmacy ON pois_france USING GIST(geom) 
WHERE tags->>'amenity' = 'pharmacy';

CREATE INDEX IF NOT EXISTS idx_pois_school ON pois_france USING GIST(geom) 
WHERE tags->>'amenity' IN ('school', 'college', 'university');

CREATE INDEX IF NOT EXISTS idx_pois_supermarket ON pois_france USING GIST(geom) 
WHERE tags->>'shop' = 'supermarket';

CREATE INDEX IF NOT EXISTS idx_pois_cinema ON pois_france USING GIST(geom) 
WHERE tags->>'amenity' = 'cinema';

VACUUM ANALYZE pois_france;

EOF
    echo "Indexes created successfully"
 docker exec --env PGPASSWORD="$POSTGIS_PASSWORD" back_postgis_1 \
        psql -U "$POSTGIS_USER" -d "$POSTGIS_DATABASE" -c "
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'pois_france';
        "
}

filter_pois
import_with_osm2pgsql
create_indexes
echo "PostGIS data setup completed."