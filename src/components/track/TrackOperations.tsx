import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Filter, Check, PlusCircle } from 'lucide-react';
import { useOperations, Operation, OperationType } from '../../context/OperationsContext';
import GroupOperationsModal from './GroupOperationsModal';
import EditOperationModal from './EditOperationModal';

const TrackOperations = () => {
  const navigate = useNavigate();
  const { operations, groupOperations } = useOperations();
  
  const [selectedOperationIds, setSelectedOperationIds] = useState<string[]>([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | OperationType,
    search: ''
  });
  
  const filteredOperations = operations.filter(op => {
    // Filter by type
    if (filters.type !== 'all' && op.type !== filters.type) {
      return false;
    }
    
    // Filter by search term
    if (filters.search && 
        !op.id.toLowerCase().includes(filters.search.toLowerCase()) &&
        !(op.clientName && op.clientName.toLowerCase().includes(filters.search.toLowerCase()))) {
      return false;
    }
    
    return true;
  });
  
  const toggleOperationSelection = (operationId: string) => {
    if (selectedOperationIds.includes(operationId)) {
      setSelectedOperationIds(prev => prev.filter(id => id !== operationId));
    } else {
      setSelectedOperationIds(prev => [...prev, operationId]);
    }
  };
  
  const handleGroupOperations = () => {
    setShowGroupModal(true);
  };
  
  const confirmGroupOperations = () => {
    groupOperations(selectedOperationIds);
    setShowGroupModal(false);
    setSelectedOperationIds([]);
  };
  
  const handleCompleteOperations = () => {
    if (selectedOperationIds.length === 1) {
      setShowEditModal(true);
    } else {
      // For multiple operations, we would show a simpler edit modal
      // For the prototype, we'll just show an alert
      alert("Funcionalidade de completar múltiplas operações em lote: Permitirá definir Natureza, IOF, IR, Valuta comuns para as selecionadas.");
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PendingNature':
        return 'Pendente: Natureza';
      case 'PendingValuta':
        return 'Pendente: Valuta';
      case 'PendingIOF':
        return 'Pendente: IOF';
      case 'Complete':
        return 'Completa';
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PendingNature':
        return 'bg-yellow-100 text-yellow-800';
      case 'PendingValuta':
        return 'bg-orange-100 text-orange-800';
      case 'PendingIOF':
        return 'bg-red-100 text-red-800';
      case 'Complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <Activity className="mr-2 h-6 w-6 text-indigo-700" />
            Acompanhamento de Operações Pendentes
          </h1>
        </div>
      </header>
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="pl-10 form-select"
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                    >
                      <option value="all">Todas as Operações</option>
                      <option value="buy">Compra</option>
                      <option value="sell">Venda</option>
                    </select>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por ID ou Cliente"
                      className="form-input pl-3 pr-10"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    className="btn-primary flex items-center"
                    disabled={selectedOperationIds.length === 0}
                    onClick={handleCompleteOperations}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Completar Dados
                  </button>
                  
                  <button
                    className="btn-success flex items-center"
                    disabled={selectedOperationIds.length < 2}
                    onClick={handleGroupOperations}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Agrupar Operações
                  </button>
                </div>
              </div>
              
              <div className="table-container">
                <table className="data-table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell w-12"></th>
                      <th className="table-header-cell">ID</th>
                      <th className="table-header-cell">Tipo</th>
                      <th className="table-header-cell">Cliente</th>
                      <th className="table-header-cell">Moeda</th>
                      <th className="table-header-cell">Valor Estrangeiro</th>
                      <th className="table-header-cell">Valor Nacional</th>
                      <th className="table-header-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {filteredOperations.map(operation => (
                      <tr 
                        key={operation.id} 
                        className={`table-row ${selectedOperationIds.includes(operation.id) ? 'bg-indigo-50' : ''}`}
                        onClick={() => toggleOperationSelection(operation.id)}
                      >
                        <td className="table-cell">
                          <div className="flex items-center justify-center">
                            <div className={`h-5 w-5 border rounded flex items-center justify-center ${
                              selectedOperationIds.includes(operation.id) 
                                ? 'bg-indigo-600 border-indigo-600' 
                                : 'border-gray-300'
                            }`}>
                              {selectedOperationIds.includes(operation.id) && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="table-cell font-medium text-gray-900">{operation.id}</td>
                        <td className="table-cell">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            operation.type === 'buy' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {operation.type === 'buy' ? 'Compra' : 'Venda'}
                          </span>
                        </td>
                        <td className="table-cell">{operation.clientName || 'N/A'}</td>
                        <td className="table-cell">{operation.foreignCurrency}</td>
                        <td className="table-cell">
                          {operation.foreignCurrencyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="table-cell">
                          R$ {operation.domesticCurrencyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="table-cell">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(operation.status)}`}>
                            {getStatusLabel(operation.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredOperations.length === 0 && (
                      <tr>
                        <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                          Nenhuma operação encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {showGroupModal && (
        <GroupOperationsModal 
          operationIds={selectedOperationIds}
          onConfirm={confirmGroupOperations}
          onCancel={() => setShowGroupModal(false)}
        />
      )}
      
      {showEditModal && (
        <EditOperationModal 
          operationId={selectedOperationIds[0]}
          onClose={() => {
            setShowEditModal(false);
            setSelectedOperationIds([]);
          }}
        />
      )}
    </div>
  );
};

export default TrackOperations;