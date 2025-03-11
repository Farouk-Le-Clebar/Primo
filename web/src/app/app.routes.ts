import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: 'map', component: MapComponent },
    { path: 'login', component: LoginComponent },
];
