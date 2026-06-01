import React, { useState } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function ProductCard({ livro }) {
  const { adicionarAoCarrinho } = useEcommerce();
  const [quantidade, setQuantidade] = useState(1);
  const [addedRecently, setAddedRecently] = useState(false);

  const precoFinal = livro.calcularPrecoFinal();
  const isOutOfStock = livro.estoque === 0;

  const handleAddToCart = () => {
    try {
      adicionarAoCarrinho(livro.id, quantidade);
      setQuantidade(1);
      setAddedRecently(true);
      setTimeout(() => setAddedRecently(false), 1000);
    } catch (e) {
      // Error handled in context
    }
  };

  return (
    <div className="card bg-white border border-beige-200 rounded-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300">
      {/* Image placeholder */}
      <div className="bg-beige-100 h-48 flex items-center justify-center text-6xl border-b border-beige-200">
        📖
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-bold text-brown-dark line-clamp-2">
            {livro.titulo}
          </h3>
          <p className="text-sm text-brown-light">{livro.autor}</p>
        </div>

        {/* Type info */}
        <div className="text-xs text-brown-light">
          {livro.tipo === 'impresso'
            ? `Impresso • ${livro.peso}g`
            : `Ebook • ${livro.tamanhoMB}MB • ${livro.formato}`}
        </div>

        {/* Stock */}
        <div className="text-xs text-brown-light">
          {livro.estoque > 0 ? (
            `${livro.estoque} unidades disponíveis`
          ) : (
            <span className="text-status-error font-bold">Indisponível</span>
          )}
        </div>

        {/* Price */}
        <div className="border-t border-beige-200 pt-3">
          <p className="text-2xl font-bold text-brown-base">
            R$ {precoFinal.toFixed(2)}
          </p>
        </div>

        {/* Add to cart */}
        <div className="flex gap-2 items-center">
          {!isOutOfStock && (
            <>
              <input
                type="number"
                min="1"
                max={livro.estoque}
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 px-2 py-1 border border-beige-200 rounded text-center"
              />
            </>
          )}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 btn-primary ${
              isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              addedRecently ? 'bg-status-success' : ''
            }`}
          >
            {addedRecently ? '✓ Adicionado' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
