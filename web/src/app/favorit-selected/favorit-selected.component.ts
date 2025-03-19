import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-favorit-selected',
  imports: [NavbarComponent],
  templateUrl: './favorit-selected.component.html',
  styleUrl: './favorit-selected.component.scss'
})

export class FavoritSelectedComponent implements OnInit {
  parcelSource : string = "favorit/";
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.parcelSource += params['parcelId'] + "/" + params['parcelId'] + ".svg";
      console.log(this.parcelSource);
    });
  }
}
