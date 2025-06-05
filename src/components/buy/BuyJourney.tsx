import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import BuyStep1 from './BuyStep1';
import BuyStep2 from './BuyStep2';
import BuyStep3 from './BuyStep3';
import SuccessScreen from '../shared/SuccessScreen';
import { useOperations, OrderItem, CurrencyCode, NatureType } from '../../context/OperationsContext';
import DocumentsModal from '../shared/DocumentsModal';

interface BuyOperationData {
  selectedOrders: string[];
  isWithoutOrder: boolean;
  domesticCurrencyAmount: number;
  foreignCurrency: CurrencyCode;
  foreignCurrencyAmount: number;
  exchangeRate: number;
  spread: number;
  totalAmount: number;
  nature?: NatureType;
  iof?: number;
  ir?: number;
}

const BuyJourney = () => {
  const navigate = useNavigate();
  const { addOperation, getOrders } = useOperations();
  
  const [operationData, setOperationData] = useState<BuyOperationData>({
    selectedOrders: [],
    isWithoutOrder: false,
    domesticCurrencyAmount: 0,
    foreignCurrency: 'USD',
    foreignCurrencyAmount: 0,
    exchangeRate: 5.0,
    spread: 0.02,
    totalAmount: 0
  });
  
  const [operationId, setOperationId] = useState<string | null>(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  
  const handleStep1Submit = (data: Partial<BuyOperationData>) => {
    setOperationData(prev => ({
      ...prev,
      ...data
    }));
    navigate('/buy/step2');
  };
  
  const handleStep2Submit = (data: Partial<BuyOperationData>) => {
    setOperationData(prev => ({
      ...prev,
      ...data
    }));
    navigate('/buy/step3');
  };
  
  const handleStep3Submit = (data: Partial<BuyOperationData>) => {
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
  
  const completeOperation = (data: BuyOperationData) => {
    // Create the operation
    const newOperationId = addOperation({
      type: 'buy',
      domesticCurrencyAmount: data.domesticCurrencyAmount,
      foreignCurrency: data.foreignCurrency,
      foreignCurrencyAmount: data.foreignCurrencyAmount,
      exchangeRate: data.exchangeRate,
      spread: data.spread,
      totalAmount: data.totalAmount,
      nature: data.nature,
      iof: data.iof,
      ir: data.ir,
      // For linked orders, we would store the order IDs
    });
    
    setOperationId(newOperationId);
    navigate('/buy/success');
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
          element={<BuyStep1 initialData={operationData} onSubmit={handleStep1Submit} />} 
        />
        <Route 
          path="/step2" 
          element={<BuyStep2 initialData={operationData} onSubmit={handleStep2Submit} />} 
        />
        <Route 
          path="/step3" 
          element={<BuyStep3 initialData={operationData} onSubmit={handleStep3Submit} />} 
        />
        <Route 
          path="/success" 
          element={
            <SuccessScreen 
              title="Operação de Compra Concluída" 
              operationId={operationId || ''} 
              operationType="compra"
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

export default BuyJourney;