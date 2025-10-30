# GraphHopper

## Document simple pour expliquer l'architecture et ce qui pourrait être amélioré

### Architecture actuelle

Chaque région possède son propre dossier dans `gh-data` avec un fichier `config.yml` pointant vers le fichier OSM de la région, un fichier `.poly` pour les limites géographiques, et (après téléchargement) un fichier `osm.pbf`.

Le dossier gh-manager contient un dockerfile simple qui permet de lancer l'image docker du service graphhopper et un fichier `regions.config.json` qui orchestre toutes les informations pour les régions.

Au premier lancement d'une requete de région, il y aura plus de temps car il faut du temps pour générer les fichiers de régions. Après cela, c'est casiment instantané.

### Améliorations possibles

- Centraliser les configurations dans un seul fichier JSON ou YAML pour éviter la duplication. (Script qui remplace le nom du fichier à config ou param internes ?)

- Adapter les requetes & peut-etre se passer des fichiers .poly si on peut passer le département directement dans la requete à GraphHopper.

- Ajouter des régions "préférées" pour les régions utilisées fréquemment afin de limiter les temps de charge.

### Exemple de requete :

- __point=lat,lon__ du point de départ
- __point=lat,lon__ du point d'arrivée
- __profile=car|bike|foot__
- __region=nom-de-la-region__ (optionnel) (voir fichier config région dans gh-manager/regions.config.json)


**Sans région :**
GET `http://localhost:3000/graphhopper/route?point=41.9268,8.7369&point=41.9186,8.7288&profile=car&locale=fr`

**Avec région (Corse) :**
GET `http://localhost:3000/graphhopper/route?point=41.9268,8.7369&point=41.9186,8.7288&profile=car&region=corse&locale=fr`

**Réponse :**

```json
{
  "hints": {
    "visited_nodes.sum": 54,
    "visited_nodes.average": 54.0
  },
  "info": {
    "copyrights": ["GraphHopper", "OpenStreetMap contributors"],
    "took": 7,
    "road_data_timestamp": "2025-10-28T21:20:56Z"
  },
  "paths": [
    {
      "distance": 1974.387,
      "weight": 335.218676,
      "time": 157525,
      "transfers": 0,
      "points_encoded": true,
      "points_encoded_multiplier": 100000.0,
      "bbox": [8.728669, 41.917682, 8.738313, 41.926896],
      "points": "cz{~F{lit@Hc@DOJwADIt@FLcClANTBnPrBlOhBpBZlALdAJnAOVCd@~EPpBX~C~@nKd@|EDl@}A^GDARPjDGDsBb@OCKQY{@O_AGEE?EBCHA`@VvCBTA\\@\\F\\Th@@J",
      "instructions": [
        {
          "distance": 65.033,
          "heading": 107.52,
          "sign": 0,
          "interval": [0, 4],
          "text": "Continuez sur Rue de la Villetta",
          "time": 7804,
          "street_name": "Rue de la Villetta"
        },
        {
          "distance": 30.737,
          "sign": 2,
          "interval": [4, 5],
          "text": "Tournez à droite sur Rue Hyacinthe Campiglia",
          "time": 2406,
          "street_name": "Rue Hyacinthe Campiglia"
        },
        {
          "distance": 55.843,
          "sign": -2,
          "interval": [5, 6],
          "text": "Tournez à gauche sur Avenue Beverini Vico",
          "time": 3351,
          "street_name": "Avenue Beverini Vico"
        },
        {
          "street_ref": "T 21",
          "distance": 872.756,
          "sign": 2,
          "interval": [6, 15],
          "text": "Tournez à droite sur Cours Napoléon",
          "time": 59615,
          "street_name": "Cours Napoléon"
        },
        {
          "street_ref": "D 111",
          "distance": 494.224,
          "sign": 2,
          "interval": [15, 21],
          "text": "Tournez à droite sur Avenue de Paris",
          "time": 29654,
          "street_name": "Avenue de Paris"
        },
        {
          "distance": 139.466,
          "sign": 2,
          "interval": [21, 25],
          "text": "Tournez à droite sur Rue Rossi",
          "time": 16736,
          "street_name": "Rue Rossi"
        },
        {
          "distance": 316.328,
          "sign": 2,
          "interval": [25, 43],
          "text": "Tournez à droite sur Rue Docteur Paul Pompéani",
          "time": 37959,
          "street_name": "Rue Docteur Paul Pompéani"
        },
        {
          "distance": 0.0,
          "sign": 4,
          "last_heading": 252.18737352683186,
          "interval": [43, 43],
          "text": "Arrivée",
          "time": 0,
          "street_name": ""
        }
      ],
      "legs": [],
      "details": {},
      "ascend": 0.0,
      "descend": 0.0,
      "snapped_waypoints": "cz{~F{lit@|p@tr@"
    }
  ]
}
```
