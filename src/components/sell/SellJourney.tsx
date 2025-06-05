import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SellStep1 from './SellStep1';
import SellStep2 from './SellStep2';
import SuccessScreen from '../shared/SuccessScreen';
import { useOperations, Operation, CurrencyCode, NatureType } from '../../context/OperationsContext';
import DocumentsModal from '../shared/DocumentsModal';

interface SellOperationData {
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
  
  // Netting data
  isNetting: boolean;
  nettingDomesticAmount?: number;
  nettingForeignCurrency?: CurrencyCode;
  nettingForeignAmount?: number;
  nettingExchangeRate?: number;
  nettingSpread?: number;
}

const SellJourney = () => {
  const navigate = useNavigate();
  const { addOperation } = useOperations();
  
  const [operationData, setOperationData] = useState<SellOperationData>({
    domesticCurrencyAmount: 0,
    foreignCurrency: 'USD',
    foreignCurrencyAmount: 0,
    exchangeRate: 5.0,
    spread: 0.02,
    totalAmount: 0,
    isNetting: false
  });
  
  const [operationId, setOperationId] = useState<string | null>(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  
  const handleStep1Submit = (data: Partial<SellOperationData>) => {
    setOperationData(prev => ({
      ...prev,
      ...data
    }));
    navigate('/sell/step2');
  };
  
  const handleStep2Submit = (data: Partial<SellOperationData>) => {
    const finalData = {
      ...operationData,
      ...data
    };
    
    // Check if we need to show the documents modal
    if (finalData.nature === 'ImportPayment') {
      setShowDocumentsModal(true);
      return;
    }
    
    completeOperation(finalData);
  };
  
  const completeOperation = (data: SellOperationData) => {
    // Create the operation
    const newOperationId = addOperation({
      type: 'sell',
      domesticCurrencyAmount: data.domesticCurrencyAmount,
      foreignCurrency: data.foreignCurrency,
      foreignCurrencyAmount: data.foreignCurrencyAmount,
      exchangeRate: data.exchangeRate,
      spread: data.spread,
      fee: data.fee,
      totalAmount: data.totalAmount,
      nature: data.nature,
      iof: data.iof,
      ir: data.ir,
      // We don't add netting here, it would be handled separately
    });
    
    setOperationId(newOperationId);
    navigate('/sell/success');
  };
  
  const handleDocumentsSubmit = (selectedDocuments: string[]) => {
    setShowDocumentsModal(false);
    completeOperation({
      ...operationData,
      // Add the selected documents in a real implementation
    });
  };
  
  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={<SellStep1 initialData={operationData} onSubmit={handleStep1Submit} />} 
        />
        <Route 
          path="/step2" 
          element={<SellStep2 initialData={operationData} onSubmit={handleStep2Submit} />} 
        />
        <Route 
          path="/success" 
          element={
            <SuccessScreen 
              title="Operação de Venda Concluída" 
              operationId={operationId || ''} 
              operationType="venda"
            />
          } 
        />
      </Routes>
      
      {showDocumentsModal && (
        <DocumentsModal 
          operationValue={operationData.totalAmount}
          onSubmit={handleDocumentsSubmit}
          onCancel={() => {
            setShowDocumentsModal(false);
            completeOperation(operationData);
          }}
        />
      )}
    </>
  );
};

export default SellJourney;