import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Activity } from 'lucide-react';

const MainMenu = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <header className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-900 flex items-center">
            <DollarSign className="mr-2 h-8 w-8 text-blue-700" />
            Jornada FX
          </h1>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Sistema de Operações de Câmbio
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Selecione uma das opções abaixo para iniciar
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div 
              className="card hover:shadow-md cursor-pointer transform transition hover:-translate-y-1"
              onClick={() => navigate('/sell')}
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <DollarSign className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Venda</h3>
                <p className="text-gray-500">
                  Criar uma nova operação de venda de moeda estrangeira
                </p>
                <button className="mt-4 btn-primary w-full">
                  Iniciar Venda
                </button>
              </div>
            </div>
            
            <div 
              className="card hover:shadow-md cursor-pointer transform transition hover:-translate-y-1"
              onClick={() => navigate('/buy')}
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <TrendingUp className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Compra</h3>
                <p className="text-gray-500">
                  Criar uma nova operação de compra de moeda estrangeira
                </p>
                <button className="mt-4 btn-primary w-full">
                  Iniciar Compra
                </button>
              </div>
            </div>
            
            <div 
              className="card hover:shadow-md cursor-pointer transform transition hover:-translate-y-1"
              onClick={() => navigate('/track')}
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="bg-indigo-100 p-3 rounded-full mb-4">
                  <Activity className="h-8 w-8 text-indigo-700" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Acompanhar</h3>
                <p className="text-gray-500">
                  Acompanhar e gerenciar operações pendentes
                </p>
                <button className="mt-4 btn-primary w-full">
                  Acompanhar Operações
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Jornada FX - Protótipo © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainMenu;