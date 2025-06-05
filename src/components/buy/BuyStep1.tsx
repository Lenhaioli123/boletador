import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowLeft, Check } from 'lucide-react';
import { useOperations, OrderItem } from '../../context/OperationsContext';

interface BuyStep1Props {
  initialData: {
    selectedOrders: string[];
    isWithoutOrder: boolean;
  };
  onSubmit: (data: any) => void;
}

const BuyStep1 = ({ initialData, onSubmit }: BuyStep1Props) => {
  const navigate = useNavigate();
  const { getOrders } = useOperations();
  
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(initialData.selectedOrders);
  
  useEffect(() => {
    // Load orders
    setOrders(getOrders());
  }, [getOrders]);
  
  const toggleOrderSelection = (orderId: string) => {
    if (selectedOrderIds.includes(orderId)) {
      setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
    } else {
      setSelectedOrderIds(prev => [...prev, orderId]);
    }
  };
  
  const handleContinueWithOrders = () => {
    onSubmit({
      selectedOrders: selectedOrderIds,
      isWithoutOrder: false
    });
  };
  
  const handleNewBuyWithoutOrder = () => {
    onSubmit({
      selectedOrders: [],
      isWithoutOrder: true
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <button 
            onClick={() => navigate('/')} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-green-700" />
            Operação de Compra: Selecionar Ordem(ns)
          </h1>
        </div>
      </header>
      
      <main className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Selecione uma ou mais ordens para prosseguir
              </h2>
              
              <div className="table-container">
                <table className="data-table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell w-12"></th>
                      <th className="table-header-cell">ID da Ordem</th>
                      <th className="table-header-cell">Nome do Cliente</th>
                      <th className="table-header-cell">Moeda</th>
                      <th className="table-header-cell">Valor</th>
                      <th className="table-header-cell">Data da Ordem</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {orders.map(order => (
                      <tr 
                        key={order.id} 
                        className={`table-row ${selectedOrderIds.includes(order.id) ? 'bg-green-50' : ''}`}
                        onClick={() => toggleOrderSelection(order.id)}
                      >
                        <td className="table-cell">
                          <div className="flex items-center justify-center">
                            <div className={`h-5 w-5 border rounded flex items-center justify-center ${
                              selectedOrderIds.includes(order.id) 
                                ? 'bg-green-600 border-green-600' 
                                : 'border-gray-300'
                            }`}>
                              {selectedOrderIds.includes(order.id) && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="table-cell font-medium text-gray-900">{order.id}</td>
                        <td className="table-cell">{order.clientName}</td>
                        <td className="table-cell">{order.currency}</td>
                        <td className="table-cell">
                          {order.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="table-cell">
                          {new Date(order.date).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                    
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="table-cell text-center py-8 text-gray-500">
                          Nenhuma ordem disponível.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="px-4 py-4 sm:px-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button 
                className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
                onClick={() => navigate('/')}
              >
                Cancelar
              </button>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto order-1 sm:order-2">
                <button 
                  className="btn-primary w-full sm:w-auto"
                  onClick={handleNewBuyWithoutOrder}
                >
                  Nova Compra Sem Ordem
                </button>
                
                <button 
                  className="btn-success w-full sm:w-auto"
                  onClick={handleContinueWithOrders}
                  disabled={selectedOrderIds.length === 0}
                >
                  Prosseguir com Ordem(ns) Selecionada(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyStep1;