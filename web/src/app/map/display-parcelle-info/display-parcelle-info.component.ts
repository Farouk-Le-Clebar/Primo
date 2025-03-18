import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-display-parcelle-info',
  imports: [],
  templateUrl: './display-parcelle-info.component.html',
  styleUrl: './display-parcelle-info.component.scss'
})
export class DisplayParcelleInfoComponent {
  @Input() parcelleId!: string;

  ngOnInit(): void {
    console.log(this.parcelleId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parcelleId']) {
      
    }
  }
}
