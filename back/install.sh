#!/bin/bash

wget https://adresse.data.gouv.fr/data/ban/adresses/latest/addok/addok-france-bundle.zip

mkdir addok-data
unzip -d addok-data addok-france-bundle.zip

rm -rf addok-france-bundle.zip

mkdir graphhopper-data
wget https://download.geofabrik.de/europe/france/midi-pyrenees-latest.osm.pbf -O graphhopper-data/occitanie.osm.pbf