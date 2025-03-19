import { Component, OnInit } from '@angular/core';
import { DisplayParcelleInfoComponent } from './display-parcelle-info/display-parcelle-info.component';
import * as L from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [ DisplayParcelleInfoComponent, NavbarComponent ]
})
export class MapComponent implements OnInit {

  parcelleNbr: string = '';
  zoomAnimation: boolean = true;
  
  private map!: L.Map;
  private parcelleLayerGroup!: L.LayerGroup;
  private batimentLayerGroup!: L.LayerGroup;
  private geojsonParcelles: any = null;
  private geojsonBatiments: any = null;
  private selectedParcelles: { [key: string]: L.Polygon } = {};
  private highlightedIds = [""];
  
  constructor(private route: ActivatedRoute) { }

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

    this.route.queryParams.subscribe(params => {
      this.zoomAnimation = params['zoomAnimation'] === 'true';
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {}).addTo(this.map);

    this.parcelleLayerGroup = L.layerGroup().addTo(this.map);
    this.batimentLayerGroup = L.layerGroup().addTo(this.map);

    if (this.zoomAnimation) {
      setTimeout(() => {
        this.map.whenReady(() => {
          this.map.flyTo([43.65583714209635, 0.5733537389936271], 18, {
            duration: 3,
          });
        });
      }, 1000);
      this.highlightedIds = ['32013000BL0091', '32013000BL0164', '32013000BN0122', '32013000BL0151'];
    } else {
      this.map.setView([43.65583714209635, 0.5733537389936271], 18);
    }

    const parcellesPromise = fetch('cadastre-32013-parcelles.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.features) {
          this.geojsonParcelles = data;
        } else {
          console.error('Aucune donnée GeoJSON disponible pour les parcelles');
        }
      });

    const batimentsPromise = fetch('cadastre-32013-batiments.json')
      .then(response => response.json())
      .then(data => {
        if (data && data.features) {
          this.geojsonBatiments = data;
        } else {
          console.error('Aucune donnée GeoJSON disponible pour les bâtiments');
        }
      });

    Promise.all([parcellesPromise, batimentsPromise]).then(() => {
      this.loadPolygons();
    });
  }

  private loadPolygons(): void {
    if (this.zoomAnimation) {
      this.map.on('moveend', () => this.updateVisibleLayers());
      this.map.on('zoomend', () => this.updateVisibleLayers());
    } else {
      this.updateVisibleLayers();
    }
  }

  private updateVisibleLayers(): void {
    this.updateVisibleParcelles();
    this.updateVisibleBatiments();
  }

  private updateVisibleParcelles(): void {
    if (!this.geojsonParcelles) return;

    console.log("caca");
    this.parcelleLayerGroup.clearLayers();
    const bounds = this.map.getBounds();

    const visibleFeatures = this.geojsonParcelles.features.filter((feature: any) => {
      const [minLng, minLat, maxLng, maxLat] = L.geoJSON(feature).getBounds().toBBoxString().split(',').map(Number);
      return bounds.intersects([[minLat, minLng], [maxLat, maxLng]]);
    });


    const visibleParcelles = L.geoJSON(visibleFeatures, {
      style: (feature) => this.getFeatureStyle(feature?.properties.id),
      onEachFeature: (feature, layer: L.Layer) => {
        if (feature.properties && feature.properties.id && layer instanceof L.Polygon) {
          const polygonLayer = layer as L.Polygon;

          polygonLayer.on('mouseover', () => {
            if (!this.selectedParcelles[feature.properties.id]) {
              polygonLayer.setStyle(this.getFeatureStyle(feature.properties.id, true));
            }
          });

          polygonLayer.on('mouseout', () => {
            if (!this.selectedParcelles[feature.properties.id]) {
              polygonLayer.setStyle(this.getFeatureStyle(feature.properties.id));
            }
          });

          polygonLayer.on('click', () => this.onParcelleClick(feature.properties.id, polygonLayer));
        }
      }
    });

    visibleParcelles.addTo(this.parcelleLayerGroup);
  }


  private getFeatureStyle(id: string, isSelected: boolean = false) {
    if (!isSelected) {
      if (id && this.highlightedIds.includes(id)) {
        return { color: '#FFD700', weight: 2, opacity: 1, fillOpacity: 0.2 };
      }
      return { color: '#8067B7', weight: 1, opacity: 1, fillOpacity: 0 };
    } else {
      if (id && this.highlightedIds.includes(id)) {
        return { color: '#FFD700', weight: 3, opacity: 1, fillOpacity: 0.6 };
      }
      return { color: '#FFFFFF', weight: 2, opacity: 1, fillOpacity: 0.4 };
    }
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

  private onParcelleClick(parcelleId: string, polygonLayer: L.Polygon): void {
    if (!this.selectedParcelles[parcelleId]) {
      for (const id in this.selectedParcelles) {
        if (this.selectedParcelles.hasOwnProperty(id)) {
          this.selectedParcelles[id].setStyle(this.getFeatureStyle(id, false));
          delete this.selectedParcelles[id];
        }
      }
      this.selectedParcelles[parcelleId] = polygonLayer;
      polygonLayer.setStyle(this.getFeatureStyle(parcelleId, true));
      this.parcelleNbr = parcelleId;
    } else {
      delete this.selectedParcelles[parcelleId];
      polygonLayer.setStyle(this.getFeatureStyle(parcelleId, false));
      this.parcelleNbr = '';
    }
  }
}
