import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FavoritListComponent } from './favorit-list/favorit-list.component';
import { FavoritSelectedComponent } from './favorit-selected/favorit-selected.component';
import { CritersSearchingComponent } from './criters-searching/criters-searching.component';

export const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'favorit', component: FavoritListComponent },
  { path: 'favoritSelected', component: FavoritSelectedComponent },
  { path: 'critersSearching', component: CritersSearchingComponent }
];
