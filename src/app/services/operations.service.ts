import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Operation, OrderItem, EFXDocumentItem, OperationType } from '../models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  private operationsSubject = new BehaviorSubject<Operation[]>(this.getSampleOperations());
  private ordersSubject = new BehaviorSubject<OrderItem[]>(this.getSampleOrders());
  private efxDocumentsSubject = new BehaviorSubject<EFXDocumentItem[]>(this.getSampleEFXDocuments());

  public operations$ = this.operationsSubject.asObservable();
  public orders$ = this.ordersSubject.asObservable();
  public efxDocuments$ = this.efxDocumentsSubject.asObservable();

  addOperation(operationData: Omit<Operation, 'id' | 'createdAt' | 'status'>): string {
    const id = uuidv4();
    const newOperation: Operation = {
      ...operationData,
      id,
      createdAt: new Date().toISOString(),
      status: 'PendingNature'
    };
    
    const currentOperations = this.operationsSubject.value;
    this.operationsSubject.next([...currentOperations, newOperation]);
    return id;
  }

  updateOperation(id: string, data: Partial<Operation>): void {
    const currentOperations = this.operationsSubject.value;
    const updatedOperations = currentOperations.map(op => 
      op.id === id ? { ...op, ...data } : op
    );
    this.operationsSubject.next(updatedOperations);
  }

  getOperation(id: string): Operation | undefined {
    return this.operationsSubject.value.find(op => op.id === id);
  }

  getOrders(): OrderItem[] {
    return this.ordersSubject.value;
  }

  getEFXDocuments(): EFXDocumentItem[] {
    return this.efxDocumentsSubject.value;
  }

  linkOperations(sellOperationId: string, buyOperationId: string): void {
    const currentOperations = this.operationsSubject.value;
    const updatedOperations = currentOperations.map(op => {
      if (op.id === sellOperationId || op.id === buyOperationId) {
        return {
          ...op,
          linkedOperationId: op.id === sellOperationId ? buyOperationId : sellOperationId
        };
      }
      return op;
    });
    this.operationsSubject.next(updatedOperations);
  }

  groupOperations(operationIds: string[]): string {
    const groupId = `GRP-${uuidv4().substr(0, 6)}`;
    
    const currentOperations = this.operationsSubject.value;
    const updatedOperations = currentOperations.map(op => {
      if (operationIds.includes(op.id)) {
        return {
          ...op,
          status: 'Complete' as const,
        };
      }
      return op;
    });
    this.operationsSubject.next(updatedOperations);
    
    return groupId;
  }

  private getSampleOrders(): OrderItem[] {
    return [
      { id: 'order-1', clientName: 'Empresa ABC Ltda', currency: 'USD', amount: 5000, date: '2025-06-01' },
      { id: 'order-2', clientName: 'Importadora XYZ S.A.', currency: 'EUR', amount: 3500, date: '2025-05-30' },
      { id: 'order-3', clientName: 'Global Services Inc.', currency: 'USD', amount: 10000, date: '2025-06-02' },
      { id: 'order-4', clientName: 'Tech Solutions SA', currency: 'GBP', amount: 2800, date: '2025-06-03' },
      { id: 'order-5', clientName: 'Empresa ABC Ltda', currency: 'EUR', amount: 7500, date: '2025-05-29' }
    ];
  }

  private getSampleEFXDocuments(): EFXDocumentItem[] {
    return [
      { id: 'efx-1', name: '001.csv', currency: 'USD', nationalValue: 1500, foreignValue: 300, date: '2025-06-01', status: 'Concluído' },
      { id: 'efx-2', name: 'Invoice_XYZ.pdf', currency: 'EUR', nationalValue: 2500, foreignValue: 500, date: '2025-05-30', status: 'Pendente' },
      { id: 'efx-3', name: 'Contract_ABC.xml', currency: 'USD', nationalValue: 5000, foreignValue: 1000, date: '2025-06-02', status: 'Concluído' },
      { id: 'efx-4', name: 'Payment_Order_123.pdf', currency: 'GBP', nationalValue: 3200, foreignValue: 533, date: '2025-05-29', status: 'Em Análise' },
      { id: 'efx-5', name: 'Transfer_Receipt.csv', currency: 'EUR', nationalValue: 1800, foreignValue: 360, date: '2025-06-03', status: 'Concluído' },
      { id: 'efx-6', name: 'Service_Invoice_456.pdf', currency: 'USD', nationalValue: 4500, foreignValue: 900, date: '2025-06-01', status: 'Pendente' }
    ];
  }

  private getSampleOperations(): Operation[] {
    return [
      {
        id: 'op-1',
        type: 'sell',
        domesticCurrencyAmount: 50000,
        foreignCurrency: 'USD',
        foreignCurrencyAmount: 10000,
        exchangeRate: 5.0,
        spread: 0.02,
        totalAmount: 50000,
        createdAt: '2025-06-01',
        status: 'PendingNature',
        clientName: 'Empresa XYZ Ltda'
      },
      {
        id: 'op-2',
        type: 'buy',
        domesticCurrencyAmount: 22500,
        foreignCurrency: 'EUR',
        foreignCurrencyAmount: 4500,
        exchangeRate: 5.0,
        spread: 0.01,
        totalAmount: 22500,
        createdAt: '2025-05-31',
        status: 'PendingValuta',
        nature: 'ImportOfGoods',
        clientName: 'Importadora ABC S.A.'
      },
      {
        id: 'op-3',
        type: 'sell',
        domesticCurrencyAmount: 15000,
        foreignCurrency: 'GBP',
        foreignCurrencyAmount: 2500,
        exchangeRate: 6.0,
        spread: 0.02,
        fee: 50,
        totalAmount: 14950,
        createdAt: '2025-05-30',
        status: 'PendingIOF',
        nature: 'TechnicalServices',
        clientName: 'Tech Solutions SA'
      },
      {
        id: 'op-4',
        type: 'buy',
        domesticCurrencyAmount: 35000,
        foreignCurrency: 'USD',
        foreignCurrencyAmount: 7000,
        exchangeRate: 5.0,
        spread: 0.01,
        totalAmount: 35000,
        createdAt: '2025-06-02',
        status: 'PendingNature',
        clientName: 'Global Services Inc.'
      },
      {
        id: 'op-5',
        type: 'sell',
        domesticCurrencyAmount: 40000,
        foreignCurrency: 'EUR',
        foreignCurrencyAmount: 8000,
        exchangeRate: 5.0,
        spread: 0.02,
        totalAmount: 40000,
        createdAt: '2025-06-03',
        status: 'PendingIOF',
        nature: 'ResidentMaintenance',
        clientName: 'Multinacional Ltda'
      }
    ];
  }
}