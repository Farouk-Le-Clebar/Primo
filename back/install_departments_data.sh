#!/bin/bash
set -e

TMP_DIR=$(mktemp -d)
git clone --depth=1 https://github.com/gregoiredavid/france-geojson.git "$TMP_DIR"


rm -rf ./data/departements
mkdir -p ./data/departements
cp -r "$TMP_DIR/departements"/* ./data/departements/

rm -rf "$TMP_DIR"

cd data/departements

rm -rf 97*

for folder in *; do
    if [ -d "$folder" ]; then
        short_code="${folder:0:2}"
        
        if [ ! -d "$short_code" ]; then
            mkdir -p "$short_code"
        fi
        
        mv "$folder"/* "$short_code/" 2>/dev/null || true
        
        if [ "$folder" != "$short_code" ]; then
            rm -rf "$folder"
        fi
    fi
done

find . -type f -name "cantons*" -delete
find . -type f -name "arrondissements*" -delete

for file in $(find . -type f -name "*.geojson"); do
    dir=$(dirname "$file")
    filename=$(basename "$file")
    
    if [[ "$filename" =~ ^communes-(..)-.* ]]; then
        dept_code="${BASH_REMATCH[1]}"
        new_filename="communes-${dept_code}.geojson"
        if [ "$filename" != "$new_filename" ]; then
            mv "$file" "$dir/$new_filename"
        fi
    fi
    
    if [[ "$filename" =~ ^departement-(..)-.* ]]; then
        dept_code="${BASH_REMATCH[1]}"
        new_filename="departement-${dept_code}.geojson"
        if [ "$filename" != "$new_filename" ]; then
            mv "$file" "$dir/$new_filename"
        fi
    fi
done

cd ../..