import { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export type PaymentType = 'TED' | 'DOC' | 'OrderPaymentExterior' | 'UseAccountBalance';

export type ValutaType = 'D0' | 'D1' | 'D2';

export type NatureType = 
  | 'ImportOfGoods' 
  | 'TechnicalServices' 
  | 'ResidentMaintenance'
  | 'ImportPayment'
  | 'Other';

export type OperationType = 'buy' | 'sell';

export type OperationStatus = 
  | 'PendingNature'
  | 'PendingValuta'
  | 'PendingIOF'
  | 'Complete';

export interface OrderItem {
  id: string;
  clientName: string;
  currency: CurrencyCode;
  amount: number;
  date: string;
}

export interface Operation {
  id: string;
  type: OperationType;
  domesticCurrencyAmount: number;
  foreignCurrency: CurrencyCode;
  foreignCurrencyAmount: number;
  exchangeRate: number;
  spread: number;
  fee?: number;
  totalAmount: number;
  nature?: NatureType;
  iof?: number;
  ir?: number;
  valuta?: ValutaType;
  paymentType?: PaymentType;
  createdAt: string;
  status: OperationStatus;
  linkedDocuments?: string[];
  linkedOperationId?: string; // For netting
  orderId?: string; // For buy operations
  clientName?: string;
}

interface OperationsContextType {
  operations: Operation[];
  orders: OrderItem[];
  addOperation: (operation: Omit<Operation, 'id' | 'createdAt' | 'status'>) => string;
  updateOperation: (id: string, data: Partial<Operation>) => void;
  getOperation: (id: string) => Operation | undefined;
  getOrders: () => OrderItem[];
  linkOperations: (sellOperationId: string, buyOperationId: string) => void;
  groupOperations: (operationIds: string[]) => string;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

// Sample data for orders
const sampleOrders: OrderItem[] = [
  { id: 'order-1', clientName: 'Empresa ABC Ltda', currency: 'USD', amount: 5000, date: '2025-06-01' },
  { id: 'order-2', clientName: 'Importadora XYZ S.A.', currency: 'EUR', amount: 3500, date: '2025-05-30' },
  { id: 'order-3', clientName: 'Global Services Inc.', currency: 'USD', amount: 10000, date: '2025-06-02' },
  { id: 'order-4', clientName: 'Tech Solutions SA', currency: 'GBP', amount: 2800, date: '2025-06-03' },
  { id: 'order-5', clientName: 'Empresa ABC Ltda', currency: 'EUR', amount: 7500, date: '2025-05-29' }
];

// Sample operations for tracking
const sampleOperations: Operation[] = [
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

export const OperationsProvider = ({ children }: { children: ReactNode }) => {
  const [operations, setOperations] = useState<Operation[]>(sampleOperations);
  const [orders, setOrders] = useState<OrderItem[]>(sampleOrders);

  const addOperation = (operationData: Omit<Operation, 'id' | 'createdAt' | 'status'>) => {
    const id = uuidv4();
    const newOperation: Operation = {
      ...operationData,
      id,
      createdAt: new Date().toISOString(),
      status: 'PendingNature'
    };
    
    setOperations(prev => [...prev, newOperation]);
    return id;
  };

  const updateOperation = (id: string, data: Partial<Operation>) => {
    setOperations(prev => 
      prev.map(op => op.id === id ? { ...op, ...data } : op)
    );
  };

  const getOperation = (id: string) => {
    return operations.find(op => op.id === id);
  };

  const getOrders = () => {
    return orders;
  };

  const linkOperations = (sellOperationId: string, buyOperationId: string) => {
    setOperations(prev => 
      prev.map(op => {
        if (op.id === sellOperationId || op.id === buyOperationId) {
          return {
            ...op,
            linkedOperationId: op.id === sellOperationId ? buyOperationId : sellOperationId
          };
        }
        return op;
      })
    );
  };

  const groupOperations = (operationIds: string[]) => {
    const groupId = `GRP-${uuidv4().substr(0, 6)}`;
    
    // In a real implementation, this would create a new group operation
    // For the prototype, we'll just update the status
    setOperations(prev => 
      prev.map(op => {
        if (operationIds.includes(op.id)) {
          return {
            ...op,
            status: 'Complete',
          };
        }
        return op;
      })
    );
    
    return groupId;
  };

  return (
    <OperationsContext.Provider 
      value={{ 
        operations, 
        orders, 
        addOperation, 
        updateOperation, 
        getOperation, 
        getOrders,
        linkOperations,
        groupOperations
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (context === undefined) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return context;
};