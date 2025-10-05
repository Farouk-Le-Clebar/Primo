#!/bin/bash

wget https://adresse.data.gouv.fr/data/ban/adresses/latest/addok/addok-france-bundle.zip

mkdir addok-data
unzip -d addok-data addok-france-bundle.zip

rm -rf addok-france-bundle.zip