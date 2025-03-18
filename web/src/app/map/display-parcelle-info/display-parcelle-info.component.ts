import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as templateAdress1 from '../../../assets/info/adress/template-adress1.json';
import * as templateAdress2 from '../../../assets/info/adress/template-adress2.json';
import * as templateAdress3 from '../../../assets/info/adress/template-adress3.json';

import * as templatePrice1 from '../../../assets/info/price/template-price1.json';
import * as templatePrice2 from '../../../assets/info/price/template-price2.json';
import * as templatePrice3 from '../../../assets/info/price/template-price3.json';

import * as templateCrime1 from '../../../assets/info/criminality/template-criminality1.json';
import * as templateCrime2 from '../../../assets/info/criminality/template-criminality2.json';
import * as templateCrime3 from '../../../assets/info/criminality/template-criminality3.json';

@Component({
  selector: 'app-display-parcelle-info',
  imports: [CommonModule],
  templateUrl: './display-parcelle-info.component.html',
  styleUrl: './display-parcelle-info.component.scss'
})
export class DisplayParcelleInfoComponent {
  @Input() parcelleId!: string;

  parcelleSelected: boolean = false;
  adress: any = {};
  price: any = {};
  crime: any = { crime_trends: { stable: false, decreasing: false, increasing: false } };

  priceList: any = [templatePrice1, templatePrice2, templatePrice3];
  adressList: any = [templateAdress1, templateAdress2, templateAdress3];
  crimeList: any = [templateCrime1, templateCrime2, templateCrime3];

  ngOnInit(): void {
    console.log(this.parcelleId);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parcelleId'].currentValue == "") {
      this.parcelleSelected = false;
      this.adress = {};
      this.price = {};
      this.crime = {};
    } else {
      this.parcelleSelected = true;
      this.adress = this.adressList[Math.floor(Math.random() * this.adressList.length)];
      this.price = this.priceList[Math.floor(Math.random() * this.priceList.length)];
      this.crime = this.crimeList[Math.floor(Math.random() * this.crimeList.length)];
    }
  }
}
