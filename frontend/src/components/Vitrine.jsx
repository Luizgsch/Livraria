import React from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function Vitrine() {
  const { catalogo } = useEcommerce();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-obsidian-700">Catálogo</h2>

      {catalogo.length === 0 ? (
        <p className="text-obsidian-600 text-sm">Catálogo vazio</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogo.map((livro) => {
            const precoFinal = livro.calcularPrecoFinal();
            return (
              <div key={livro.id} className="card">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-obsidian-600">ID: {livro.id}</p>
                      <p className="font-semibold text-obsidian-700">
                        {livro.titulo}
                      </p>
                      <p className="text-sm text-obsidian-600">{livro.autor}</p>
                    </div>
                  </div>

                  <div className="border-t border-obsidian-800 pt-2 mt-2">
                    <div className="flex justify-between text-xs text-obsidian-600 mb-1">
                      <span>Tipo:</span>
                      <span className="text-obsidian-700">
                        {livro.tipo === 'impresso'
                          ? `Impresso (${livro.peso}g)`
                          : `Ebook (${livro.tamanhoMB}MB, ${livro.formato})`}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-obsidian-600 mb-1">
                      <span>Preço Base:</span>
                      <span className="text-obsidian-700">
                        R$ {livro.preco.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between font-semibold mb-2">
                      <span className="text-obsidian-600">Preço Final:</span>
                      <span className="text-accent-success">
                        R$ {precoFinal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-obsidian-600">Estoque:</span>
                      <span
                        className={
                          livro.estoque > 0
                            ? 'text-obsidian-700'
                            : 'text-accent-error'
                        }
                      >
                        {livro.estoque} un
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
