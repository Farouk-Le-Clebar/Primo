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
      center: [43.600, 1.433],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    }).addTo(map);
  }
}
