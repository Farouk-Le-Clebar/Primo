import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private centroid: L.LatLngExpression = [16.81897, 10.16579]; // Centrer la carte (modifie selon ton besoin)

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Vérifier si l'on est sur le client (n'a pas accès à `window` côté serveur)
    if (isPlatformBrowser(this.platformId)) {
      this.loadMap();
    }
  }

  private loadMap(): void {
    // Crée une carte Leaflet
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 6,
    });

    // Ajoute le fond de carte Stamen Toner Lite
    L.tileLayer('https://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://stamen.com">Stamen Design</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }
}
