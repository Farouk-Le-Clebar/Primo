#!/bin/bash

# ================================
#  Import BD TOPO (1 département)
# ================================

set -e

# Dossier source BD TOPO département 31
BDTOPO_DIR=${1:-"./BDTOPO/1_DONNEES_LIVRAISON_2025-09-00199/BDT_3-5_SHP_LAMB93_D031_ED2025-09-15"}

# Connexion PostGIS
DB_HOST=${POSTGIS_HOST:-"localhost"}
DB_PORT=${POSTGIS_PORT:-"5432"}
DB_NAME=${POSTGIS_DATABASE:-"bdtopo"}
DB_USER=${POSTGIS_USER:-"geo_primo"}
DB_PASSWORD=${POSTGIS_PASSWORD:-"G30S3cr3tP@ss"}

PG_CONN="PG:host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER password=$DB_PASSWORD"

echo "🚀 Import BD TOPO - Département 31 (Haute-Garonne)"
echo "📁 Répertoire : $BDTOPO_DIR"
echo ""

# Vérification
if [ ! -d "$BDTOPO_DIR" ]; then
  echo "❌ Erreur : Le dossier $BDTOPO_DIR n'existe pas."
  exit 1
fi

# Activer PostGIS
echo "🔧 Activation PostGIS..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME \
  -c "CREATE EXTENSION IF NOT EXISTS postgis;"

echo ""

# Fonction d'import générique
import_layer() {
    local theme=$1
    local shp=$2
    local table=$3

    local path="$BDTOPO_DIR/$theme/$shp.shp"

    if [ ! -f "$path" ]; then
        echo "⛔ Manquant : $path"
        return
    fi

    echo "📥 Import de $shp → table $table"

    ogr2ogr -f "PostgreSQL" \
      "$PG_CONN" \
      "$path" \
      -nln "$table" \
      -lco GEOMETRY_NAME=geom \
      -lco SPATIAL_INDEX=GIST \
      -lco FID=gid \
      -nlt PROMOTE_TO_MULTI \
      -s_srs EPSG:2154 \
      -t_srs EPSG:4326 \
      -overwrite \
      -progress

    echo "✅ Importé : $table"
}

# =============================
#   Import des thèmes disponibles
#   (selon l’arborescence IGN)
# =============================

echo "📦 Import des thèmes detectés"
echo ""

# BATI
import_layer "BATI" "BATIMENT" "batiment"
import_layer "BATI" "CONSTRUCTION_SURFACIQUE" "construction_surfacique"
import_layer "BATI" "CONSTRUCTION_LINEAIRE" "construction_lineaire"
import_layer "BATI" "CONSTRUCTION_PONCTUELLE" "construction_ponctuelle"

# ADRESSES
import_layer "ADRESSES" "ADRESSE" "adresse"
import_layer "ADRESSES" "LIEU_DIT_HABITE" "lieu_dit_habite"

# ADMINISTRATIF
import_layer "ADMINISTRATIF" "COMMUNE" "commune"
import_layer "ADMINISTRATIF" "DEPARTEMENT" "departement"
import_layer "ADMINISTRATIF" "REGION" "region"

# HYDROGRAPHIE
import_layer "HYDROGRAPHIE" "COURS_D_EAU" "cours_eau"
import_layer "HYDROGRAPHIE" "TRONCON_HYDROGRAPHIQUE" "troncon_hydrographique"
import_layer "HYDROGRAPHIE" "PLAN_D_EAU" "plan_eau"

# TRANSPORT
import_layer "TRANSPORT" "TRONCON_DE_ROUTE" "troncon_route"
import_layer "TRANSPORT" "ROUTE" "route"
import_layer "TRANSPORT" "TRONCON_VOIE_FERREE" "troncon_voie_ferree"

# LIEUX NOMMÉS
import_layer "LIEUX_NOMMES" "LIEU_DIT_NON_HABITE" "lieu_dit_non_habite"

echo ""
echo "🎉 Import terminé !"
echo ""