#!/bin/bash

set -o allexport
source ./.env
set +o allexport



echo "Setting up GEOSERVER data..."
echo "Install osmium-tool and osm2pgsql if not already installed."
echo "GEOSERVER container should be running !!"

# wget https://download.geofabrik.de/europe/france-latest.osm.pbf -O france-latest.osm.pbf

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
    
    export PGPASSWORD="$GEOSERVER_PASSWORD"
    
    osm2pgsql \
        --create \
        --slim \
        --drop \
        --cache 1000 \
        --number-processes $(nproc) \
        --database "$GEOSERVER_DATABASE" \
        --username "$GEOSERVER_USER" \
        --host "$GEOSERVER_HOST" \
        --port "$GEOSERVER_PORT" \
        --output flex \
        --style poi-filter.lua \
        "$FILTERED_FILE"

    echo "Import completed"
}


create_indexes() {
    echo "Creating indexes..."

    export PGPASSWORD="$GEOSERVER_PASSWORD"
   
   cat <<'EOF' | docker exec -i \
        --env PGPASSWORD="$GEOSERVER_PASSWORD" \
        geoserver_primo \
        psql -v ON_ERROR_STOP=1 -U "$GEOSERVER_USER" -d "$GEOSERVER_DATABASE"

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
 docker exec --env PGPASSWORD="$GEOSERVER_PASSWORD" geoserver_primo \
        psql -U "$GEOSERVER_USER" -d "$GEOSERVER_DATABASE" -c "
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'pois_france';
        "
}

# filter_pois
import_with_osm2pgsql
create_indexes
echo "GEOSERVER data setup completed."
