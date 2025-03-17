import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ParcelListElementComponent } from './parcel-list-element/parcel-list-element.component';

@Component({
  selector: 'app-smart-ranking',
  imports: [NavbarComponent, ParcelListElementComponent],
  templateUrl: './smart-ranking.component.html',
  styleUrl: './smart-ranking.component.scss'
})
export class SmartRankingComponent {

}
