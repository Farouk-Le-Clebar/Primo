import { Component, OnInit } from '@angular/core';
import { DisplayParcelleInfoComponent } from './display-parcelle-info/display-parcelle-info.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [ DisplayParcelleInfoComponent ]
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const map = L.map('map', {
      center: [43.65583714209635, 0.5733537389936271],
      zoom: 50,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {}).addTo(map);


    fetch('cadastre-32013-parcelles.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.features) {
          L.geoJSON(data, {
            style: function () {
              return {
                color: '#8067B7',
                weight: 1,
                opacity: 1,
                fillOpacity: 0
              };
            },
            onEachFeature: function (feature, layer) {
              if (feature.properties && feature.properties.id) {
                layer.bindPopup(`<b>Parcelle ID: ${feature.properties.id}</b>`);
              }
            }
          }).addTo(map);
        } else {
          console.error('Aucune donnée GeoJSON disponible');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données GeoJSON:', error);
      });

    fetch('cadastre-32013-batiments.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.features) {
          L.geoJSON(data, {
            style: function () {
              return {
                color: '#433661',
                weight: 2,
                opacity: 1,
                fillOpacity: 1
              };
            },
            onEachFeature: function (feature, layer) {
              if (feature.properties && feature.properties.id) {
                layer.bindPopup(`<b>Bâtiment ID: ${feature.properties.id}</b>`);
              }
            }
          }).addTo(map);
        } else {
          console.error('Aucune donnée GeoJSON disponible pour les bâtiments');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données GeoJSON des bâtiments:', error);
      });
  }
}
