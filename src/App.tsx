import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import SellJourney from './components/sell/SellJourney';
import BuyJourney from './components/buy/BuyJourney';
import TrackOperations from './components/track/TrackOperations';
import { OperationsProvider } from './context/OperationsContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <OperationsProvider>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/sell/*" element={<SellJourney />} />
          <Route path="/buy/*" element={<BuyJourney />} />
          <Route path="/track" element={<TrackOperations />} />
        </Routes>
      </OperationsProvider>
    </div>
  );
}

export default App;