import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParcelListElementComponent } from '../favorit-list/parcel-list-element/parcel-list-element.component';

@Component({
  selector: 'app-favorit-list',
  imports: [NavbarComponent, ParcelListElementComponent, CommonModule],
  templateUrl: './favorit-list.component.html',
  styleUrl: './favorit-list.component.scss'
})
export class FavoritListComponent {
  constructor(private router: Router) { }

  parcels = [
    { parcelName: 'Parcelle n° 75105 AB 0123', parcelId: '75105AB0123', price: '246 €/m²', starCount: 0 },
    { parcelName: 'Parcelle n° 75014 AA 0456', parcelId: '75014AA0456', price: '170 €/m²', starCount: 0 },
    { parcelName: 'Parcelle n° 69003 AC 0789', parcelId: '69003AC0789', price: '100 €/m²', starCount: 0 },
    { parcelName: 'Parcelle n° 13008 AD 0321', parcelId: '13008AD0321', price: '90 €/m²', starCount: 0 }
  ];

  onMapClick() {
    this.router.navigate(['/map']);
  }

  generateRanking() {
    console.log('Generating ranking...');
    const rankingValues = [5, 5, 4, 2];
    this.parcels.forEach((parcel, index) => {
      parcel.starCount = rankingValues[index];
    });
  }
}
