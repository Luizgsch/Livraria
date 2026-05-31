import React from 'react';
import { FormCadastro } from './FormCadastro.jsx';
import { Vitrine } from './Vitrine.jsx';
import { Carrinho } from './Carrinho.jsx';
import { ConsoleExcecoes } from './ConsoleExcecoes.jsx';

export function EcommerceDashboard() {
  return (
    <div className="flex flex-col gap-6 h-screen overflow-hidden p-6 bg-obsidian-950">
      <div>
        <h1 className="text-2xl font-bold text-obsidian-700">
          Livraria E-commerce POO
        </h1>
        <p className="text-xs text-obsidian-600 mt-1">
          Sistema de vendas com validações arquitetura C++
        </p>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="overflow-y-auto">
          <FormCadastro />
        </div>

        <div className="overflow-y-auto lg:col-span-1">
          <div className="flex flex-col gap-8">
            <Vitrine />
            <div className="border-t border-obsidian-800" />
            <Carrinho />
          </div>
        </div>

        <div className="overflow-hidden">
          <ConsoleExcecoes />
        </div>
      </div>
    </div>
  );
}
