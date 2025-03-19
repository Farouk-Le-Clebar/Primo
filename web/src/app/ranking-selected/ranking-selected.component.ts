import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ranking-selected',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './ranking-selected.component.html',
  styleUrls: ['./ranking-selected.component.scss']
})

export class RankingSelectedComponent implements OnInit {
  rankingSelectedImage : string = "/ranking/13008AD0321.png";
  
  ngOnInit() {
    console.log('RankingSelectedComponent');
  }
}
