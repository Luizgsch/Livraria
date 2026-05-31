import React, { useState } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function Carrinho() {
  const { carrinho, removerDoCarrinho, finalizarCompra } = useEcommerce();
  const [cupomInput, setCupomInput] = useState('');

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      const preco = item.livro.calcularPrecoFinal();
      return total + preco * item.quantidade;
    }, 0);
  };

  const calcularDesconto = (total) => {
    if (cupomInput === 'POO10') {
      return total * 0.10;
    }
    return 0;
  };

  const handleFinalizar = (e) => {
    e.preventDefault();
    try {
      finalizarCompra(cupomInput);
      setCupomInput('');
    } catch (e) {
      // Exceção capturada no context
    }
  };

  const total = calcularTotal();
  const desconto = calcularDesconto(total);
  const totalFinal = total - desconto;

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-lg font-semibold text-obsidian-700">Carrinho</h2>

      <div className="flex-1 overflow-y-auto">
        {carrinho.length === 0 ? (
          <p className="text-obsidian-600 text-sm">Carrinho vazio</p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="text-xs text-obsidian-600 grid grid-cols-12 gap-2 pb-2 border-b border-obsidian-800">
              <div className="col-span-4">Livro</div>
              <div className="col-span-2 text-right">Qtd</div>
              <div className="col-span-3 text-right">Preço Un</div>
              <div className="col-span-2 text-right">Ação</div>
            </div>

            {carrinho.map((item) => {
              const precoUn = item.livro.calcularPrecoFinal();
              const subtotal = precoUn * item.quantidade;
              return (
                <div
                  key={item.livroId}
                  className="grid grid-cols-12 gap-2 p-2 bg-obsidian-900 rounded-sm border border-obsidian-800"
                >
                  <div className="col-span-4 text-sm text-obsidian-700">
                    <p className="font-semibold">{item.livro.titulo}</p>
                    <p className="text-xs text-obsidian-600">ID: {item.livroId}</p>
                  </div>
                  <div className="col-span-2 text-right text-sm text-obsidian-700">
                    {item.quantidade}
                  </div>
                  <div className="col-span-3 text-right text-sm text-accent-success monospace">
                    R$ {precoUn.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-right">
                    <button
                      onClick={() => removerDoCarrinho(item.livroId)}
                      className="text-accent-error hover:text-white text-sm font-semibold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="col-span-12 text-right text-xs text-obsidian-600">
                    Subtotal: R$ {subtotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleFinalizar} className="border-t border-obsidian-800 pt-4">
        <div className="flex flex-col gap-3 text-sm monospace">
          <div className="flex justify-between">
            <span className="text-obsidian-600">Total original:</span>
            <span className="text-obsidian-700">R$ {total.toFixed(2)}</span>
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-obsidian-600 text-xs">Cupom:</label>
            <input
              type="text"
              value={cupomInput}
              onChange={(e) => setCupomInput(e.target.value)}
              placeholder="POO10"
              className="flex-1 text-xs py-1 px-2"
            />
          </div>

          {desconto > 0 && (
            <div className="flex justify-between text-accent-success">
              <span>Desconto (10%):</span>
              <span>-R$ {desconto.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t border-obsidian-800 pt-2 flex justify-between font-semibold text-lg">
            <span className="text-obsidian-600">TOTAL A PAGAR:</span>
            <span className="text-accent-success">R$ {totalFinal.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className="btn-success font-semibold mt-2"
            disabled={carrinho.length === 0}
          >
            Finalizar Compra
          </button>
        </div>
      </form>
    </div>
  );
}
