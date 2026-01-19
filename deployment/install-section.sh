#!/bin/bash

# ----------------------
# CONFIG
# ----------------------
DB_HOST="localhost"  # Pour le script qui tourne sur l'hôte
DB_NAME="bdtopo"
DB_USER="geo_primo"
DB_PASS="G30S3cr3tP@ss"

GEOSERVER_URL="http://localhost:8080/geoserver"
GEOSERVER_USER="admin"
GEOSERVER_PASS="geoserver_primo"
WORKSPACE="primo"
DATASTORE="primo-postgis"

# HOST pour GeoServer (depuis le container Docker)
GEOSERVER_DB_HOST="postgis"  # NOM DU CONTAINER

BASE_URL="https://cadastre.data.gouv.fr/data/etalab-cadastre/2025-09-01/shp/departements"
DATA_DIR="./data/sections"
EXTRACT_DIR="./data/sections_extracted"

DEPARTEMENTS=( "01" "02" "03" "04" "05" "06" "07" "08" "09" "10" "11" "12" "13" "14" "15" "16" "17" "18" "19" "21" "22" "23" "24" "25" "26" "27" "28" "29" "2A" "2B" "30" "31" "32" "33" "34" "35" "36" "37" "38" "39" "40" "41" "42" "43" "44" "45" "46" "47" "48" "49" "50" "51" "52" "53" "54" "55" "56" "57" "58" "59" "60" "61" "62" "63" "64" "65" "66" "67" "68" "69" "70" "71" "72" "73" "74" "75" "76" "77" "78" "79" "80" "81" "82" "83" "84" "85" "86" "87" "88" "89" "90" "91" "92" "93" "94" "95" "971" "972" "973" "974" "976" )

mkdir -p "$DATA_DIR" "$EXTRACT_DIR"

# Compteurs
TOTAL_DEPTS=${#DEPARTEMENTS[@]}
SUCCESS_COUNT=0
FAILED_COUNT=0
CURRENT=0
START_TIME=$(date +%s)

# ----------------------
# INITIALISATION GEOSERVER
# ----------------------
echo "========================================"
echo "🚀 INITIALISATION GEOSERVER"
echo "========================================"

# 1. Vérifier/Créer le workspace
echo "📦 [1/3] Vérification du workspace '$WORKSPACE'..."
WORKSPACE_EXISTS=$(curl -s -u "$GEOSERVER_USER:$GEOSERVER_PASS" \
    "$GEOSERVER_URL/rest/workspaces/$WORKSPACE.json" -o /dev/null -w '%{http_code}')

if [ "$WORKSPACE_EXISTS" != "200" ]; then
    echo "   → Création du workspace..."
    curl -s -u "$GEOSERVER_USER:$GEOSERVER_PASS" -X POST \
        -H "Content-Type: application/json" \
        -d "{\"workspace\":{\"name\":\"$WORKSPACE\"}}" \
        "$GEOSERVER_URL/rest/workspaces"
    echo "   ✓ Workspace créé"
else
    echo "   ✓ Workspace existe déjà"
fi

# 2. Vérifier/Créer le datastore PostGIS
echo "🗄️  [2/3] Vérification du datastore '$DATASTORE'..."
DATASTORE_EXISTS=$(curl -s -u "$GEOSERVER_USER:$GEOSERVER_PASS" \
    "$GEOSERVER_URL/rest/workspaces/$WORKSPACE/datastores/$DATASTORE.json" -o /dev/null -w '%{http_code}')

if [ "$DATASTORE_EXISTS" != "200" ]; then
    echo "   → Création du datastore PostGIS..."
    curl -s -u "$GEOSERVER_USER:$GEOSERVER_PASS" -X POST \
        -H "Content-Type: application/json" \
        -d "{
            \"dataStore\": {
                \"name\": \"$DATASTORE\",
                \"type\": \"PostGIS\",
                \"enabled\": true,
                \"connectionParameters\": {
                    \"entry\": [
                        {\"@key\":\"host\",\"$\":\"$GEOSERVER_DB_HOST\"},
                        {\"@key\":\"port\",\"$\":\"5432\"},
                        {\"@key\":\"database\",\"$\":\"$DB_NAME\"},
                        {\"@key\":\"user\",\"$\":\"$DB_USER\"},
                        {\"@key\":\"passwd\",\"$\":\"$DB_PASS\"},
                        {\"@key\":\"dbtype\",\"$\":\"postgis\"},
                        {\"@key\":\"schema\",\"$\":\"public\"}
                    ]
                }
            }
        }" \
        "$GEOSERVER_URL/rest/workspaces/$WORKSPACE/datastores"
    echo "   ✓ Datastore créé"
else
    echo "   ✓ Datastore existe déjà"
fi

echo "✅ [3/3] GeoServer prêt"
echo ""

# ----------------------
# TRAITEMENT DES DÉPARTEMENTS
# ----------------------
echo "========================================"
echo "📍 TRAITEMENT DES SECTIONS"
echo "========================================"
echo "Total: $TOTAL_DEPTS départements"
echo ""

for dept in "${DEPARTEMENTS[@]}"; do
    CURRENT=$((CURRENT + 1))
    PERCENTAGE=$(awk "BEGIN {printf \"%.1f\", ($CURRENT/$TOTAL_DEPTS)*100}")
    DEPT_START=$(date +%s)
    
    FILENAME="cadastre-${dept}-sections-shp.zip"
    ZIP_PATH="${DATA_DIR}/${FILENAME}"
    DEPT_EXTRACT_DIR="${EXTRACT_DIR}/${dept}"
    TABLE_NAME="sections_${dept}"

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🏢 Département $dept [$CURRENT/$TOTAL_DEPTS] - $PERCENTAGE%"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # ÉTAPE 1/4 : Téléchargement
    echo -n "   [1/4] 📥 Téléchargement... "
    if [ ! -f "$ZIP_PATH" ]; then
        if curl -f -L -s -o "$ZIP_PATH" "${BASE_URL}/${dept}/${FILENAME}"; then
            echo "✓ ($(du -h "$ZIP_PATH" | cut -f1))"
        else
            echo "✗ Échec"
            FAILED_COUNT=$((FAILED_COUNT + 1))
            continue
        fi
    else
        echo "✓ Déjà présent ($(du -h "$ZIP_PATH" | cut -f1))"
    fi

    # ÉTAPE 2/4 : Extraction
    echo -n "   [2/4] 📦 Extraction... "
    mkdir -p "$DEPT_EXTRACT_DIR"
    if unzip -q -o "$ZIP_PATH" -d "$DEPT_EXTRACT_DIR" 2>/dev/null; then
        SHP_FILE=$(find "$DEPT_EXTRACT_DIR" -name "*.shp" | head -n1)
        if [ -z "$SHP_FILE" ]; then
            echo "✗ Pas de .shp"
            FAILED_COUNT=$((FAILED_COUNT + 1))
            rm -rf "$DEPT_EXTRACT_DIR"
            continue
        fi
        
        FEATURE_COUNT=$(ogrinfo -al -so "$SHP_FILE" 2>/dev/null | grep "Feature Count" | awk '{print $3}')
        if [ -n "$FEATURE_COUNT" ]; then
            echo "✓ ($FEATURE_COUNT sections)"
        else
            echo "✓"
        fi
    else
        echo "✗ Échec"
        FAILED_COUNT=$((FAILED_COUNT + 1))
        continue
    fi

    # ÉTAPE 3/4 : Import PostGIS
    echo -n "   [3/4] 💾 Import PostGIS... "
    IMPORT_START=$(date +%s)
    
    export PGPASSWORD=$DB_PASS
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "DROP TABLE IF EXISTS \"$TABLE_NAME\" CASCADE;" > /dev/null 2>&1
    
    if ogr2ogr -f "PostgreSQL" \
        "PG:host=$DB_HOST port=5432 dbname=$DB_NAME user=$DB_USER password=$DB_PASS" \
        "$SHP_FILE" \
        -nln "$TABLE_NAME" \
        -lco GEOMETRY_NAME=geom \
        -lco SPATIAL_INDEX=GIST \
        -lco PRECISION=NO \
        -t_srs EPSG:4326 \
        -nlt PROMOTE_TO_MULTI \
        --config PG_USE_COPY YES \
        -gt 65536 \
        -overwrite 2>&1 | grep -E "ERROR|FAILURE" > /dev/null; then
        echo "✗ Erreur ogr2ogr"
        FAILED_COUNT=$((FAILED_COUNT + 1))
        rm -rf "$DEPT_EXTRACT_DIR"
        continue
    fi
    
    IMPORT_END=$(date +%s)
    IMPORT_TIME=$((IMPORT_END - IMPORT_START))
    
    ROW_COUNT=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM \"$TABLE_NAME\";" 2>/dev/null | xargs)
    
    if [ -n "$ROW_COUNT" ] && [ "$ROW_COUNT" -gt 0 ]; then
        echo "✓ (${IMPORT_TIME}s, $ROW_COUNT lignes)"
    else
        echo "✗ Table vide ou inexistante"
        FAILED_COUNT=$((FAILED_COUNT + 1))
        rm -rf "$DEPT_EXTRACT_DIR"
        continue
    fi

    # ÉTAPE 4/4 : Publication GeoServer
    echo -n "   [4/4] 🌐 Publication GeoServer... "
    
    curl -s -u "$GEOSERVER_USER:$GEOSERVER_PASS" -X DELETE \
        "$GEOSERVER_URL/rest/workspaces/$WORKSPACE/datastores/$DATASTORE/featuretypes/$TABLE_NAME?recurse=true" \
        > /dev/null 2>&1

    HTTP_CODE=$(curl -s -u "$GEOSERVER_USER:$GEOSERVER_PASS" \
        --connect-timeout 5 \
        --max-time 15 \
        -w "%{http_code}" \
        -o /dev/null \
        -X POST \
        -H "Content-Type: application/json" \
        -d "{
            \"featureType\": {
                \"name\": \"$TABLE_NAME\",
                \"nativeName\": \"$TABLE_NAME\",
                \"title\": \"Sections - Dép. $dept\",
                \"srs\": \"EPSG:4326\",
                \"nativeCRS\": \"EPSG:4326\",
                \"latLonBoundingBox\": {
                    \"minx\": -5.5, \"maxx\": 10,
                    \"miny\": 41, \"maxy\": 51.5,
                    \"crs\": \"EPSG:4326\"
                },
                \"nativeBoundingBox\": {
                    \"minx\": -5.5, \"maxx\": 10,
                    \"miny\": 41, \"maxy\": 51.5,
                    \"crs\": \"EPSG:4326\"
                },
                \"enabled\": true
            }
        }" \
        "$GEOSERVER_URL/rest/workspaces/$WORKSPACE/datastores/$DATASTORE/featuretypes")

    if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
        DEPT_END=$(date +%s)
        DEPT_TIME=$((DEPT_END - DEPT_START))
        echo "✓ (${DEPT_TIME}s total)"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "✗ (HTTP $HTTP_CODE)"
        FAILED_COUNT=$((FAILED_COUNT + 1))
    fi

    rm -rf "$DEPT_EXTRACT_DIR"
    
    if [ $CURRENT -gt 0 ]; then
        ELAPSED=$(($(date +%s) - START_TIME))
        AVG_TIME=$((ELAPSED / CURRENT))
        REMAINING=$((TOTAL_DEPTS - CURRENT))
        ETA=$((REMAINING * AVG_TIME))
        ETA_MIN=$((ETA / 60))
        echo "   ⏱️  Temps: $((ELAPSED/60))min | Restant: ~${ETA_MIN}min"
    fi
    echo ""
done

END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))
TOTAL_MIN=$((TOTAL_TIME / 60))
TOTAL_SEC=$((TOTAL_TIME % 60))

echo "========================================"
echo "📊 RÉSUMÉ"
echo "========================================"
echo "✅ Réussis: $SUCCESS_COUNT/$TOTAL_DEPTS"
echo "❌ Échoués: $FAILED_COUNT/$TOTAL_DEPTS"
echo "⏱️  Durée: ${TOTAL_MIN}min ${TOTAL_SEC}s"
[ $SUCCESS_COUNT -gt 0 ] && echo "📊 Moyenne: $((TOTAL_TIME / SUCCESS_COUNT))s/dept"
echo "========================================"

[ $SUCCESS_COUNT -eq $TOTAL_DEPTS ] && exit 0 || exit 1