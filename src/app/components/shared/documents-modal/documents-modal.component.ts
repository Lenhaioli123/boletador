import { Component, Input, Output, EventEmitter } from '@angular/core';

interface DocumentItem {
  id: string;
  name: string;
  value: number;
  date: string;
}

@Component({
  selector: 'app-documents-modal',
  templateUrl: './documents-modal.component.html',
  styleUrls: ['./documents-modal.component.scss']
})
export class DocumentsModalComponent {
  @Input() operationValue!: number;
  @Output() submit = new EventEmitter<string[]>();
  @Output() cancel = new EventEmitter<void>();

  selectedDocumentIds: string[] = [];

  documents: DocumentItem[] = [
    { id: 'doc-1', name: 'Boleto_NotaFiscal_123.pdf', value: 1500, date: '2025-06-01' },
    { id: 'doc-2', name: 'Invoice_XYZ_Serv.pdf', value: 3500, date: '2025-05-30' },
    { id: 'doc-3', name: 'Boleto_Fornecedor_A.xml', value: 5000, date: '2025-06-02' },
    { id: 'doc-4', name: 'Contrato_Servico_B.pdf', value: 2000, date: '2025-05-29' },
    { id: 'doc-5', name: 'Fatura_Internacional_C.pdf', value: 8000, date: '2025-06-05' },
  ];

  get totalSelectedValue(): number {
    return this.documents
      .filter(doc => this.selectedDocumentIds.includes(doc.id))
      .reduce((sum, doc) => sum + doc.value, 0);
  }

  get remainingBalance(): number {
    return this.operationValue - this.totalSelectedValue;
  }

  toggleDocumentSelection(documentId: string): void {
    if (this.selectedDocumentIds.includes(documentId)) {
      this.selectedDocumentIds = this.selectedDocumentIds.filter(id => id !== documentId);
    } else {
      this.selectedDocumentIds = [...this.selectedDocumentIds, documentId];
    }
  }

  isSelected(documentId: string): boolean {
    return this.selectedDocumentIds.includes(documentId);
  }

  onSubmit(): void {
    this.submit.emit(this.selectedDocumentIds);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}