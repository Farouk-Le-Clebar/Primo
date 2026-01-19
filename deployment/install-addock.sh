#!/bin/bash

# == Addock Data Download ==
 echo "Starting addock data download..."
 wget https://adresse.data.gouv.fr/data/ban/adresses/latest/addok/addok-france-bundle.zip
 mkdir addok-data
 unzip -d addok-data addok-france-bundle.zip
 rm -rf addok-france-bundle.zip
 echo "Addock data downloaded and extracted to addok-data/"