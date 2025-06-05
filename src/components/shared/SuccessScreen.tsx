import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface SuccessScreenProps {
  title: string;
  operationId: string;
  operationType: 'compra' | 'venda';
}

const SuccessScreen = ({ title, operationId, operationType }: SuccessScreenProps) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto px-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 mb-1">ID da Operação:</p>
                <p className="text-xl font-semibold text-gray-900">{operationId}</p>
              </div>
              
              <p className="text-gray-600 mb-6">
                Sua operação de {operationType} foi processada com sucesso.
              </p>
              
              <div className="space-y-4">
                <button 
                  className="btn-primary w-full"
                  onClick={() => navigate('/')}
                >
                  Nova Operação
                </button>
                
                <button 
                  className="btn-secondary w-full"
                  onClick={() => navigate('/track')}
                >
                  Acompanhar Operações
                </button>
              </div>
              
              <p className="mt-6 text-sm text-gray-500">
                Redirecionando para a página inicial em {countdown} segundos...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuccessScreen;