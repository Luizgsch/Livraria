import React, { useState } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';
import { LivroImpresso } from '../models/LivroImpresso.js';
import { Ebook } from '../models/Ebook.js';

export function ProductModal() {
  const { showModalCadastro, setShowModalCadastro, cadastrarLivro } = useEcommerce();
  const [tipo, setTipo] = useState('impresso');
  const [id, setId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [peso, setPeso] = useState('');
  const [tamanhoMB, setTamanhoMB] = useState('');
  const [formato, setFormato] = useState('PDF');

  const handleSubmit = (e) => {
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
      // Error handled in context
    }
  };

  if (!showModalCadastro) return null;

  return (
    <>
      {/* Overlay Background */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setShowModalCadastro(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="modal w-full md:w-96 mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brown-dark">Adicionar Livro</h2>
          <button
            onClick={() => setShowModalCadastro(false)}
            className="text-2xl hover:text-brown-light"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-brown-dark mb-2">Tipo</label>
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
            <label className="block text-sm font-bold text-brown-dark mb-2">ID</label>
            <input
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Ex: 4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brown-dark mb-2">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Código Limpo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brown-dark mb-2">Autor</label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Ex: Robert Martin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brown-dark mb-2">Preço (R$)</label>
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
            <label className="block text-sm font-bold text-brown-dark mb-2">Estoque</label>
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
              <label className="block text-sm font-bold text-brown-dark mb-2">Peso (g)</label>
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
                <label className="block text-sm font-bold text-brown-dark mb-2">Tamanho (MB)</label>
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
                <label className="block text-sm font-bold text-brown-dark mb-2">Formato</label>
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModalCadastro(false)}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary bg-brown-base text-white hover:bg-brown-dark"
            >
              Cadastrar
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}
