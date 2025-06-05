import { useState } from 'react';
import { XCircle, Check } from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  value: number;
  date: string;
}

interface DocumentsModalProps {
  operationValue: number;
  onSubmit: (selectedDocuments: string[]) => void;
  onCancel: () => void;
}

const DocumentsModal = ({ operationValue, onSubmit, onCancel }: DocumentsModalProps) => {
  // Sample documents for the prototype
  const documents: DocumentItem[] = [
    { id: 'doc-1', name: 'Boleto_NotaFiscal_123.pdf', value: 1500, date: '2025-06-01' },
    { id: 'doc-2', name: 'Invoice_XYZ_Serv.pdf', value: 3500, date: '2025-05-30' },
    { id: 'doc-3', name: 'Boleto_Fornecedor_A.xml', value: 5000, date: '2025-06-02' },
    { id: 'doc-4', name: 'Contrato_Servico_B.pdf', value: 2000, date: '2025-05-29' },
    { id: 'doc-5', name: 'Fatura_Internacional_C.pdf', value: 8000, date: '2025-06-05' },
  ];
  
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  
  const toggleDocumentSelection = (documentId: string) => {
    if (selectedDocumentIds.includes(documentId)) {
      setSelectedDocumentIds(prev => prev.filter(id => id !== documentId));
    } else {
      setSelectedDocumentIds(prev => [...prev, documentId]);
    }
  };
  
  const totalSelectedValue = documents
    .filter(doc => selectedDocumentIds.includes(doc.id))
    .reduce((sum, doc) => sum + doc.value, 0);
  
  const remainingBalance = operationValue - totalSelectedValue;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Vincular Boletos/Arquivos à Operação
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
              A natureza selecionada permite o vínculo de boletos/documentos.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-1">Valor Total da Operação FX:</h3>
              <p className="text-xl font-bold text-blue-900">
                R$ {operationValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-2">
              Total de Boletos/Arquivos Disponíveis para Vínculo:
            </h3>
            
            <div className="table-container mb-4">
              <table className="data-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell w-12"></th>
                    <th className="table-header-cell">Nome do Arquivo/Boleto</th>
                    <th className="table-header-cell">Valor</th>
                    <th className="table-header-cell">Data</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {documents.map(document => (
                    <tr 
                      key={document.id} 
                      className={`table-row ${selectedDocumentIds.includes(document.id) ? 'bg-blue-50' : ''}`}
                      onClick={() => toggleDocumentSelection(document.id)}
                    >
                      <td className="table-cell">
                        <div className="flex items-center justify-center">
                          <div className={`h-5 w-5 border rounded flex items-center justify-center ${
                            selectedDocumentIds.includes(document.id) 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-gray-300'
                          }`}>
                            {selectedDocumentIds.includes(document.id) && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell font-medium text-gray-900">{document.name}</td>
                      <td className="table-cell">
                        R$ {document.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="table-cell">
                        {new Date(document.date).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-1">Total dos Arquivos Selecionados:</h3>
                <p className="text-lg font-bold text-blue-900">
                  R$ {totalSelectedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${remainingBalance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className={`font-medium mb-1 ${remainingBalance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  Saldo da Operação FX Após Vínculo:
                </h3>
                <p className={`text-lg font-bold ${remainingBalance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  R$ {remainingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button 
              className="btn-secondary"
              onClick={onCancel}
            >
              Ignorar e Continuar sem Vínculo
            </button>
            <button 
              className="btn-primary"
              onClick={() => onSubmit(selectedDocumentIds)}
              disabled={selectedDocumentIds.length === 0}
            >
              Vincular Selecionados e Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;