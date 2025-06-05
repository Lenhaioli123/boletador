import { XCircle } from 'lucide-react';
import { useOperations, Operation } from '../../context/OperationsContext';

interface GroupOperationsModalProps {
  operationIds: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

const GroupOperationsModal = ({ operationIds, onConfirm, onCancel }: GroupOperationsModalProps) => {
  const { operations } = useOperations();
  
  // Get the selected operations
  const selectedOperations = operations.filter(op => operationIds.includes(op.id));
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Agrupar Operações
            </h2>
            <button 
              className="text-gray-400 hover:text-gray-500"
              onClick={onCancel}
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Você selecionou {operationIds.length} operações para agrupar. Isso criará uma única operação agrupada.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Operações selecionadas:</h3>
              <ul className="space-y-2">
                {selectedOperations.map(op => (
                  <li key={op.id} className="flex justify-between p-2 bg-white rounded border border-gray-200">
                    <div>
                      <span className="font-medium">{op.id}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({op.type === 'buy' ? 'Compra' : 'Venda'})
                      </span>
                    </div>
                    <div className="text-gray-700">
                      {op.foreignCurrency} {op.foreignCurrencyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button 
              className="btn-secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button 
              className="btn-primary"
              onClick={onConfirm}
            >
              Agrupar Operações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupOperationsModal;