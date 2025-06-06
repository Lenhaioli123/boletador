import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sell-step1',
  templateUrl: './sell-step1.component.html',
  styleUrls: ['./sell-step1.component.scss']
})
export class SellStep1Component implements OnInit {
  sellForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sellForm = this.fb.group({
      beneficiary: ['', Validators.required],
      country: ['', Validators.required],
      foreignCurrency: ['USD', Validators.required],
      foreignCurrencyAmount: [0, [Validators.required, Validators.min(0.01)]],
      exchangeRate: [5.0, [Validators.required, Validators.min(0.01)]],
      spread: [0.02, [Validators.required, Validators.min(0)]],
      fee: [0],
      nature: [''],
      iof: [0],
      ir: [0],
      isNetting: [false]
    });

    // Watch for form changes to calculate totals
    this.sellForm.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    const formValue = this.sellForm.value;
    if (formValue.foreignCurrencyAmount && formValue.exchangeRate) {
      const baseAmount = formValue.foreignCurrencyAmount * formValue.exchangeRate;
      const spreadAmount = baseAmount * (formValue.spread / 100);
      const iofAmount = formValue.iof ? baseAmount * (formValue.iof / 100) : 0;
      const irAmount = formValue.ir ? baseAmount * (formValue.ir / 100) : 0;
      const total = baseAmount + spreadAmount + iofAmount + irAmount - (formValue.fee || 0);
      
      // Update calculated fields without triggering valueChanges
      this.sellForm.patchValue({
        domesticCurrencyAmount: baseAmount,
        totalAmount: total
      }, { emitEvent: false });
    }
  }

  onSubmit(): void {
    if (this.sellForm.valid) {
      // Navigate to step 2 with form data
      this.router.navigate(['/sell/step2'], { 
        state: { formData: this.sellForm.value }
      });
    }
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}