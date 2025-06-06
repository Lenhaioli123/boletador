import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from '../../../services/operations.service';
import { Operation } from '../../../models/operation.model';

@Component({
  selector: 'app-new-efx-operation',
  templateUrl: './new-efx-operation.component.html',
  styleUrls: ['./new-efx-operation.component.scss']
})
export class NewEfxOperationComponent implements OnInit {
  selectedOperationIds: string[] = [];
  selectedOperations: Operation[] = [];
  showPaymentData: boolean = false;
  efxForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    // Get selected operation IDs from navigation state
    const navigation = this.router.getCurrentNavigation();
    this.selectedOperationIds = navigation?.extras?.state?.['selectedOperationIds'] || [];
    
    // Load selected operations
    this.operationsService.operations$.subscribe(operations => {
      this.selectedOperations = operations.filter(op => 
        this.selectedOperationIds.includes(op.id)
      );
      
      // Pre-fill client name if all operations have the same client
      if (this.selectedOperations.length > 0) {
        const firstClient = this.selectedOperations[0].clientName;
        const allSameClient = this.selectedOperations.every(op => op.clientName === firstClient);
        
        if (allSameClient && firstClient) {
          this.efxForm.patchValue({ clientName: firstClient });
        }
      }
    });

    this.initializeForm();
  }

  initializeForm(): void {
    this.efxForm = this.fb.group({
      clientName: ['', Validators.required],
      clientDocument: ['', Validators.required],
      type: ['Venda'],
      foreignCurrencyValue: [500.00],
      country: ['', Validators.required],
      purpose: ['', Validators.required],
      purposeDescription: [''],
      valutaNational: ['D1', Validators.required],
      valutaForeign: ['D1', Validators.required],
      deliveryType: ['Ordem', Validators.required]
    });
  }

  get sellOperations(): Operation[] {
    return this.selectedOperations.filter(op => op.type === 'sell');
  }

  get buyOperations(): Operation[] {
    return this.selectedOperations.filter(op => op.type === 'buy');
  }

  getTotalForeignValue(operations: Operation[]): number {
    return operations.reduce((sum, op) => sum + op.foreignCurrencyAmount, 0);
  }

  onSubmit(): void {
    if (this.efxForm.valid) {
      // Group the operations
      const groupId = this.operationsService.groupOperations(this.selectedOperationIds);
      
      // Navigate to success or back to tracking
      this.router.navigate(['/track'], { 
        state: { 
          message: `Operações agrupadas com sucesso. ID do grupo: ${groupId}` 
        }
      });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/track']);
  }
}