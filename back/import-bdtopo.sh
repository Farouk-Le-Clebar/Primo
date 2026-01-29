#!/bin/bash

set -e


CLEANUP_ARCHIVES=${CLEANUP_ARCHIVES:-true}
CLEANUP_DATA=${CLEANUP_DATA:-false}
KEEP_ONLY_POSTGIS=${KEEP_ONLY_POSTGIS:-false}

# Région à télécharger (départements Occitanie par défaut)
REGION_NAME="Occitanie"
DEPARTMENTS=(
  # "09:Ariege"
  # "11:Aude"
  # "12:Aveyron"
  # "30:Gard"
  "31:HauteGaronne"
  # "32:Gers"
  # "34:Herault"
  "46:Lot"
  # "48:Lozere"
  # "65:HautesPyrenees"
  # "66:PyreneesOrientales"
  # "81:Tarn"
  # "82:TarnEtGaronne"
)

BDTOPO_ROOT="./BDTOPO"
DOWNLOAD_DIR="$BDTOPO_ROOT/downloads"
DATA_DIR="$BDTOPO_ROOT/data"

DB_HOST=${POSTGIS_HOST:-"localhost"}
DB_PORT=${POSTGIS_PORT:-"5432"}
DB_NAME=${POSTGIS_DATABASE:-"bdtopo"}
DB_USER=${POSTGIS_USER:-"geo_primo"}
DB_PASSWORD=${POSTGIS_PASSWORD:-"G30S3cr3tP@ss"}

GEOSERVER_URL=${GEOSERVER_URL:-"http://localhost:8081/geoserver"}
GEOSERVER_USER=${GEOSERVER_USER:-"admin"}
GEOSERVER_PASSWORD=${GEOSERVER_PASSWORD:-"geoserver_primo"}
GEOSERVER_WORKSPACE=${GEOSERVER_WORKSPACE:-"bdtopo"}

PG_CONN="PG:host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER password=$DB_PASSWORD"

THEMES_TO_KEEP=(
  "BATI"
  "HYDROGRAPHIE"
  "LIEUX_NOMMES"
  "OCCUPATION_DU_SOL"
  "SERVICES_ET_ACTIVITES"
)

print_header() {
  echo ""
  echo "========================================="
  echo "$1"
  echo "========================================="
  echo ""
}

print_info() {
  echo "ℹ️  $1"
}

print_success() {
  echo "✅ $1"
}

print_error() {
  echo "❌ $1"
}

print_warning() {
  echo "⚠️  $1"
}

check_dependencies() {
  print_header "Vérification des dépendances"
  
  local deps=("curl" "7z" "ogr2ogr" "psql")
  local missing=()
  
  for cmd in "${deps[@]}"; do
    if ! command -v "$cmd" &> /dev/null; then
      missing+=("$cmd")
      print_error "$cmd n'est pas installé"
    else
      print_success "$cmd trouvé"
    fi
  done
  
  if [ ${#missing[@]} -ne 0 ]; then
    print_error "Dépendances manquantes : ${missing[*]}"
    echo ""
    echo "Installation requise :"
    echo "  Ubuntu/Debian: sudo apt-get install curl p7zip-full gdal-bin postgresql-client"
    echo "  macOS: brew install curl p7zip gdal postgresql"
    exit 1
  fi
  
  print_success "Toutes les dépendances sont installées"
}

setup_directories() {
  print_header "Création de la structure de dossiers"
  
  mkdir -p "$DOWNLOAD_DIR"
  mkdir -p "$DATA_DIR"
  
  print_success "Dossiers créés : $BDTOPO_ROOT"
}

download_department() {
  local dept_code=$1
  local dept_name=$2
  
  print_info "Téléchargement du département $dept_code - $dept_name"
  
  local base_url="https://data.geopf.fr/telechargement/download/BDTOPO"
  local file_base="BDTOPO_3-5_TOUSTHEMES_SHP_LAMB93_D0${dept_code}_2025-09-15"
  local archive_name="${file_base}.7z"
  local download_path="$DOWNLOAD_DIR/$archive_name"
  local url="$base_url/$file_base/$archive_name"
  
  if [ -f "$download_path" ]; then
    print_warning "Archive déjà téléchargée : $archive_name"
    return 0
  fi
  
  print_info "URL : $url"
  if curl -L -f -o "$download_path" "$url" --progress-bar; then
    print_success "Téléchargé : $archive_name ($(du -h "$download_path" | cut -f1))"
  else
    print_error "Échec du téléchargement : $url"
    return 1
  fi
}

extract_and_clean_department() {
  local dept_code=$1
  local dept_name=$2
  
  print_info "Extraction du département $dept_code - $dept_name"
  
  local archive_name="BDTOPO_3-5_TOUSTHEMES_SHP_LAMB93_D0${dept_code}_2025-09-15.7z"
  local archive_path="$DOWNLOAD_DIR/$archive_name"
  local extract_temp="$DOWNLOAD_DIR/temp_${dept_code}"
  local final_dir="$DATA_DIR/${dept_code}-${dept_name}"
  
  if [ -d "$final_dir" ]; then
    print_warning "Département déjà extrait : $final_dir"
    return 0
  fi
  
  mkdir -p "$extract_temp"
  if ! 7z x "$archive_path" -o"$extract_temp" -y > /dev/null; then
    print_error "Échec de l'extraction : $archive_name"
    rm -rf "$extract_temp"
    return 1
  fi
  
  local data_folder=$(find "$extract_temp" -type d -name "BDT_*" | head -1)
  
  if [ -z "$data_folder" ]; then
    print_error "Structure de dossier non reconnue dans $extract_temp"
    rm -rf "$extract_temp"
    return 1
  fi
  
  print_info "Dossier source trouvé : $data_folder"
  
  mkdir -p "$final_dir"
  
  for theme in "${THEMES_TO_KEEP[@]}"; do
    local theme_dir="$data_folder/$theme"
    if [ -d "$theme_dir" ]; then
      cp -r "$theme_dir" "$final_dir/"
      print_success "Copié : $theme"
    else
      print_warning "Thème non trouvé : $theme"
    fi
  done
  
  rm -rf "$extract_temp"
  
  # Supprimer l'archive si demandé
  if [ "$CLEANUP_ARCHIVES" = true ]; then
    print_info "Suppression de l'archive : $archive_name"
    rm -f "$archive_path"
  fi
  
  print_success "Département extrait et nettoyé : $final_dir"
}

setup_postgis() {
  print_header "Activation de PostGIS"
  
  PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    -c "CREATE EXTENSION IF NOT EXISTS postgis;" 2>/dev/null || true
  
  print_success "PostGIS activé"
}

import_layer() {
  local dept_code=$1
  local dept_name=$2
  local theme=$3
  local shapefile=$4
  local table_name=$5
  
  local dept_dir="$DATA_DIR/${dept_code}-${dept_name}"
  local shp_path="$dept_dir/$theme/$shapefile.shp"
  
  if [ ! -f "$shp_path" ]; then
    print_warning "Fichier non trouvé : $shp_path"
    return 0
  fi
  
  print_info "Import : $shapefile → $table_name"
  
  local final_table="${table_name}_${dept_code}"
  
  if ogr2ogr -f "PostgreSQL" \
    "$PG_CONN" \
    "$shp_path" \
    -nln "$final_table" \
    -lco GEOMETRY_NAME=geom \
    -lco SPATIAL_INDEX=GIST \
    -lco FID=gid \
    -nlt PROMOTE_TO_MULTI \
    -s_srs EPSG:2154 \
    -t_srs EPSG:4326 \
    -overwrite \
    -progress 2>/dev/null; then
    print_success "Importé : $final_table"
  else
    print_error "Échec import : $final_table"
  fi
}

import_department_layers() {
  local dept_code=$1
  local dept_name=$2
  
  print_header "Import des couches du département $dept_code - $dept_name"
  
  import_layer "$dept_code" "$dept_name" "BATI" "BATIMENT" "batiment"
  import_layer "$dept_code" "$dept_name" "BATI" "CONSTRUCTION_SURFACIQUE" "construction_surfacique"
  import_layer "$dept_code" "$dept_name" "BATI" "CONSTRUCTION_LINEAIRE" "construction_lineaire"
  import_layer "$dept_code" "$dept_name" "BATI" "CONSTRUCTION_PONCTUELLE" "construction_ponctuelle"
  
  import_layer "$dept_code" "$dept_name" "HYDROGRAPHIE" "COURS_D_EAU" "cours_eau"
  import_layer "$dept_code" "$dept_name" "HYDROGRAPHIE" "PLAN_D_EAU" "plan_eau"
  import_layer "$dept_code" "$dept_name" "HYDROGRAPHIE" "SURFACE_EAU" "surface_eau"
  import_layer "$dept_code" "$dept_name" "HYDROGRAPHIE" "TRONCON_HYDROGRAPHIQUE" "troncon_hydrographique"
  
  import_layer "$dept_code" "$dept_name" "LIEUX_NOMMES" "LIEU_DIT_NON_HABITE" "lieu_dit_non_habite"
  import_layer "$dept_code" "$dept_name" "LIEUX_NOMMES" "DETAIL_OROGRAPHIQUE" "detail_orographique"
  
  import_layer "$dept_code" "$dept_name" "OCCUPATION_DU_SOL" "ZONE_VEGETATION" "zone_vegetation"
  import_layer "$dept_code" "$dept_name" "OCCUPATION_DU_SOL" "HAIE" "haie"
  
  import_layer "$dept_code" "$dept_name" "SERVICES_ET_ACTIVITES" "PAI_ADMINISTRATIF_MILITAIRE" "pai_admin_militaire"
  import_layer "$dept_code" "$dept_name" "SERVICES_ET_ACTIVITES" "PAI_CULTURE_LOISIRS" "pai_culture_loisirs"
  import_layer "$dept_code" "$dept_name" "SERVICES_ET_ACTIVITES" "PAI_ENSEIGNEMENT" "pai_enseignement"
  import_layer "$dept_code" "$dept_name" "SERVICES_ET_ACTIVITES" "PAI_GESTION_EAUX" "pai_gestion_eaux"
  import_layer "$dept_code" "$dept_name" "SERVICES_ET_ACTIVITES" "PAI_SANTE" "pai_sante"
  import_layer "$dept_code" "$dept_name" "SERVICES_ET_ACTIVITES" "PAI_SPORT" "pai_sport"
  
  print_success "Import terminé pour le département $dept_code"
}

publish_layer_geoserver() {
  local layer_name=$1
  local dept_code=$2
  
  print_info "Publication GeoServer : $layer_name"
  
  local full_layer="${layer_name}_${dept_code}"
  local store="bdtopo_postgis"
  
  local layer_xml="<featureType>
    <name>${full_layer}</name>
    <nativeName>${full_layer}</nativeName>
    <title>BD Topo - ${layer_name} (${dept_code})</title>
    <srs>EPSG:4326</srs>
    <projectionPolicy>FORCE_DECLARED</projectionPolicy>
    <enabled>true</enabled>
  </featureType>"
  
  curl -s -u "${GEOSERVER_USER}:${GEOSERVER_PASSWORD}" \
    -X POST \
    -H "Content-Type: application/xml" \
    -d "$layer_xml" \
    "${GEOSERVER_URL}/rest/workspaces/${GEOSERVER_WORKSPACE}/datastores/${store}/featuretypes" \
    > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    print_success "Publié : $full_layer"
  else
    print_warning "Erreur publication : $full_layer (peut-être déjà publié)"
  fi
}

create_layer_group() {
  local dept_code=$1
  local dept_name=$2
  
  print_header "Création du Layer Group pour le département $dept_code"
  
  local group_name="bdtopo_${dept_code}"
  
  local layers=(
    "batiment_${dept_code}"
    "cours_eau_${dept_code}"
    "plan_eau_${dept_code}"
    "zone_vegetation_${dept_code}"
  )
  
  local layers_xml=""
  for layer in "${layers[@]}"; do
    layers_xml+="<publishable><type>layer</type><name>${GEOSERVER_WORKSPACE}:${layer}</name></publishable>"
  done
  
  local group_xml="<layerGroup>
    <name>${group_name}</name>
    <title>BD Topo - ${dept_name} (${dept_code})</title>
    <abstractTxt>Groupe de couches BD Topo pour le département ${dept_code} - ${dept_name}</abstractTxt>
    <workspace><name>${GEOSERVER_WORKSPACE}</name></workspace>
    <publishables>${layers_xml}</publishables>
    <styles></styles>
    <bounds>
      <minx>-180</minx>
      <maxx>180</maxx>
      <miny>-90</miny>
      <maxy>90</maxy>
      <crs>EPSG:4326</crs>
    </bounds>
  </layerGroup>"
  
  curl -s -u "${GEOSERVER_USER}:${GEOSERVER_PASSWORD}" \
    -X POST \
    -H "Content-Type: application/xml" \
    -d "$group_xml" \
    "${GEOSERVER_URL}/rest/workspaces/${GEOSERVER_WORKSPACE}/layergroups" \
    > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    print_success "Layer Group créé : $group_name"
  else
    print_warning "Erreur création Layer Group (peut-être déjà existant)"
  fi
}

publish_department_layers() {
  local dept_code=$1
  local dept_name=$2
  
  print_header "Publication des couches du département $dept_code dans GeoServer"
  
  if ! curl -s -u "${GEOSERVER_USER}:${GEOSERVER_PASSWORD}" \
    "${GEOSERVER_URL}/rest/about/version.xml" > /dev/null 2>&1; then
    print_error "GeoServer non accessible à $GEOSERVER_URL"
    print_warning "Ignoré : publication GeoServer"
    return 1
  fi
  
  local layers=("batiment" "cours_eau" "plan_eau" "zone_vegetation" "haie" "lieu_dit_non_habite")
  
  for layer in "${layers[@]}"; do
    publish_layer_geoserver "$layer" "$dept_code"
  done
  
  create_layer_group "$dept_code" "$dept_name"
  
  print_success "Publication terminée pour le département $dept_code"
}

main() {
  print_header "🗺️  Import BD TOPO - Région $REGION_NAME"
  
  check_dependencies
  setup_directories
  
  for dept in "${DEPARTMENTS[@]}"; do
    IFS=':' read -r dept_code dept_name <<< "$dept"
    
    print_header "Traitement du département $dept_code - $dept_name"
    
    if ! download_department "$dept_code" "$dept_name"; then
      print_warning "Passage au département suivant"
      continue
    fi
    
    if ! extract_and_clean_department "$dept_code" "$dept_name"; then
      print_warning "Passage au département suivant"
      continue
    fi
    
    if [ "$dept_code" == "31" ]; then
      setup_postgis
    fi
    
    import_department_layers "$dept_code" "$dept_name"
    
    if [ "$CLEANUP_DATA" = true ]; then
      print_info "Suppression des données extraites : ${dept_code}-${dept_name}"
      rm -rf "$DATA_DIR/${dept_code}-${dept_name}"
    fi
    
    publish_department_layers "$dept_code" "$dept_name"
    
    print_success "Département $dept_code - $dept_name terminé !"
  done
  
  print_header "📊 Statistiques PostGIS"
  
  PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
      tablename AS couche,
      pg_size_pretty(pg_total_relation_size('public.'||tablename)) AS taille
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename LIKE '%_09'
      OR tablename LIKE '%_11'
      OR tablename LIKE '%_12'
      OR tablename LIKE '%_30'
      OR tablename LIKE '%_31'
      OR tablename LIKE '%_32'
      OR tablename LIKE '%_34'
      OR tablename LIKE '%_46'
      OR tablename LIKE '%_48'
      OR tablename LIKE '%_65'
      OR tablename LIKE '%_66'
      OR tablename LIKE '%_81'
      OR tablename LIKE '%_82'
    ORDER BY pg_total_relation_size('public.'||tablename) DESC
    LIMIT 20;
  " 2>/dev/null || print_warning "Impossible d'afficher les statistiques"
  
  print_header "🎉 Import BD TOPO terminé !"
  echo ""
  echo "📁 Données dans : $DATA_DIR"
  echo "🗄️  Base PostGIS : $DB_NAME@$DB_HOST:$DB_PORT"
  echo "🌐 GeoServer : $GEOSERVER_URL"
  echo ""
  echo "Layer Groups GeoServer créés :"
  for dept in "${DEPARTMENTS[@]}"; do
    IFS=':' read -r dept_code dept_name <<< "$dept"
    echo "  - bdtopo_${dept_code} (${dept_name})"
  done
  echo ""
  
  if [ "$KEEP_ONLY_POSTGIS" = true ]; then
    print_header "🧹 Nettoyage complet (mode économie d'espace)"
    print_info "Suppression de toutes les données téléchargées et extraites..."
    rm -rf "$DOWNLOAD_DIR"
    rm -rf "$DATA_DIR"
    print_success "Nettoyage terminé - Seules les données PostGIS sont conservées"
    echo ""
    echo "💾 Espace libéré : ~5-7 GB (Occitanie)"
  elif [ "$CLEANUP_ARCHIVES" = true ] || [ "$CLEANUP_DATA" = true ]; then
    local saved_space="0"
    [ "$CLEANUP_ARCHIVES" = true ] && saved_space="~2-3 GB"
    [ "$CLEANUP_DATA" = true ] && saved_space="~3-4 GB"
    [ "$CLEANUP_ARCHIVES" = true ] && [ "$CLEANUP_DATA" = true ] && saved_space="~5-7 GB"
    echo "💾 Espace libéré : $saved_space (Occitanie)"
  fi
}

main "$@"