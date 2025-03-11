import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'map', component: MapComponent }
];
