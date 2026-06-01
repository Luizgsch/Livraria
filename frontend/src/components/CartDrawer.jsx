import React, { useState } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function CartDrawer() {
  const { showCart, setShowCart, carrinho, removerDoCarrinho, finalizarCompra } = useEcommerce();
  const [cupomInput, setCupomInput] = useState('');

  if (!showCart) return null;

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      const preco = item.livro.calcularPrecoFinal();
      return total + preco * item.quantidade;
    }, 0);
  };

  const total = calcularTotal();
  const desconto = cupomInput === 'POO10' ? total * 0.10 : 0;
  const totalFinal = total - desconto;

  const handleFinalizar = (e) => {
    e.preventDefault();
    try {
      finalizarCompra(cupomInput);
      setCupomInput('');
    } catch (e) {
      // Error handled in context
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="drawer-overlay"
        onClick={() => setShowCart(false)}
      />

      {/* Drawer */}
      <div className="drawer w-full md:w-96 border-l border-beige-200 flex flex-col">
        {/* Header */}
        <div className="border-b border-beige-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brown-dark">Carrinho</h2>
          <button
            onClick={() => setShowCart(false)}
            className="text-2xl hover:text-brown-light transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {carrinho.length === 0 ? (
            <p className="text-brown-light text-center py-8">Seu carrinho está vazio</p>
          ) : (
            <div className="space-y-4">
              {carrinho.map((item) => {
                const precoUn = item.livro.calcularPrecoFinal();
                const subtotal = precoUn * item.quantidade;

                return (
                  <div key={item.livroId} className="border border-beige-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-brown-dark">{item.livro.titulo}</h4>
                        <p className="text-sm text-brown-light">Qtd: {item.quantidade}</p>
                      </div>
                      <button
                        onClick={() => removerDoCarrinho(item.livroId)}
                        className="text-status-error hover:text-status-error text-lg"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-brown-light">
                        R$ {precoUn.toFixed(2)} × {item.quantidade}
                      </p>
                      <p className="font-bold text-brown-base">
                        R$ {subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {carrinho.length > 0 && (
          <form onSubmit={handleFinalizar} className="border-t border-beige-200 p-6 space-y-4">
            {/* Cupom */}
            <div>
              <label className="block text-sm text-brown-dark mb-2">Cupom (opcional)</label>
              <input
                type="text"
                value={cupomInput}
                onChange={(e) => setCupomInput(e.target.value)}
                placeholder="POO10"
                className="w-full px-3 py-2 border border-beige-200 rounded-md focus:outline-none focus:border-brown-base"
              />
              <p className="text-xs text-brown-light mt-1">Cupom válido: POO10 (10% desconto)</p>
            </div>

            {/* Totals */}
            <div className="border-t border-beige-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-brown-light">
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              {desconto > 0 && (
                <div className="flex justify-between text-sm text-status-success font-bold">
                  <span>Desconto:</span>
                  <span>-R$ {desconto.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-brown-base">
                <span>Total:</span>
                <span>R$ {totalFinal.toFixed(2)}</span>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full btn-primary bg-brown-base text-white hover:bg-brown-dark"
            >
              Finalizar Compra
            </button>
          </form>
        )}
      </div>
    </>
  );
}
