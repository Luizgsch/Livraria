import React from 'react';
import { EcommerceProvider } from './context/EcommerceContext.jsx';
import { Header } from './components/Header.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { CatalogGrid } from './components/CatalogGrid.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';
import { ProductModal } from './components/ProductModal.jsx';
import { Toast } from './components/Toast.jsx';
import { Footer } from './components/Footer.jsx';
import './index.css';

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CatalogGrid />
      </main>
      <CartDrawer />
      <ProductModal />
      <Toast />
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <EcommerceProvider>
      <AppContent />
    </EcommerceProvider>
  );
}

export default App;
