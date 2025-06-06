export type CurrencyCode = 'USD' | 'EUR' | 'GBP';
export type ValutaType = 'D0' | 'D1' | 'D2';
export type SettlementType = 'Conta' | 'Cheque' | 'Ordem' | 'Especie';
export type NatureType = 
  | 'ImportOfGoods' 
  | 'TechnicalServices' 
  | 'ResidentMaintenance'
  | 'ImportPayment'
  | 'EFX'
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

export interface EFXDocumentItem {
  id: string;
  name: string;
  currency: CurrencyCode;
  nationalValue: number;
  foreignValue: number;
  date: string;
  status: 'Concluído' | 'Pendente' | 'Em Análise';
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
  valutaNational?: ValutaType;
  valutaForeign?: ValutaType;
  settlementTypeBrazil?: SettlementType;
  settlementTypeAbroad?: SettlementType;
  createdAt: string;
  status: OperationStatus;
  linkedDocuments?: string[];
  linkedOperationId?: string;
  orderId?: string;
  clientName?: string;
  relationshipLink?: string;
  sellerCode?: string;
  groupCode?: string;
  payerReceiverAbroad?: string;
  efxDocuments?: string[];
  skipEfxLinking?: boolean;
}