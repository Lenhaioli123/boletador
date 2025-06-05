import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import FormField from '../UI/FormField';
import PercentageInput from '../UI/PercentageInput';
import { useOperations, Operation } from '../../context/OperationsContext';

interface EditOperationModalProps {
  operationId: string;
  onClose: () => void;
}

const EditOperationModal = ({ operationId, onClose }: EditOperationModalProps) => {
  const { getOperation, updateOperation } = useOperations();
  const [operation, setOperation] = useState<Operation | null>(null);
  
  const [formData, setFormData] = useState({
    nature: '',
    iof: 0,
    ir: 0,
    valuta: 'D1',
    paymentType: 'TED'
  });
  
  useEffect(() => {
    const op = getOperation(operationId);
    if (op) {
      setOperation(op);
      setFormData({
        nature: op.nature || '',
        iof: op.iof || 0,
        ir: op.ir || 0,
        valuta: op.valuta || 'D1',
        paymentType: op.paymentType || 'TED'
      });
    }
  }, [operationId, getOperation]);
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (operation) {
      updateOperation(operationId, {
        ...formData,
        status: 'Complete'
      });
      onClose();
    }
  };
  
  if (!operation) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Completar Dados da Operação
            </h2>
            <button 
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Resumo da Operação:</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{operation.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">{operation.type === 'buy' ? 'Compra' : 'Venda'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Moeda</p>
                  <p className="font-medium">{operation.foreignCurrency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="font-medium">
                    {operation.foreignCurrencyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Total (BRL)</p>
                  <p className="font-medium">
                    R$ {operation.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <option value="OrderPaymentExterior">Ordem de Pagamento Exterior</option>
                    <option value="UseAccountBalance">Utilizar Saldo em Conta</option>
                  </select>
                </FormField>
              </div>
              
              <div className="flex justify-end mt-6 space-x-4">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-success"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOperationModal;