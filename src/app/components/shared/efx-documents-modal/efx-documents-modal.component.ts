import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { OperationsService } from '../../../services/operations.service';
import { EFXDocumentItem } from '../../../models/operation.model';

@Component({
  selector: 'app-efx-documents-modal',
  templateUrl: './efx-documents-modal.component.html',
  styleUrls: ['./efx-documents-modal.component.scss']
})
export class EfxDocumentsModalComponent implements OnInit {
  @Input() operationValue!: number;
  @Output() submit = new EventEmitter<{selectedDocuments: string[], skipLinking: boolean}>();
  @Output() cancel = new EventEmitter<void>();

  allDocuments: EFXDocumentItem[] = [];
  filteredDocuments: EFXDocumentItem[] = [];
  selectedDocumentIds: string[] = [];
  skipLinking: boolean = false;
  startDate: string = '';
  endDate: string = '';

  constructor(private operationsService: OperationsService) {}

  ngOnInit(): void {
    this.allDocuments = this.operationsService.getEFXDocuments();
    this.filteredDocuments = this.allDocuments;
  }

  get selectedDocuments(): EFXDocumentItem[] {
    return this.filteredDocuments.filter(doc => this.selectedDocumentIds.includes(doc.id));
  }

  get totalForeignValue(): number {
    return this.selectedDocuments.reduce((sum, doc) => sum + doc.foreignValue, 0);
  }

  get totalNationalValue(): number {
    return this.selectedDocuments.reduce((sum, doc) => sum + doc.nationalValue, 0);
  }

  toggleDocumentSelection(documentId: string): void {
    if (this.skipLinking) return;
    
    if (this.selectedDocumentIds.includes(documentId)) {
      this.selectedDocumentIds = this.selectedDocumentIds.filter(id => id !== documentId);
    } else {
      this.selectedDocumentIds = [...this.selectedDocumentIds, documentId];
    }
  }

  isSelected(documentId: string): boolean {
    return this.selectedDocumentIds.includes(documentId);
  }

  onSkipToggle(checked: boolean): void {
    this.skipLinking = checked;
    if (checked) {
      this.selectedDocumentIds = [];
    }
  }

  filterDocuments(): void {
    if (!this.startDate && !this.endDate) {
      this.filteredDocuments = this.allDocuments;
      return;
    }
    
    this.filteredDocuments = this.allDocuments.filter(doc => {
      const docDate = new Date(doc.date);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;
      
      if (start && docDate < start) return false;
      if (end && docDate > end) return false;
      
      return true;
    });
  }

  onSubmit(): void {
    this.submit.emit({
      selectedDocuments: this.selectedDocumentIds,
      skipLinking: this.skipLinking
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }
}