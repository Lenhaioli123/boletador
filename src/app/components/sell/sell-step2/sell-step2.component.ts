import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from '../../../services/operations.service';

@Component({
  selector: 'app-sell-step2',
  templateUrl: './sell-step2.component.html',
  styleUrls: ['./sell-step2.component.scss']
})
export class SellStep2Component implements OnInit {
  sellForm!: FormGroup;
  showEFXModal: boolean = false;
  operationData: any = {};

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    // Get data from previous step
    const navigation = this.router.getCurrentNavigation();
    this.operationData = navigation?.extras?.state?.['formData'] || {};

    this.sellForm = this.fb.group({
      nature: [this.operationData.nature || '', Validators.required],
      iof: [this.operationData.iof || 0],
      ir: [this.operationData.ir || 0],
      valutaNational: ['D1', Validators.required],
      valutaForeign: ['D1', Validators.required],
      settlementTypeBrazil: ['Conta', Validators.required],
      settlementTypeAbroad: ['Conta', Validators.required],
      relationshipLink: [''],
      sellerCode: [''],
      groupCode: [''],
      payerReceiverAbroad: [''],
      efxDocuments: [[]],
      skipEfxLinking: [false]
    });

    // Watch for nature changes to show EFX modal
    this.sellForm.get('nature')?.valueChanges.subscribe(value => {
      if (value === 'EFX') {
        this.showEFXModal = true;
      }
    });
  }

  onEFXDocumentsSubmit(data: {selectedDocuments: string[], skipLinking: boolean}): void {
    this.sellForm.patchValue({
      efxDocuments: data.selectedDocuments,
      skipEfxLinking: data.skipLinking
    });
    this.showEFXModal = false;
  }

  onSubmit(): void {
    if (this.sellForm.valid) {
      // Combine all form data
      const finalData = {
        ...this.operationData,
        ...this.sellForm.value
      };

      // Create the operation
      const operationId = this.operationsService.addOperation({
        type: 'sell',
        domesticCurrencyAmount: finalData.domesticCurrencyAmount || 0,
        foreignCurrency: finalData.foreignCurrency || 'USD',
        foreignCurrencyAmount: finalData.foreignCurrencyAmount || 0,
        exchangeRate: finalData.exchangeRate || 0,
        spread: finalData.spread || 0,
        fee: finalData.fee,
        totalAmount: finalData.totalAmount || 0,
        nature: finalData.nature,
        iof: finalData.iof,
        ir: finalData.ir,
        valutaNational: finalData.valutaNational,
        valutaForeign: finalData.valutaForeign,
        settlementTypeBrazil: finalData.settlementTypeBrazil,
        settlementTypeAbroad: finalData.settlementTypeAbroad,
        relationshipLink: finalData.relationshipLink,
        sellerCode: finalData.sellerCode,
        groupCode: finalData.groupCode,
        payerReceiverAbroad: finalData.payerReceiverAbroad,
        efxDocuments: finalData.efxDocuments,
        skipEfxLinking: finalData.skipEfxLinking
      });

      // Navigate to success screen
      this.router.navigate(['/'], { 
        state: { 
          success: true,
          operationId: operationId,
          operationType: 'venda'
        }
      });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/sell']);
  }
}