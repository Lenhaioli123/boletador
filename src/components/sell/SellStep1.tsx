import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ArrowLeft } from 'lucide-react';
import FormField from '../UI/FormField';
import Card from '../UI/Card';
import CurrencyInput from '../UI/CurrencyInput';
import PercentageInput from '../UI/PercentageInput';
import { CurrencyCode, NatureType } from '../../context/OperationsContext';

interface SellStep1Props {
  initialData: {
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
    isNetting: boolean;
    nettingDomesticAmount?: number;
    nettingForeignCurrency?: CurrencyCode;
    nettingForeignAmount?: number;
    nettingExchangeRate?: number;
    nettingSpread?: number;
    beneficiary?: string;
    country?: string;
  };
  onSubmit: (data: any) => void;
}

const SellStep1 = ({ initialData, onSubmit }: SellStep1Props) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(initialData);
  const [showIOF, setShowIOF] = useState(!!initialData.nature);
  const [showNetting, setShowNetting] = useState(initialData.isNetting);
  
  // Calculate total amount when relevant fields change
  useEffect(() => {
    const calculateTotal = () => {
      if (formData.foreignCurrencyAmount && formData.exchangeRate) {
        const baseAmount = formData.foreignCurrencyAmount * formData.exchangeRate;
        const spreadAmount = baseAmount * formData.spread / 100;
        const iofAmount = formData.iof ? baseAmount * formData.iof / 100 : 0;
        const irAmount = formData.ir ? baseAmount * formData.ir / 100 : 0;
        const total = baseAmount + spreadAmount + iofAmount + irAmount - (formData.fee || 0);
        
        setFormData(prev => ({
          ...prev,
          domesticCurrencyAmount: baseAmount,
          totalAmount: total
        }));
      }
    };
    
    calculateTotal();
  }, [formData.foreignCurrencyAmount, formData.exchangeRate, formData.spread, formData.fee, formData.iof, formData.ir]);
  
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
  
  const handleNettingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'true';
    setFormData(prev => ({
      ...prev,
      isNetting: value
    }));
    setShowNetting(value);
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
            onClick={() => navigate('/')} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            <DollarSign className="mr-2 h-6 w-6 text-blue-700" />
            Nova Operação de Venda: Dados Principais
          </h1>
        </div>
      </header>
      
      <main className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField id="beneficiary" label="Beneficiário" required>
                  <input
                    type="text"
                    id="beneficiary"
                    className="form-input"
                    value={formData.beneficiary || ''}
                    onChange={(e) => handleInputChange('beneficiary', e.target.value)}
                    required
                  />
                </FormField>

                <FormField id="country" label="País" required>
                  <select 
                    id="country"
                    className="form-select"
                    value={formData.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="USA">Estados Unidos</option>
                    <option value="GBR">Reino Unido</option>
                    <option value="DEU">Alemanha</option>
                    <option value="FRA">França</option>
                    <option value="ESP">Espanha</option>
                    <option value="ITA">Itália</option>
                    <option value="PRT">Portugal</option>
                    <option value="CHN">China</option>
                    <option value="JPN">Japão</option>
                  </select>
                </FormField>

                <FormField id="foreignCurrency" label="Moeda Estrangeira" required>
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
                
                <FormField id="foreignCurrencyAmount" label="Valor em Moeda Estrangeira" required>
                  <CurrencyInput 
                    id="foreignCurrencyAmount"
                    value={formData.foreignCurrencyAmount}
                    onChange={(value) => handleInputChange('foreignCurrencyAmount', value)}
                  />
                </FormField>
                
                <FormField id="exchangeRate" label="Taxa de Câmbio" required>
                  <CurrencyInput 
                    id="exchangeRate"
                    value={formData.exchangeRate}
                    onChange={(value) => handleInputChange('exchangeRate', value)}
                  />
                </FormField>
                
                <FormField id="spread" label="Spread (%)" required>
                  <PercentageInput 
                    id="spread"
                    value={formData.spread}
                    onChange={(value) => handleInputChange('spread', value)}
                  />
                </FormField>
                
                <FormField id="fee" label="Tarifa (BRL)">
                  <CurrencyInput 
                    id="fee"
                    value={formData.fee || 0}
                    onChange={(value) => handleInputChange('fee', value)}
                    currencySymbol="R$"
                  />
                </FormField>
                
                <FormField id="domesticCurrencyAmount" label="Valor em Moeda Nacional (BRL)">
                  <CurrencyInput 
                    id="domesticCurrencyAmount"
                    value={formData.domesticCurrencyAmount}
                    onChange={(value) => handleInputChange('domesticCurrencyAmount', value)}
                    currencySymbol="R$"
                    disabled
                  />
                </FormField>
                
                <div className="md:col-span-2">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">Resumo da Operação</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-blue-600">Taxa de Câmbio:</p>
                        <p className="font-medium text-blue-900">
                          {formData.exchangeRate.toLocaleString('pt-BR', { minimumFractionDigits: 4 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">Spread:</p>
                        <p className="font-medium text-blue-900">{formData.spread}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">IOF:</p>
                        <p className="font-medium text-blue-900">{formData.iof || 0}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">IR:</p>
                        <p className="font-medium text-blue-900">{formData.ir || 0}%</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-blue-600">Total (BRL):</p>
                        <p className="text-xl font-bold text-blue-900">
                          R$ {formData.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
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
                
                <FormField id="isNetting" label="Realizar Netting?">
                  <select 
                    id="isNetting"
                    className="form-select"
                    value={formData.isNetting.toString()}
                    onChange={handleNettingChange}
                  >
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </FormField>
              </div>
            </Card>
            
            {showNetting && (
              <Card className="mb-6" title="Operação de Compra Vinculada (Netting)">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField id="nettingDomesticAmount" label="Valor Nacional (Compra)">
                    <CurrencyInput 
                      id="nettingDomesticAmount"
                      value={formData.nettingDomesticAmount || 0}
                      onChange={(value) => handleInputChange('nettingDomesticAmount', value)}
                      currencySymbol="R$"
                    />
                  </FormField>
                  
                  <FormField id="nettingForeignCurrency" label="Moeda (Compra)">
                    <select 
                      id="nettingForeignCurrency"
                      className="form-select"
                      value={formData.nettingForeignCurrency || 'USD'}
                      onChange={(e) => handleInputChange('nettingForeignCurrency', e.target.value)}
                    >
                      <option value="USD">USD - Dólar Americano</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - Libra Esterlina</option>
                    </select>
                  </FormField>
                  
                  <FormField id="nettingForeignAmount" label="Valor Estrangeiro (Compra)">
                    <CurrencyInput 
                      id="nettingForeignAmount"
                      value={formData.nettingForeignAmount || 0}
                      onChange={(value) => handleInputChange('nettingForeignAmount', value)}
                    />
                  </FormField>
                  
                  <FormField id="nettingExchangeRate" label="Taxa (Compra)">
                    <CurrencyInput 
                      id="nettingExchangeRate"
                      value={formData.nettingExchangeRate || 0}
                      onChange={(value) => handleInputChange('nettingExchangeRate', value)}
                    />
                  </FormField>
                  
                  <FormField id="nettingSpread" label="Spread (Compra) (%)">
                    <PercentageInput 
                      id="nettingSpread"
                      value={formData.nettingSpread || 0}
                      onChange={(value) => handleInputChange('nettingSpread', value)}
                    />
                  </FormField>
                </div>
              </Card>
            )}
            
            <div className="flex justify-end mt-6">
              <button 
                type="button" 
                className="btn-secondary mr-4"
                onClick={() => navigate('/')}
              >
                Cancelar
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

export default SellStep1;