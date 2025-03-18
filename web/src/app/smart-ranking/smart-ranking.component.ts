import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ParcelListElementComponent } from './parcel-list-element/parcel-list-element.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-smart-ranking',
  standalone: true,
  imports: [NavbarComponent, ParcelListElementComponent, CommonModule],
  templateUrl: './smart-ranking.component.html',
  styleUrls: ['./smart-ranking.component.scss']
})
export class SmartRankingComponent {
  parcels = [
    { parcelId: 'Parcelle n° 75105 AB 0123', price: '246 €/m²', starCount: 0 },
    { parcelId: 'Parcelle n° 75014 AA 0456', price: '170 €/m²', starCount: 0 },
    { parcelId: 'Parcelle n° 69003 AC 0789', price: '100 €/m²', starCount: 0 },
    { parcelId: 'Parcelle n° 13008 AD 0321', price: '90 €/m²', starCount: 0 }
  ];

  generateRanking() {
    console.log('Generating ranking...');
    const rankingValues = [5, 5, 4, 2];
    this.parcels.forEach((parcel, index) => {
      parcel.starCount = rankingValues[index];
    });
  }
}
