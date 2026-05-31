import React, { useEffect, useRef } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function ConsoleExcecoes() {
  const { excecoes, limparExcecoes } = useEcommerce();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [excecoes]);

  const getExcecaoColor = (tipo) => {
    if (tipo === 'Sucesso') return 'text-accent-success';
    if (
      tipo === 'EstoqueInsuficienteException' ||
      tipo === 'CupomInvalidoException' ||
      tipo === 'CarrinhoInvalidoException' ||
      tipo === 'DadosInvalidosException'
    ) {
      return 'text-accent-error';
    }
    return 'text-obsidian-600';
  };

  const getExcecaoIcon = (tipo) => {
    if (tipo === 'Sucesso') return '✓';
    return '✗';
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-obsidian-700">Console</h2>
        <button
          onClick={limparExcecoes}
          className="text-xs text-obsidian-600 hover:text-obsidian-700 border border-obsidian-800 px-2 py-1 rounded-sm"
        >
          Limpar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-obsidian-950 border border-obsidian-800 rounded-sm p-3 monospace">
        {excecoes.length === 0 ? (
          <p className="text-obsidian-600 text-xs">Nenhuma atividade</p>
        ) : (
          <div className="space-y-1">
            {excecoes.map((exc, idx) => (
              <div key={exc.id} className={`text-xs ${getExcecaoColor(exc.tipo)}`}>
                <span className="text-obsidian-600">[{exc.timestamp}]</span>
                <span className="mx-2">{getExcecaoIcon(exc.tipo)}</span>
                <span className="font-semibold">{exc.tipo}:</span>
                <span className="ml-1">{exc.mensagem}</span>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>
    </div>
  );
}
