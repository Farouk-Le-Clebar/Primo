#!/bin/bash

# ----------------------
# CONFIG
# ----------------------
DB_HOST="localhost"
DB_NAME="bdtopo"
DB_USER="geo_primo"
DB_PASS="G30S3cr3tP@ss"

GEOSERVER_URL="http://localhost:8081/geoserver"
GEOSERVER_USER="admin"
GEOSERVER_PASS="geoserver_primo"
WORKSPACE="primo"
DATASTORE="primo-postgis"

DATA_DIR="data/departements"

# ----------------------
# STEP 1: CONVERT GEOJSON TO SHAPEFILE AND IMPORT TO POSTGIS
# ----------------------

echo "================================================"
echo "=== ÉTAPE 1: Import GeoJSON → PostGIS ==="
echo "================================================"
echo ""

# Check if data directory exists
if [ ! -d "$DATA_DIR" ]; then
    echo "❌ Erreur: Le dossier $DATA_DIR n'existe pas!"
    exit 1
fi

# Count files to process
TOTAL_GEOJSON=$(find "$DATA_DIR" -name "*.geojson" | wc -l)
echo "📂 Trouvé $TOTAL_GEOJSON fichiers GeoJSON à traiter"
echo ""

PROCESSED=0
ERRORS=0

# Loop through all département directories
for DEPT_DIR in "$DATA_DIR"/*; do
    [ ! -d "$DEPT_DIR" ] && continue
    
    DEPT_CODE=$(basename "$DEPT_DIR")
    echo "🔄 Traitement du département: $DEPT_CODE"
    
    # Process communes file
    COMMUNES_FILE="$DEPT_DIR/communes-${DEPT_CODE}.geojson"
    if [ -f "$COMMUNES_FILE" ]; then
        echo "  → communes-${DEPT_CODE}.geojson"
        
        # Import directly to PostGIS with ogr2ogr
        PGPASSWORD=$DB_PASS ogr2ogr -f "PostgreSQL" \
            PG:"host=$DB_HOST dbname=$DB_NAME user=$DB_USER password=$DB_PASS" \
            "$COMMUNES_FILE" \
            -nln "communes_${DEPT_CODE}" \
            -overwrite \
            -lco GEOMETRY_NAME=geom \
            -lco FID=gid \
            -t_srs EPSG:4326
        
        if [ $? -eq 0 ]; then
            echo "  ✅ communes_${DEPT_CODE} importé"
            ((PROCESSED++))
        else
            echo "  ❌ Erreur lors de l'import de communes_${DEPT_CODE}"
            ((ERRORS++))
        fi
    fi
    
    # Process département file
    DEPT_FILE="$DEPT_DIR/departement-${DEPT_CODE}.geojson"
    if [ -f "$DEPT_FILE" ]; then
        echo "  → departement-${DEPT_CODE}.geojson"
        
        # Import directly to PostGIS with ogr2ogr
        PGPASSWORD=$DB_PASS ogr2ogr -f "PostgreSQL" \
            PG:"host=$DB_HOST dbname=$DB_NAME user=$DB_USER password=$DB_PASS" \
            "$DEPT_FILE" \
            -nln "departement_${DEPT_CODE}" \
            -overwrite \
            -lco GEOMETRY_NAME=geom \
            -lco FID=gid \
            -t_srs EPSG:4326
        
        if [ $? -eq 0 ]; then
            echo "  ✅ departement_${DEPT_CODE} importé"
            ((PROCESSED++))
        else
            echo "  ❌ Erreur lors de l'import de departement_${DEPT_CODE}"
            ((ERRORS++))
        fi
    fi
    
    echo ""
done

echo "📊 Import terminé:"
echo "   ✅ Fichiers traités avec succès: $PROCESSED"
echo "   ❌ Erreurs: $ERRORS"
echo ""

# ----------------------
# STEP 2: CREATE UNIFIED VIEWS
# ----------------------

echo "================================================"
echo "=== ÉTAPE 2: Création des vues unifiées ==="
echo "================================================"
echo ""

# Get all communes tables dynamically
COMMUNES_TABLES=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -A -c "
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename LIKE 'communes_%'
    ORDER BY tablename;
")

# Get all departements tables dynamically
DEPT_TABLES=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -A -c "
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename LIKE 'departement_%'
    ORDER BY tablename;
")

echo "Trouvé $(echo "$COMMUNES_TABLES" | wc -l) tables communes"
echo "Trouvé $(echo "$DEPT_TABLES" | wc -l) tables departements"
echo ""

# ----------------------
# BUILD COMMUNES VIEW
# ----------------------

echo "Création de la vue: all_communes"

COMMUNES_UNION=""
first=true

while IFS= read -r table; do
    [ -z "$table" ] && continue

    if [ "$first" = true ]; then
        first=false
        COMMUNES_UNION="SELECT geom FROM \"$table\""
    else
        COMMUNES_UNION="$COMMUNES_UNION UNION ALL SELECT geom FROM \"$table\""
    fi
done <<< "$COMMUNES_TABLES"

PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME <<EOF
DROP VIEW IF EXISTS all_communes CASCADE;

CREATE VIEW all_communes AS
SELECT 
    row_number() OVER () as gid,
    geom
FROM ($COMMUNES_UNION) AS combined_communes;

-- Create spatial index (materialized for performance)
CREATE INDEX IF NOT EXISTS idx_all_communes_geom ON all_communes USING GIST(geom);
EOF

echo "✅ Vue all_communes créée"

# ----------------------
# BUILD DEPARTEMENTS VIEW
# ----------------------

echo "Création de la vue: all_departements"

DEPTS_UNION=""
first=true

while IFS= read -r table; do
    [ -z "$table" ] && continue
    
    if [ "$first" = true ]; then
        first=false
        DEPTS_UNION="SELECT geom FROM \"$table\""
    else
        DEPTS_UNION="$DEPTS_UNION UNION ALL SELECT geom FROM \"$table\""
    fi
done <<< "$DEPT_TABLES"

PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME <<EOF
DROP VIEW IF EXISTS all_departements CASCADE;

CREATE VIEW all_departements AS
SELECT 
    row_number() OVER () as gid,
    geom
FROM ($DEPTS_UNION) AS combined_departements;

-- Create spatial index
CREATE INDEX IF NOT EXISTS idx_all_departements_geom ON all_departements USING GIST(geom);
EOF

echo "✅ Vue all_departements créée"
echo ""

# ----------------------
# VERIFY VIEWS
# ----------------------

echo "=== Vérification des vues ==="

COMMUNES_COUNT=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -A -c "SELECT COUNT(*) FROM all_communes;")
DEPTS_COUNT=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -A -c "SELECT COUNT(*) FROM all_departements;")

echo "✅ all_communes: $COMMUNES_COUNT features"
echo "✅ all_departements: $DEPTS_COUNT features"
echo ""

# ----------------------
# STEP 3: PUBLISH VIEWS TO GEOSERVER
# ----------------------

echo "================================================"
echo "=== ÉTAPE 3: Publication sur GeoServer ==="
echo "================================================"
echo ""

# Publish communes view
echo "Publication: all_communes"
RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/communes_publish.txt \
    -u "$GEOSERVER_USER:$GEOSERVER_PASS" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{
        "featureType": {
            "name": "all_communes",
            "nativeName": "all_communes",
            "title": "All Communes (France)",
            "abstract": "Vue unifiée de toutes les communes de France métropolitaine"
        }
    }' \
    "$GEOSERVER_URL/rest/workspaces/$WORKSPACE/datastores/$DATASTORE/featuretypes?recalculate=nativebbox,latlonbbox")

if [ "$RESPONSE" = "201" ]; then
    echo "✅ all_communes publié"
else
    echo "⚠️  Status: HTTP $RESPONSE"
    cat /tmp/communes_publish.txt
fi

echo ""

# Publish departements view
echo "Publication: all_departements"
RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/depts_publish.txt \
    -u "$GEOSERVER_USER:$GEOSERVER_PASS" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{
        "featureType": {
            "name": "all_departements",
            "nativeName": "all_departements",
            "title": "All Départements (France)",
            "abstract": "Vue unifiée de tous les départements de France métropolitaine"
        }
    }' \
    "$GEOSERVER_URL/rest/workspaces/$WORKSPACE/datastores/$DATASTORE/featuretypes?recalculate=nativebbox,latlonbbox")

if [ "$RESPONSE" = "201" ]; then
    echo "✅ all_departements publié"
else
    echo "⚠️  Status: HTTP $RESPONSE"
    cat /tmp/depts_publish.txt
fi

echo ""

# ----------------------
# SUMMARY
# ----------------------

echo "================================================"
echo "✅ TRAITEMENT TERMINÉ!"
echo "================================================"
echo ""
echo "📊 Résumé:"
echo "   - Fichiers importés: $PROCESSED"
echo "   - Erreurs: $ERRORS"
echo "   - all_communes: $COMMUNES_COUNT features"
echo "   - all_departements: $DEPTS_COUNT features"
echo ""
echo "🗺️  Utilisez ces couches dans votre application:"
echo "   - primo:all_communes"
echo "   - primo:all_departements"
echo ""
echo "🧪 Test WMS:"
echo "  curl '$GEOSERVER_URL/$WORKSPACE/wms?service=WMS&request=GetMap&layers=$WORKSPACE:all_communes&bbox=-5,41,10,52&width=800&height=600&srs=EPSG:4326&format=image/png' -o test.png"
echo ""
echo "🧪 Test WFS (get features in bbox):"
echo "  curl '$GEOSERVER_URL/$WORKSPACE/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=$WORKSPACE:all_communes&bbox=2.2,48.8,2.5,48.9,EPSG:4326&outputFormat=application/json'"
echo ""
echo "👁️  Preview:"
echo "  $GEOSERVER_URL/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage"
echo "================================================"

# Cleanup
rm -f /tmp/communes_publish.txt /tmp/depts_publish.txt