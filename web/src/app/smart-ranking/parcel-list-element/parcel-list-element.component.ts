import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parcel-list-element',
  imports: [CommonModule],
  templateUrl: './parcel-list-element.component.html',
  styleUrl: './parcel-list-element.component.scss'
})
export class ParcelListElementComponent {
  @Input() parcelId: string = 'Parcelle n° 75105 AB 0123';
  @Input() price: string = '100 €/m²';
  @Input() starCount: number = 5;
}
