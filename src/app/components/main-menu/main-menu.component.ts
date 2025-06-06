import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  constructor(private router: Router) {}

  navigateToSell(): void {
    this.router.navigate(['/sell']);
  }

  navigateToBuy(): void {
    this.router.navigate(['/buy']);
  }

  navigateToTrack(): void {
    this.router.navigate(['/track']);
  }
}