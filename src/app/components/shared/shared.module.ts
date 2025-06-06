import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LucideAngularModule, CheckCircle, XCircle, Check, ArrowLeft, Search, Info, Bell, User, Plus } from 'lucide-angular';

import { CardComponent } from './card/card.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { CurrencyInputComponent } from './currency-input/currency-input.component';
import { PercentageInputComponent } from './percentage-input/percentage-input.component';
import { SuccessScreenComponent } from './success-screen/success-screen.component';
import { DocumentsModalComponent } from './documents-modal/documents-modal.component';
import { EfxDocumentsModalComponent } from './efx-documents-modal/efx-documents-modal.component';

@NgModule({
  declarations: [
    CardComponent,
    FormFieldComponent,
    CurrencyInputComponent,
    PercentageInputComponent,
    SuccessScreenComponent,
    DocumentsModalComponent,
    EfxDocumentsModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule.pick({
      CheckCircle,
      XCircle,
      Check,
      ArrowLeft,
      Search,
      Info,
      Bell,
      User,
      Plus
    })
  ],
  exports: [
    CardComponent,
    FormFieldComponent,
    CurrencyInputComponent,
    PercentageInputComponent,
    SuccessScreenComponent,
    DocumentsModalComponent,
    EfxDocumentsModalComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule
  ]
})
export class SharedModule { }