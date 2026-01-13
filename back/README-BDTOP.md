🗺️ Intégration BD Topo dans Primo
Guide complet pour intégrer les données BD Topo de l'IGN dans votre projet.

📋 Prérequis
Docker et Docker Compose installés
Node.js 20+
GDAL/OGR installé (pour l'import des données)
Installation de GDAL/OGR
Linux (Ubuntu/Debian):

bash
sudo apt-get update
sudo apt-get install gdal-bin postgresql-client
macOS:

bash
brew install gdal postgresql
Windows: Télécharger depuis https://gdal.org/download.html ou utiliser WSL2

🚀 Installation
1. Télécharger BD Topo
Option recommandée : Format SQL WGS84G

Téléchargez depuis https://geoservices.ign.fr/bdtopo :

BD TOPO® septembre 2025 Tous Thèmes France entière format SQL projection WGS84G
Cette version contient déjà les scripts SQL pour PostGIS et est en WGS84.

Alternative : Shapefiles par département

Si vous préférez les Shapefiles (ce que vous avez déjà) :

Téléchargez les départements souhaités
Placez-les dans BDTOPO/
2. Démarrer les services Docker
bash
# Démarrer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps

# Vous devriez voir :
# - mysql_primo (port 3306)
# - postgis_primo (port 5432)
# - geoserver_primo (port 8081)
# - apicarto (port 6677)
# - addok (port 7878)
# - graphhopper (port 8989)
3. Vérifier PostGIS
bash
# Se connecter à PostGIS
docker exec -it postgis_primo psql -U geo_primo -d bdtopo

# Dans psql :
SELECT version();
SELECT PostGIS_Version();

# Sortir
\q
4. Importer les données BD Topo
Option A : Import depuis SQL (recommandé)
Si vous avez téléchargé le format SQL :

bash
# Extraire l'archive
cd /chemin/vers/telechargements
unzip BDTOPO_SQL_WGS84G_*.zip

# Importer dans PostGIS
cd BDTOPO_SQL
psql -h localhost -p 5432 -U geo_primo -d bdtopo -f bdtopo_france.sql
Option B : Import depuis Shapefiles
Si vous avez les Shapefiles :

bash
# Rendre le script exécutable
chmod +x import-bdtopo.sh

# Lancer l'import
./import-bdtopo.sh ./BDTOPO/1_DONNEES_LIVRAISON_2025-09-00199/BDT_3-5_SHP_LAMB93_D031_ED2025-09-15

# L'import peut prendre 10-30 minutes selon la taille
5. Vérifier l'import
bash
# Lister les tables importées
docker exec -it postgis_primo psql -U geo_primo -d bdtopo -c "\dt"

# Compter les bâtiments
docker exec -it postgis_primo psql -U geo_primo -d bdtopo -c "SELECT COUNT(*) FROM batiment;"
🔧 Configuration GeoServer
1. Accéder à GeoServer
Ouvrez http://localhost:8081/geoserver dans votre navigateur.

Identifiants par défaut :

Username: admin
Password: geoserver_primo
2. Créer un workspace
Cliquez sur "Workspaces" → "Add new workspace"
Name: bdtopo
Namespace URI: http://primo.geo/bdtopo
Default Workspace: ☑️ (cocher)
Cliquez sur "Save"
3. Ajouter le store PostGIS
Cliquez sur "Stores" → "Add new Store" → "PostGIS"
Configurez :
Workspace: bdtopo
Data Source Name: bdtopo_postgis
Description: BD Topo France
host: postgis (nom du service Docker)
port: 5432
database: bdtopo
schema: public
user: geo_primo
passwd: G30S3cr3tP@ss
Cliquez sur "Save"
4. Publier les couches
Pour chaque table (batiment, adresse, route, etc.) :

Cliquez sur "Layers" → "Add a new layer"
Sélectionnez "bdtopo:bdtopo_postgis"
Cliquez sur "Publish" à côté de chaque table
Dans l'onglet "Data" :
Compute from data (pour la BBox native)
Compute from native bounds (pour la BBox lat/lon)
Dans l'onglet "Publishing" :
Cocher "WFS" et "WMS"
Cliquez sur "Save"
Couches prioritaires à publier :

batiment (bâtiments)
adresse (adresses)
troncon_route (routes)
cours_eau (hydrographie)
zone_vegetation (végétation)
commune (limites communales)
🔌 Installation du backend NestJS
1. Installer les dépendances
bash
cd Back
npm install @nestjs/axios axios
2. Copier les fichiers
Copiez les fichiers fournis dans votre projet :

Back/
  src/
    api/
      geoserver.middleware.ts    # ← Nouveau
    geo/                         # ← Nouveau dossier
      dto/
        geo.dto.ts
      geo.module.ts
      geo.service.ts
      geo.controller.ts
    app.module.ts                # ← Mettre à jour
3. Mettre à jour .env
Ajoutez les variables dans votre .env :

env
POSTGIS_HOST=localhost
POSTGIS_PORT=5432
POSTGIS_DATABASE=bdtopo
POSTGIS_USER=geo_primo
POSTGIS_PASSWORD=G30S3cr3tP@ss

GEOSERVER_URL=http://localhost:8081/geoserver
GEOSERVER_WORKSPACE=bdtopo
GEOSERVER_USER=admin
GEOSERVER_PASSWORD=geoserver_primo
4. Démarrer le backend
bash
npm run start:dev
🧪 Tester l'API
1. Vérifier que GeoServer répond
bash
# Via le proxy NestJS
curl http://localhost:3000/geoserver/bdtopo/wfs?service=WFS&version=2.0.0&request=GetCapabilities

# Ou directement
curl http://localhost:8081/geoserver/bdtopo/wfs?service=WFS&version=2.0.0&request=GetCapabilities
2. Récupérer les bâtiments dans une zone
bash
# Paris (exemple de bbox)
curl "http://localhost:3000/geo/batiments?bbox=2.3,48.85,2.35,48.87"
3. Récupérer les infos d'une parcelle
bash
curl -X POST http://localhost:3000/geo/parcel-info \
  -H "Content-Type: application/json" \
  -d '{
    "parcelId": "31555000AB0123",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [1.4437, 43.6047],
        [1.4447, 43.6047],
        [1.4447, 43.6037],
        [1.4437, 43.6037],
        [1.4437, 43.6047]
      ]]
    }
  }'
Réponse attendue :

json
{
  "parcelId": "31555000AB0123",
  "bdtopo": {
    "batiments": [
      {
        "id": "BATIMENT0000001",
        "nature": "Indifférenciée",
        "usage1": "Résidentiel",
        "hauteur": 12,
        "nbEtages": 3,
        "geometry": {...}
      }
    ],
    "adresses": [...],
    "routes": [...],
    "hydrographie": [...],
    "vegetation": [...],
    "pointsInteret": [...]
  },
  "statistics": {
    "nombreBatiments": 5,
    "nombreAdresses": 12,
    "longueurRoutes": 245.5,
    "surfaceVegetation": 1250
  }
}
4. Lister les couches disponibles
bash
curl http://localhost:3000/geo/layers
🎨 Intégration Frontend React
Installation d'OpenLayers
bash
cd Front
npm install ol
Exemple de composant carte
tsx
import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

export function ParcelMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Couche de base OpenStreetMap
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    // Couche cadastre (APICarto)
    const cadastreLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: (extent) => {
          return `http://localhost:3000/apicarto/cadastre/parcelle?geom=${JSON.stringify({ type: 'Polygon', coordinates: [[extent]] })}`;
        },
        strategy: bbox,
      }),
      style: {
        'stroke-color': '#3388ff',
        'stroke-width': 2,
        'fill-color': 'rgba(51, 136, 255, 0.1)',
      },
    });

    // Couche bâtiments BD Topo
    const batimentsLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: (extent) => {
          const bbox = extent.join(',');
          return `http://localhost:3000/geo/batiments?bbox=${bbox}`;
        },
        strategy: bbox,
      }),
      style: {
        'fill-color': 'rgba(255, 0, 0, 0.4)',
        'stroke-color': '#cc0000',
        'stroke-width': 1,
      },
    });

    // Couche routes BD Topo
    const routesLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: (extent) => {
          const bbox = extent.join(',');
          return `http://localhost:3000/geo/routes?bbox=${bbox}`;
        },
        strategy: bbox,
      }),
      style: {
        'stroke-color': '#666666',
        'stroke-width': 2,
      },
    });

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [osmLayer, cadastreLayer, batimentsLayer, routesLayer],
      view: new View({
        center: fromLonLat([1.4437, 43.6047]), // Toulouse
        zoom: 15,
      }),
    });

    setMap(mapInstance);

    return () => {
      mapInstance.setTarget(undefined);
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
📊 Données disponibles par thème
BATI
batiment : tous les bâtiments
construction_lineaire : murs, clôtures
construction_ponctuelle : pylônes, antennes
construction_surfacique : réservoirs, silos
ADRESSES
adresse : points adresse
lieu_dit_habite : hameaux, lieux-dits
TRANSPORT
troncon_route : segments de routes
route : routes complètes
chemin : chemins, sentiers
troncon_voie_ferree : voies ferrées
aerodrome : aéroports
piste_aerodrome : pistes
HYDROGRAPHIE
cours_eau : rivières, fleuves
plan_eau : lacs, étangs
surface_eau : zones inondables
troncon_hydrographique : segments
ADMINISTRATIF
commune : limites communales
departement : limites départementales
region : limites régionales
epci : intercommunalités
OCCUPATION_DU_SOL
zone_vegetation : forêts, zones boisées
haie : haies
SERVICES_ET_ACTIVITES (PAI)
pai_enseignement : écoles, universités
pai_sante : hôpitaux, cliniques
pai_sport : stades, gymnases
pai_culture_loisirs : musées, théâtres
pai_admin_militaire : mairies, casernes
🔍 Requêtes utiles
Trouver tous les bâtiments d'une commune
sql
SELECT b.* 
FROM batiment b
JOIN commune c ON ST_Intersects(b.geom, c.geom)
WHERE c.nom = 'Toulouse';
Calculer la densité de bâtiments par commune
sql
SELECT 
  c.nom AS commune,
  COUNT(b.id) AS nombre_batiments,
  ST_Area(c.geom::geography) / 1000000 AS surface_km2,
  COUNT(b.id) / (ST_Area(c.geom::geography) / 1000000) AS densite
FROM commune c
LEFT JOIN batiment b ON ST_Intersects(b.geom, c.geom)
GROUP BY c.nom, c.geom;
Trouver les routes principales à moins de 100m d'une parcelle
sql
WITH parcelle AS (
  SELECT ST_GeomFromText('POLYGON((...))', 4326) AS geom
)
SELECT r.*
FROM troncon_route r, parcelle p
WHERE r.importance IN ('1', '2', '3')  -- Routes principales
  AND ST_DWithin(r.geom::geography, p.geom::geography, 100);
⚠️ Résolution des problèmes
GeoServer ne démarre pas
bash
# Vérifier les logs
docker logs geoserver_primo

# Augmenter la mémoire dans docker-compose.yml
INITIAL_MEMORY: 4G
MAXIMUM_MEMORY: 8G
PostGIS : connexion refusée
bash
# Vérifier que PostGIS est démarré
docker ps | grep postgis

# Tester la connexion
docker exec -it postgis_primo psql -U geo_primo -d bdtopo -c "SELECT 1;"
Import des données très lent
Désactiver temporairement les index pendant l'import
Utiliser ogr2ogr avec l'option -gt 65536 pour augmenter la taille des transactions
Importer département par département en parallèle
Erreur "layer not found" dans GeoServer
Vérifier que la couche est bien publiée
Vérifier le nom du workspace dans l'URL
Rafraîchir le cache GeoServer : "Tile Caching" → "Mass truncate"
🚀 Optimisations
1. Créer des index spatiaux
sql
-- Si pas déjà créés par ogr2ogr
CREATE INDEX idx_batiment_geom ON batiment USING GIST(geom);
CREATE INDEX idx_adresse_geom ON adresse USING GIST(geom);
CREATE INDEX idx_troncon_route_geom ON troncon_route USING GIST(geom);
2. Créer des index sur les attributs fréquemment utilisés
sql
CREATE INDEX idx_batiment_nature ON batiment(nature);
CREATE INDEX idx_troncon_route_importance ON troncon_route(importance);
CREATE INDEX idx_commune_nom ON commune(nom);
3. Activer le cache dans GeoServer
"Tile Caching" → "Tile Layers"
Activer le cache pour les couches les plus utilisées
Configurer les niveaux de zoom
📚 Ressources
Documentation BD Topo
Documentation GeoServer
Documentation PostGIS
Documentation OpenLayers
Standard WFS
🎯 Prochaines étapes
✅ Installer et configurer PostGIS et GeoServer
✅ Importer les données BD Topo
✅ Tester l'API NestJS
🔲 Intégrer la carte dans le frontend React
🔲 Ajouter des filtres et recherches avancées
🔲 Optimiser les performances avec le cache
🔲 Ajouter d'autres départements si nécessaire
