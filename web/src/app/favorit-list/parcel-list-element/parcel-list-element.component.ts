import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";


@Component({
  selector: 'app-parcel-list-element',
  imports: [CommonModule],
  templateUrl: './parcel-list-element.component.html',
  styleUrl: './parcel-list-element.component.scss'
})
export class ParcelListElementComponent {
  constructor(private router: Router) { }

  @Input() parcelId: string = 'Parcelle n° 75105 AB 0123';
  @Input() parcelName: string = 'Parcelle n° 75105 AB 0123';
  @Input() price: string = '100 €/m²';
  @Input() starCount: number = 5;


  onParcelClick() {
    this.router.navigate(["/favoritSelected"], { queryParams: { parcelId: this.parcelId } });
  }
}
