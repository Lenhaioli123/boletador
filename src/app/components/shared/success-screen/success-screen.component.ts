import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-screen',
  templateUrl: './success-screen.component.html',
  styleUrls: ['./success-screen.component.scss']
})
export class SuccessScreenComponent implements OnInit, OnDestroy {
  @Input() title!: string;
  @Input() operationId!: string;
  @Input() operationType!: 'compra' | 'venda';

  countdown: number = 5;
  private timer?: number;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.timer = window.setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.navigateToHome();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  navigateToTrack(): void {
    this.router.navigate(['/track']);
  }
}