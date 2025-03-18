import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as templateAdress1 from '../../../assets/info/adress/template-adress1.json';
import * as templateAdress2 from '../../../assets/info/adress/template-adress2.json';
import * as templateAdress3 from '../../../assets/info/adress/template-adress3.json';

import * as templatePrice1 from '../../../assets/info/price/template-price1.json';
import * as templatePrice2 from '../../../assets/info/price/template-price2.json';
import * as templatePrice3 from '../../../assets/info/price/template-price3.json';

@Component({
  selector: 'app-display-parcelle-info',
  imports: [],
  templateUrl: './display-parcelle-info.component.html',
  styleUrl: './display-parcelle-info.component.scss'
})
export class DisplayParcelleInfoComponent {
  @Input() parcelleId!: string;

  adress: any = {};
  price: any = {};

  priceList: any = [templatePrice1, templatePrice2, templatePrice3];
  adressList: any = [templateAdress1, templateAdress2, templateAdress3];

  ngOnInit(): void {
    console.log(this.parcelleId);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parcelleId'].currentValue == "") {
      this.adress = {};
      this.price = {};
    } else {
      this.adress = this.adressList[Math.floor(Math.random() * this.adressList.length)];
      this.price = this.priceList[Math.floor(Math.random() * this.priceList.length)];
    }
  }
}
