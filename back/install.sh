#!/bin/bash

wget https://adresse.data.gouv.fr/data/ban/adresses/latest/addok/addok-france-bundle.zip

mkdir addok-data
unzip -d addok-data addok-france-bundle.zip

rm -rf addok-france-bundle.zip


wget https://download.geofabrik.de/europe/france/midi-pyrenees-latest.osm.pbf -O gh-routing/gh-data/occitanie/occitanie.osm.pbf
wget https://download.geofabrik.de/europe/france/midi-pyrenees.poly -O gh-routing/gh-data/occitanie/occitanie.poly


wget https://download.geofabrik.de/europe/france/alsace-latest.osm.pbf -O gh-routing/gh-data/alsace/alsace.osm.pbf
wget https://download.geofabrik.de/europe/france/alsace.poly -O gh-routing/gh-data/alsace/alsace.poly


wget https://download.geofabrik.de/europe/france/aquitaine-latest.osm.pbf -O gh-routing/gh-data/nouvelle-aquitaine/nouvelle-aquitaine.osm.pbf
wget https://download.geofabrik.de/europe/france/aquitaine.poly -O gh-routing/gh-data/nouvelle-aquitaine/nouvelle-aquitaine.poly


wget https://download.geofabrik.de/europe/france/bretagne-latest.osm.pbf -O gh-routing/gh-data/bretagne/bretagne.osm.pbf
wget https://download.geofabrik.de/europe/france/bretagne.poly -O gh-routing/gh-data/bretagne/bretagne.poly


wget https://download.geofabrik.de/europe/france/auvergne-latest.osm.pbf -O gh-routing/gh-data/auvergne/auvergne.osm.pbf
wget https://download.geofabrik.de/europe/france/auvergne.poly -O gh-routing/gh-data/auvergne/auvergne.poly


wget https://download.geofabrik.de/europe/france/basse-normandie-latest.osm.pbf -O gh-routing/gh-data/basse-normandie/basse-normandie.osm.pbf
wget https://download.geofabrik.de/europe/france/basse-normandie.poly -O gh-routing/gh-data/basse-normandie/basse-normandie.poly


wget https://download.geofabrik.de/europe/france/haute-normandie-latest.osm.pbf -O gh-routing/gh-data/haute-normandie/haute-normandie.osm.pbf
wget https://download.geofabrik.de/europe/france/haute-normandie.poly -O gh-routing/gh-data/haute-normandie/haute-normandie.poly


wget https://download.geofabrik.de/europe/france/centre-latest.osm.pbf -O gh-routing/gh-data/centre/centre.osm.pbf
wget https://download.geofabrik.de/europe/france/centre.poly -O gh-routing/gh-data/centre/centre.poly


wget https://download.geofabrik.de/europe/france/champagne-ardenne-latest.osm.pbf -O gh-routing/gh-data/champagne-ardenne/champagne-ardenne.osm.pbf
wget https://download.geofabrik.de/europe/france/champagne-ardenne.poly -O gh-routing/gh-data/champagne-ardenne/champagne-ardenne.poly


wget https://download.geofabrik.de/europe/france/franche-comte-latest.osm.pbf -O gh-routing/gh-data/franche-comte/franche-comte.osm.pbf
wget https://download.geofabrik.de/europe/france/franche-comte.poly -O gh-routing/gh-data/franche-comte/franche-comte.poly


wget https://download.geofabrik.de/europe/france/lorraine-latest.osm.pbf -O gh-routing/gh-data/lorraine/lorraine.osm.pbf
wget https://download.geofabrik.de/europe/france/lorraine.poly -O gh-routing/gh-data/lorraine/lorraine.poly


wget https://download.geofabrik.de/europe/france/picardie-latest.osm.pbf -O gh-routing/gh-data/picardie/picardie.osm.pbf
wget https://download.geofabrik.de/europe/france/picardie.poly -O gh-routing/gh-data/picardie/picardie.poly


wget https://download.geofabrik.de/europe/france/provence-alpes-cote-d-azur-latest.osm.pbf -O gh-routing/gh-data/paca/paca.osm.pbf
wget https://download.geofabrik.de/europe/france/provence-alpes-cote-d-azur.poly -O gh-routing/gh-data/paca/paca.poly


wget https://download.geofabrik.de/europe/france/rhone-alpes-latest.osm.pbf -O gh-routing/gh-data/rhone-alpes/rhone-alpes.osm.pbf
wget https://download.geofabrik.de/europe/france/rhone-alpes.poly -O gh-routing/gh-data/rhone-alpes/rhone-alpes.poly


wget https://download.geofabrik.de/europe/france/ile-de-france-latest.osm.pbf -O gh-routing/gh-data/idf/idf.osm.pbf
wget https://download.geofabrik.de/europe/france/ile-de-france.poly -O gh-routing/gh-data/idf/idf.poly


wget https://download.geofabrik.de/europe/france/nord-pas-de-calais-latest.osm.pbf -O gh-routing/gh-data/npdc/npdc.osm.pbf
wget https://download.geofabrik.de/europe/france/nord-pas-de-calais.poly -O gh-routing/gh-data/npdc/npdc.poly


wget https://download.geofabrik.de/europe/france/pays-de-la-loire-latest.osm.pbf -O gh-routing/gh-data/pays-de-la-loire/pays-de-la-loire.osm.pbf
wget https://download.geofabrik.de/europe/france/pays-de-la-loire.poly -O gh-routing/gh-data/pays-de-la-loire/pays-de-la-loire.poly


wget https://download.geofabrik.de/europe/france/bourgogne-latest.osm.pbf -O gh-routing/gh-data/bourgogne/bourgogne.osm.pbf
wget https://download.geofabrik.de/europe/france/bourgogne.poly -O gh-routing/gh-data/bourgogne/bourgogne.poly


wget https://download.geofabrik.de/europe/france/limousin-latest.osm.pbf -O gh-routing/gh-data/limousin/limousin.osm.pbf
wget https://download.geofabrik.de/europe/france/limousin.poly -O gh-routing/gh-data/limousin/limousin.poly


wget https://download.geofabrik.de/europe/france/corse-latest.osm.pbf -O gh-routing/gh-data/corse/corse.osm.pbf
wget https://download.geofabrik.de/europe/france/corse.poly -O gh-routing/gh-data/corse/corse.poly


wget https://download.geofabrik.de/europe/france/languedoc-roussillon-latest.osm.pbf -O gh-routing/gh-data/languedoc-roussillon/languedoc-roussillon.osm.pbf
wget https://download.geofabrik.de/europe/france/languedoc-roussillon.poly -O gh-routing/gh-data/languedoc-roussillon/languedoc-roussillon.poly


wget https://download.geofabrik.de/europe/france/poitou-charentes-latest.osm.pbf -O gh-routing/gh-data/poitou-charentes/poitou-charentes.osm.pbf
wget https://download.geofabrik.de/europe/france/poitou-charentes.poly -O gh-routing/gh-data/poitou-charentes/poitou-charentes.poly
