import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import FormField from '../UI/FormField';
import Card from '../UI/Card';
import CurrencyInput from '../UI/CurrencyInput';
import PercentageInput from '../UI/PercentageInput';
import { useOperations, CurrencyCode, OrderItem, NatureType } from '../../context/OperationsContext';

interface BuyStep2Props {
  initialData: {
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
  };
  onSubmit: (data: any) => void;
}

const BuyStep2 = ({ initialData, onSubmit }: BuyStep2Props) => {
  const navigate = useNavigate();
  const { getOrders } = useOperations();
  
  const [formData, setFormData] = useState(initialData);
  const [selectedOrders, setSelectedOrders] = useState<OrderItem[]>([]);
  const [showIOF, setShowIOF] = useState(!!initialData.nature);
  
  useEffect(() => {
    // Load selected orders
    if (initialData.selectedOrders.length > 0) {
      const orders = getOrders();
      const selected = orders.filter(order => initialData.selectedOrders.includes(order.id));
      setSelectedOrders(selected);
      
      // If all selected orders are of the same currency, pre-select it
      if (selected.length > 0) {
        const firstCurrency = selected[0].currency;
        const allSameCurrency = selected.every(order => order.currency === firstCurrency);
        
        if (allSameCurrency) {
          setFormData(prev => ({
            ...prev,
            foreignCurrency: firstCurrency
          }));
        }
      }
    }
  }, [initialData.selectedOrders, getOrders]);
  
  // Calculate total amount when relevant fields change
  useEffect(() => {
    const calculateTotal = () => {
      if (formData.domesticCurrencyAmount) {
        const spreadAmount = formData.domesticCurrencyAmount * formData.spread / 100;
        const total = formData.domesticCurrencyAmount + spreadAmount;
        
        setFormData(prev => ({
          ...prev,
          totalAmount: total
        }));
      }
    };
    
    calculateTotal();
  }, [formData.domesticCurrencyAmount, formData.spread]);
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleNatureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as NatureType;
    setFormData(prev => ({
      ...prev,
      nature: value
    }));
    setShowIOF(!!value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <button 
            onClick={() => navigate('/buy')} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-green-700" />
            Operação de Compra: Boletagem
          </h1>
        </div>
      </header>
      
      <main className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedOrders.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800">Ordens selecionadas:</h3>
              <div className="mt-2 text-sm text-green-700">
                {selectedOrders.map(order => (
                  <span key={order.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 mb-2">
                    {order.id} ({order.currency} {order.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {initialData.isWithoutOrder && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800">Nova Compra sem Ordem</h3>
              <p className="mt-1 text-sm text-blue-700">
                Você está criando uma nova operação de compra sem vincular a uma ordem existente.
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField id="foreignCurrency" label="Moeda" required>
                  <select 
                    id="foreignCurrency"
                    className="form-select"
                    value={formData.foreignCurrency}
                    onChange={(e) => handleInputChange('foreignCurrency', e.target.value)}
                    required
                  >
                    <option value="USD">USD - Dólar Americano</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - Libra Esterlina</option>
                  </select>
                </FormField>
                
                <FormField id="domesticCurrencyAmount" label="Valor em Moeda Nacional (BRL)" required>
                  <CurrencyInput 
                    id="domesticCurrencyAmount"
                    value={formData.domesticCurrencyAmount}
                    onChange={(value) => handleInputChange('domesticCurrencyAmount', value)}
                    currencySymbol="R$"
                  />
                </FormField>
                
                <FormField id="foreignCurrencyAmount" label="Valor em Moeda Estrangeira" required>
                  <CurrencyInput 
                    id="foreignCurrencyAmount"
                    value={formData.foreignCurrencyAmount}
                    onChange={(value) => handleInputChange('foreignCurrencyAmount', value)}
                  />
                </FormField>
                
                <FormField id="spread" label="Spread ou Taxa (%)" required>
                  <PercentageInput 
                    id="spread"
                    value={formData.spread}
                    onChange={(value) => handleInputChange('spread', value)}
                  />
                </FormField>
                
                <FormField id="nature" label="Natureza/Finalidade">
                  <select 
                    id="nature"
                    className="form-select"
                    value={formData.nature || ''}
                    onChange={handleNatureChange}
                  >
                    <option value="">Selecione...</option>
                    <option value="ImportOfGoods">Importação de Mercadorias</option>
                    <option value="TechnicalServices">Serviços Técnicos</option>
                    <option value="ResidentMaintenance">Manutenção de Residente</option>
                    <option value="ImportPayment">Pagamento de Importação</option>
                    <option value="Other">Outros</option>
                  </select>
                </FormField>
                
                {showIOF && (
                  <FormField id="iof" label="IOF (%)">
                    <select 
                      id="iof"
                      className="form-select"
                      value={formData.iof?.toString() || ''}
                      onChange={(e) => handleInputChange('iof', parseFloat(e.target.value))}
                    >
                      <option value="">Selecione...</option>
                      <option value="0.38">0.38%</option>
                      <option value="1.1">1.1%</option>
                      <option value="0.0">Isento</option>
                    </select>
                  </FormField>
                )}
                
                <FormField id="ir" label="IR (%)">
                  <PercentageInput 
                    id="ir"
                    value={formData.ir || 0}
                    onChange={(value) => handleInputChange('ir', value)}
                  />
                </FormField>
                
                <div className="md:col-span-2">
                  <div className="bg-green-50 p-4 rounded-lg flex items-start md:items-center md:justify-between flex-col md:flex-row">
                    <div>
                      <h4 className="font-medium text-green-800">Total da Operação (BRL)</h4>
                      <p className="text-sm text-green-600">Inclui taxa e spread</p>
                    </div>
                    <div className="text-2xl font-bold text-green-900 mt-2 md:mt-0">
                      R$ {formData.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-between mt-6">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/buy')}
              >
                Voltar
              </button>
              <button type="submit" className="btn-primary">
                Seguir
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BuyStep2;