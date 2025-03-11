import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { DisplayParcelleInfoComponent } from './map/display-parcelle-info/display-parcelle-info.component';

export const routes: Routes = [
    { path: 'map', component: MapComponent },
    { path: 'display', component: DisplayParcelleInfoComponent },
];
