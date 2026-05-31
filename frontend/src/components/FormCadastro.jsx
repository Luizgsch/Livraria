import React, { useState } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';
import { LivroImpresso } from '../models/LivroImpresso.js';
import { Ebook } from '../models/Ebook.js';

export function FormCadastro() {
  const { cadastrarLivro, adicionarAoCarrinho } = useEcommerce();

  const [tipo, setTipo] = useState('impresso');
  const [id, setId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [peso, setPeso] = useState('');
  const [tamanhoMB, setTamanhoMB] = useState('');
  const [formato, setFormato] = useState('PDF');

  const [idCarrinho, setIdCarrinho] = useState('');
  const [qtdCarrinho, setQtdCarrinho] = useState('');

  const [cupom, setCupom] = useState('');

  const handleCadastro = (e) => {
    e.preventDefault();
    try {
      let livro;
      if (tipo === 'impresso') {
        livro = new LivroImpresso(
          parseInt(id),
          titulo,
          autor,
          parseFloat(preco),
          parseInt(estoque),
          parseInt(peso)
        );
      } else {
        livro = new Ebook(
          parseInt(id),
          titulo,
          autor,
          parseFloat(preco),
          parseInt(estoque),
          parseFloat(tamanhoMB),
          formato
        );
      }
      cadastrarLivro(livro);
      setId('');
      setTitulo('');
      setAutor('');
      setPreco('');
      setEstoque('');
      setPeso('');
      setTamanhoMB('');
      setFormato('PDF');
    } catch (e) {
      // Exceção capturada no context
    }
  };

  const handleAdicionarCarrinho = (e) => {
    e.preventDefault();
    try {
      adicionarAoCarrinho(parseInt(idCarrinho), parseInt(qtdCarrinho));
      setIdCarrinho('');
      setQtdCarrinho('');
    } catch (e) {
      // Exceção capturada no context
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-obsidian-700">Controle</h2>

      <form onSubmit={handleCadastro} className="flex flex-col gap-4">
        <div className="border-b border-obsidian-800 pb-4">
          <h3 className="text-sm font-semibold text-obsidian-700 mb-3">
            Cadastrar Novo Livro
          </h3>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-obsidian-600 mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full"
              >
                <option value="impresso">Impresso</option>
                <option value="ebook">Ebook</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-obsidian-600 mb-1">ID</label>
              <input
                type="number"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Ex: 4"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-obsidian-600 mb-1">
                Título
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Código Limpo"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-obsidian-600 mb-1">Autor</label>
              <input
                type="text"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Ex: Robert Martin"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-obsidian-600 mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Ex: 100"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-obsidian-600 mb-1">Estoque</label>
              <input
                type="number"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
                placeholder="Ex: 5"
                required
              />
            </div>

            {tipo === 'impresso' && (
              <div>
                <label className="block text-xs text-obsidian-600 mb-1">
                  Peso (g)
                </label>
                <input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="Ex: 800"
                  required
                />
              </div>
            )}

            {tipo === 'ebook' && (
              <>
                <div>
                  <label className="block text-xs text-obsidian-600 mb-1">
                    Tamanho (MB)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={tamanhoMB}
                    onChange={(e) => setTamanhoMB(e.target.value)}
                    placeholder="Ex: 15"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-obsidian-600 mb-1">
                    Formato
                  </label>
                  <select
                    value={formato}
                    onChange={(e) => setFormato(e.target.value)}
                  >
                    <option value="PDF">PDF</option>
                    <option value="EPUB">EPUB</option>
                    <option value="MOBI">MOBI</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn-success font-semibold mt-2"
            >
              Cadastrar Livro
            </button>
          </div>
        </div>
      </form>

      <form onSubmit={handleAdicionarCarrinho} className="flex flex-col gap-4">
        <div className="border-b border-obsidian-800 pb-4">
          <h3 className="text-sm font-semibold text-obsidian-700 mb-3">
            Adicionar ao Carrinho
          </h3>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-obsidian-600 mb-1">
                ID Livro
              </label>
              <input
                type="number"
                value={idCarrinho}
                onChange={(e) => setIdCarrinho(e.target.value)}
                placeholder="Ex: 1"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-obsidian-600 mb-1">
                Quantidade
              </label>
              <input
                type="number"
                value={qtdCarrinho}
                onChange={(e) => setQtdCarrinho(e.target.value)}
                placeholder="Ex: 2"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-success font-semibold"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </form>

      <div className="border-b border-obsidian-800 pb-4">
        <h3 className="text-sm font-semibold text-obsidian-700 mb-3">
          Cupom
        </h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
            placeholder="Ex: POO10"
          />
          <p className="text-xs text-obsidian-600">
            Cupom válido: <strong>POO10</strong> (10% desconto)
          </p>
        </div>
      </div>
    </div>
  );
}
