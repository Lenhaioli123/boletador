import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OperationsService } from '../../../services/operations.service';
import { Operation, OperationType } from '../../../models/operation.model';

@Component({
  selector: 'app-track-operations',
  templateUrl: './track-operations.component.html',
  styleUrls: ['./track-operations.component.scss']
})
export class TrackOperationsComponent implements OnInit {
  operations$!: Observable<Operation[]>;
  selectedOperationIds: string[] = [];
  showEditModal: boolean = false;
  
  filters = {
    type: 'all' as 'all' | OperationType,
    search: ''
  };

  constructor(
    private router: Router,
    private operationsService: OperationsService
  ) {}

  ngOnInit(): void {
    this.operations$ = this.operationsService.operations$;
  }

  toggleOperationSelection(operationId: string): void {
    if (this.selectedOperationIds.includes(operationId)) {
      this.selectedOperationIds = this.selectedOperationIds.filter(id => id !== operationId);
    } else {
      this.selectedOperationIds = [...this.selectedOperationIds, operationId];
    }
  }

  isSelected(operationId: string): boolean {
    return this.selectedOperationIds.includes(operationId);
  }

  handleGroupOperations(): void {
    this.router.navigate(['/group-efx-operations'], {
      state: { selectedOperationIds: this.selectedOperationIds }
    });
  }

  handleCompleteOperations(): void {
    if (this.selectedOperationIds.length === 1) {
      this.showEditModal = true;
    } else {
      alert("Funcionalidade de completar múltiplas operações em lote: Permitirá definir Natureza, IOF, IR, Valuta comuns para as selecionadas.");
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PendingNature':
        return 'Pendente: Natureza';
      case 'PendingValuta':
        return 'Pendente: Valuta';
      case 'PendingIOF':
        return 'Pendente: IOF';
      case 'Complete':
        return 'Completa';
      default:
        return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PendingNature':
        return 'bg-yellow-100 text-yellow-800';
      case 'PendingValuta':
        return 'bg-orange-100 text-orange-800';
      case 'PendingIOF':
        return 'bg-red-100 text-red-800';
      case 'Complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getOperationTypeLabel(type: OperationType): string {
    return type === 'buy' ? 'Compra' : 'Venda';
  }

  getOperationTypeColor(type: OperationType): string {
    return type === 'buy' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  }

  onEditModalClose(): void {
    this.showEditModal = false;
    this.selectedOperationIds = [];
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }

  filterOperations(operations: Operation[]): Operation[] {
    return operations.filter(op => {
      // Filter by type
      if (this.filters.type !== 'all' && op.type !== this.filters.type) {
        return false;
      }
      
      // Filter by search term
      if (this.filters.search && 
          !op.id.toLowerCase().includes(this.filters.search.toLowerCase()) &&
          !(op.clientName && op.clientName.toLowerCase().includes(this.filters.search.toLowerCase()))) {
        return false;
      }
      
      return true;
    });
  }
}