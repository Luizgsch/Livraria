import React from 'react';
import { EcommerceProvider } from './context/EcommerceContext.jsx';
import { EcommerceDashboard } from './components/EcommerceDashboard.jsx';
import './index.css';

export function App() {
  return (
    <EcommerceProvider>
      <EcommerceDashboard />
    </EcommerceProvider>
  );
}

export default App;
