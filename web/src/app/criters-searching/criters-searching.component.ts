import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-criters-searching',
  imports: [ NavbarComponent ],
  templateUrl: './criters-searching.component.html',
  styleUrl: './criters-searching.component.scss'
})

export class CritersSearchingComponent {
  constructor(private router: Router) {}

  onClick() {
    this.router.navigate(["/map"]);
  }
}
