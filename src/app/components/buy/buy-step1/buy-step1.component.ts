import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OperationsService } from '../../../services/operations.service';
import { OrderItem } from '../../../models/operation.model';

@Component({
  selector: 'app-buy-step1',
  templateUrl: './buy-step1.component.html',
  styleUrls: ['./buy-step1.component.scss']
})
export class BuyStep1Component implements OnInit {
  orders$!: Observable<OrderItem[]>;
  selectedOrderIds: string[] = [];

  constructor(
    private router: Router,
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    this.orders$ = this.operationsService.orders$;
  }

  toggleOrderSelection(orderId: string): void {
    if (this.selectedOrderIds.includes(orderId)) {
      this.selectedOrderIds = this.selectedOrderIds.filter(id => id !== orderId);
    } else {
      this.selectedOrderIds = [...this.selectedOrderIds, orderId];
    }
  }

  isSelected(orderId: string): boolean {
    return this.selectedOrderIds.includes(orderId);
  }

  handleContinueWithOrders(): void {
    // Navigate to next step with selected orders
    this.router.navigate(['/'], { 
      state: { 
        success: true,
        message: 'Funcionalidade de compra com ordens selecionadas será implementada.'
      }
    });
  }

  handleNewBuyWithoutOrder(): void {
    // Navigate to buy without order flow
    this.router.navigate(['/'], { 
      state: { 
        success: true,
        message: 'Funcionalidade de nova compra sem ordem será implementada.'
      }
    });
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}