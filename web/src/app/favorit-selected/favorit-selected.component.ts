import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-favorit-selected',
  templateUrl: './favorit-selected.component.html',
  styleUrls: ['./favorit-selected.component.scss'],
  imports: [NavbarComponent]
})
export class FavoritSelectedComponent implements OnInit {
  fullText: string = `“Cette parcelle se distingue par son emplacement idéal, offrant à la fois tranquillité et proximité avec les principales infrastructures. Son terrain plat et bien exposé en fait un excellent choix pour divers projets. L'accessibilité aux transports en commun et aux services essentiels assure une commodité optimale. De plus, la présence d’espaces verts et la sécurité du quartier renforcent son attractivité. Un environnement dynamique mais pas trop dense, parfait pour profiter d'un cadre de vie agréable.”`;
  displayedText: string = '';
  typingSpeed: number = 10;

  ngOnInit(): void {
    this.typeText();
  }

  typeText(): void {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.fullText.length) {
        this.displayedText += this.fullText[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, this.typingSpeed);
  }
}