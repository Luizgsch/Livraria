import React from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';
import { SearchBar } from './SearchBar.jsx';

export function Header() {
  const { carrinho, setShowCart, showCart } = useEcommerce();

  const cartCount = carrinho.length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-beige-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-xl font-bold text-brown-dark">Livraria POO</h1>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Cart Icon */}
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-md hover:bg-beige-50 transition-colors"
          title="Abrir carrinho"
        >
          <span className="text-2xl">🛒</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-status-error text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
