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
