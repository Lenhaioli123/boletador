import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import FormField from '../UI/FormField';
import Card from '../UI/Card';
import PercentageInput from '../UI/PercentageInput';
import { CurrencyCode, NatureType, ValutaType, PaymentType } from '../../context/OperationsContext';

interface BuyStep3Props {
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
    valuta?: ValutaType;
    paymentType?: PaymentType;
  };
  onSubmit: (data: any) => void;
}

const BuyStep3 = ({ initialData, onSubmit }: BuyStep3Props) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    ...initialData,
    valuta: initialData.valuta || 'D1',
    paymentType: initialData.paymentType || 'TED'
  });
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
            onClick={() => navigate('/buy/step2')} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-green-700" />
            Operação de Compra: Finalização
          </h1>
        </div>
      </header>
      
      <main className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6" title="Resumo da Operação">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Moeda</p>
                  <p className="font-medium">{formData.foreignCurrency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Estrangeiro</p>
                  <p className="font-medium">
                    {formData.foreignCurrencyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Nacional</p>
                  <p className="font-medium">
                    R$ {formData.domesticCurrencyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Spread</p>
                  <p className="font-medium">{formData.spread}%</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Total da Operação (BRL)</p>
                  <p className="font-medium text-lg text-green-800">
                    R$ {formData.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="mb-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField id="nature" label="Natureza" required>
                  <select 
                    id="nature"
                    className="form-select"
                    value={formData.nature || ''}
                    onChange={(e) => handleInputChange('nature', e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="ImportOfGoods">Importação de Mercadorias</option>
                    <option value="TechnicalServices">Serviços Técnicos</option>
                    <option value="ResidentMaintenance">Manutenção de Residente</option>
                    <option value="ImportPayment">Pagamento de Importação</option>
                    <option value="Other">Outros</option>
                  </select>
                </FormField>
                
                <FormField id="valuta" label="Valuta" required>
                  <select 
                    id="valuta"
                    className="form-select"
                    value={formData.valuta}
                    onChange={(e) => handleInputChange('valuta', e.target.value)}
                    required
                  >
                    <option value="D0">D0 (Hoje)</option>
                    <option value="D1">D1 (Amanhã)</option>
                    <option value="D2">D2 (Depois de Amanhã)</option>
                  </select>
                </FormField>
                
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
                
                <FormField id="ir" label="IR (%)">
                  <PercentageInput 
                    id="ir"
                    value={formData.ir || 0}
                    onChange={(value) => handleInputChange('ir', value)}
                  />
                </FormField>
                
                <FormField id="paymentType" label="Tipo de Pagamento" required>
                  <select 
                    id="paymentType"
                    className="form-select"
                    value={formData.paymentType}
                    onChange={(e) => handleInputChange('paymentType', e.target.value)}
                    required
                  >
                    <option value="TED">TED</option>
                    <option value="DOC">DOC</option>
                    {/* If the operation is without order, we don't show the Order option */}
                    {!formData.isWithoutOrder && (
                      <option value="OrderPaymentExterior">Ordem de Pagamento Exterior</option>
                    )}
                    <option value="UseAccountBalance">Utilizar Saldo em Conta</option>
                  </select>
                </FormField>
              </div>
            </Card>
            
            <div className="flex justify-between mt-6">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/buy/step2')}
              >
                Voltar
              </button>
              <button type="submit" className="btn-success">
                Finalizar Operação de Compra
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BuyStep3;