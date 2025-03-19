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

  parcelleNbr: string = '';

  private map!: L.Map;
  private parcelleLayerGroup!: L.LayerGroup;
  private batimentLayerGroup!: L.LayerGroup;
  private geojsonParcelles: any = null;
  private geojsonBatiments: any = null;
  private selectedParcelles: { [key: string]: L.Polygon } = {};

  constructor() { }

  ngOnInit(): void {
    this.map = L.map('map', {
      center: [43.65583714209635, 0.5733537389936271],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {}).addTo(this.map);

    this.parcelleLayerGroup = L.layerGroup().addTo(this.map);
    this.batimentLayerGroup = L.layerGroup().addTo(this.map);

    this.map.on('tileload', () => {
      console.log('Tile loaded');
    });

    this.map.whenReady(() => {
      this.map.flyTo([43.65583714209635, 0.5733537389936271], 18, {
        duration: 3,
      });
    });

    this.map.on('zoomend', () => {
      if (this.map.getZoom() === 18) {
        this.loadPolygons();
      }
    });

    fetch('cadastre-32013-parcelles.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.features) {
          this.geojsonParcelles = data;
        } else {
          console.error('Aucune donnée GeoJSON disponible pour les parcelles');
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des données GeoJSON des parcelles:', error));

    fetch('cadastre-32013-batiments.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.features) {
          this.geojsonBatiments = data;
        } else {
          console.error('Aucune donnée GeoJSON disponible pour les bâtiments');
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des données GeoJSON des bâtiments:', error));
  }

  private loadPolygons(): void {
    this.updateVisibleLayers();

    this.map.on('moveend', () => this.updateVisibleLayers());
    this.map.on('zoomend', () => this.updateVisibleLayers());
  }

  private updateVisibleLayers(): void {
    this.updateVisibleParcelles();
    this.updateVisibleBatiments();
  }

  private updateVisibleParcelles(): void {
    if (!this.geojsonParcelles) return;
  
    this.parcelleLayerGroup.clearLayers();
    const bounds = this.map.getBounds();
  
    const visibleFeatures = this.geojsonParcelles.features.filter((feature: any) => {
      const [minLng, minLat, maxLng, maxLat] = L.geoJSON(feature).getBounds().toBBoxString().split(',').map(Number);
      return bounds.intersects([[minLat, minLng], [maxLat, maxLng]]);
    });
  
    const visibleParcelles = L.geoJSON(visibleFeatures, {
      style: (feature) => feature && feature.properties && this.selectedParcelles[feature.properties.id] ? this.getHoverStyle() : this.getDefaultStyle(),
      onEachFeature: (feature, layer: L.Layer) => {
        if (feature.properties && feature.properties.id && layer instanceof L.Polygon) {
          const polygonLayer = layer as L.Polygon;
          const parcelleId = feature.properties.id;
  
          polygonLayer.setStyle(this.getDefaultStyle());
  
          polygonLayer.on('mouseover', () => {
            if (!this.selectedParcelles[parcelleId]) polygonLayer.setStyle(this.getHoverStyle());
          });
  
          polygonLayer.on('mouseout', () => {
            if (!this.selectedParcelles[parcelleId]) polygonLayer.setStyle(this.getDefaultStyle());
          });
  
          polygonLayer.on('click', () => this.onParcelleClick(parcelleId, polygonLayer));
        }
      }
    });
  
    visibleParcelles.addTo(this.parcelleLayerGroup);
  }

  private updateVisibleBatiments(): void {
    if (!this.geojsonBatiments) return;

    this.batimentLayerGroup.clearLayers();
    const bounds = this.map.getBounds();

    const visibleFeatures = this.geojsonBatiments.features.filter((feature: any) => {
      const [minLng, minLat, maxLng, maxLat] = L.geoJSON(feature).getBounds().toBBoxString().split(',').map(Number);
      return bounds.intersects([[minLat, minLng], [maxLat, maxLng]]);
    });

    const visibleBatiments = L.geoJSON(visibleFeatures, {
      style: () => ({
        color: '#433661',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }),
      onEachFeature: (feature, layer: L.Layer) => {
        if (feature.properties && feature.properties.id) {
          layer.bindPopup(`<b>Bâtiment ID: ${feature.properties.id}</b>`);
        }
      }
    });

    visibleBatiments.addTo(this.batimentLayerGroup);
  }

  private getDefaultStyle() {
    return { color: '#8067B7', weight: 1, opacity: 1, fillOpacity: 0 };
  }

  private getHoverStyle() {
    return { color: '#FFFFFF', weight: 2, opacity: 1, fillOpacity: 0.2 };
  }

  private onParcelleClick(parcelleId: string, polygonLayer: L.Polygon): void {
    if (!this.selectedParcelles[parcelleId]) {
      for (const id in this.selectedParcelles) {
        if (this.selectedParcelles.hasOwnProperty(id)) {
          this.selectedParcelles[id].setStyle(this.getDefaultStyle());
          delete this.selectedParcelles[id];
        }
      }
      this.selectedParcelles[parcelleId] = polygonLayer;
      polygonLayer.setStyle(this.getHoverStyle());
      this.parcelleNbr = parcelleId;
    } else {
      delete this.selectedParcelles[parcelleId];
      polygonLayer.setStyle(this.getDefaultStyle());
      this.parcelleNbr = '';
    }
  }
}
