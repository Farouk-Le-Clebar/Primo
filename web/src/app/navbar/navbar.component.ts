import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  imports: [MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router) { }

  onSearchClick() {
    this.router.navigate(['/critersSearching']);
  }

  onMapClick() {
    this.router.navigate(['/map'], { queryParams: { zoomAnimation: 'false' } });
  }

  onFavoritesClick() {
    this.router.navigate(['/favorit']);
  }

  onHomeClick() {
    this.router.navigate(['/']);
  }

  onUserClick() {
    this.router.navigate(['/profile']);
  }
}
