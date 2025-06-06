import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from '../../../services/operations.service';
import { Operation } from '../../../models/operation.model';

@Component({
  selector: 'app-edit-operation-modal',
  templateUrl: './edit-operation-modal.component.html',
  styleUrls: ['./edit-operation-modal.component.scss']
})
export class EditOperationModalComponent implements OnInit {
  @Input() operationId!: string;
  @Output() close = new EventEmitter<void>();

  operation?: Operation;
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    this.operation = this.operationsService.getOperation(this.operationId);
    
    if (this.operation) {
      this.editForm = this.fb.group({
        nature: [this.operation.nature || '', Validators.required],
        iof: [this.operation.iof || 0],
        ir: [this.operation.ir || 0],
        valutaNational: [this.operation.valutaNational || 'D1', Validators.required],
        valutaForeign: [this.operation.valutaForeign || 'D1', Validators.required],
        settlementTypeBrazil: [this.operation.settlementTypeBrazil || 'Conta', Validators.required],
        settlementTypeAbroad: [this.operation.settlementTypeAbroad || 'Conta', Validators.required]
      });
    }
  }

  onSubmit(): void {
    if (this.editForm.valid && this.operation) {
      this.operationsService.updateOperation(this.operationId, {
        ...this.editForm.value,
        status: 'Complete'
      });
      this.close.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}