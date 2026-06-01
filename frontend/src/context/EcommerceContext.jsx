import React, { createContext, useState, useEffect } from 'react';
import { Livro } from '../models/Livro.js';
import { LivroImpresso } from '../models/LivroImpresso.js';
import { Ebook } from '../models/Ebook.js';
import {
  DadosInvalidosException,
  EstoqueInsuficienteException,
  CupomInvalidoException,
  CarrinhoInvalidoException,
  SucessoException
} from '../exceptions/Excecoes.js';
import { generateUUID } from '../utils/uuid.js';

export const EcommerceContext = createContext();

const STORAGE_KEY = 'ecommerce-state';

const CATALOGO_INICIAL = [
  new LivroImpresso(1, 'Clean Code', 'Robert Martin', 100, 5, 800),
  new LivroImpresso(2, 'Design Patterns', 'Gang of Four', 80, 3, 650),
  new Ebook(3, 'Introduction to Algorithms', 'CLRS', 120, 10, 15, 'PDF')
];

function salvarStorage(catalogo, carrinho) {
  const estado = {
    catalogo: catalogo.map(l => l.toJSON()),
    carrinho: carrinho
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

function carregarStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const { catalogo, carrinho } = JSON.parse(stored);
    return {
      catalogo: catalogo.map(Livro.fromJSON),
      carrinho: carrinho
    };
  } catch (e) {
    return null;
  }
}

export function EcommerceProvider({ children }) {
  const [catalogo, setCatalogo] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [excecoes, setExcecoes] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const stored = carregarStorage();
    if (stored) {
      setCatalogo(stored.catalogo);
      setCarrinho(stored.carrinho);
    } else {
      setCatalogo(CATALOGO_INICIAL);
      salvarStorage(CATALOGO_INICIAL, []);
    }
  }, []);

  useEffect(() => {
    if (catalogo.length > 0 || carrinho.length > 0) {
      salvarStorage(catalogo, carrinho);
    }
  }, [catalogo, carrinho]);

  const addToast = (type, message) => {
    const id = generateUUID();
    const toast = { id, type, message };
    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const cadastrarLivro = (livro) => {
    try {
      if (!livro.titulo || !livro.autor) {
        throw new DadosInvalidosException('Título e autor são obrigatórios');
      }

      if (livro.preco <= 0) {
        throw new DadosInvalidosException('Preço deve ser > 0');
      }

      if (livro.estoque < 0) {
        throw new DadosInvalidosException('Estoque não pode ser negativo');
      }

      if (catalogo.some(l => l.id === livro.id)) {
        throw new DadosInvalidosException(`Livro com ID ${livro.id} já existe`);
      }

      setCatalogo(prev => [...prev, livro]);
      addToast('success', `Livro ID ${livro.id} cadastrado (${livro.titulo})`);
      setShowModalCadastro(false);
    } catch (e) {
      if (e instanceof DadosInvalidosException) {
        addToast('error', e.message);
      } else {
        addToast('error', e.message);
      }
      throw e;
    }
  };

  const buscarLivroPorId = (id) => {
    return catalogo.find(l => l.id === id) || null;
  };

  const adicionarAoCarrinho = (livroId, quantidade) => {
    try {
      if (quantidade <= 0) {
        throw new DadosInvalidosException('Quantidade deve ser > 0');
      }

      const livro = buscarLivroPorId(livroId);
      if (!livro) {
        throw new DadosInvalidosException(`Livro ID ${livroId} não encontrado`);
      }

      if (quantidade > livro.estoque) {
        throw new EstoqueInsuficienteException(
          `Estoque insuficiente para ${livro.titulo}: disponível ${livro.estoque}, solicitado ${quantidade}`
        );
      }

      setCarrinho(prev => {
        const exists = prev.find(i => i.livroId === livroId);
        if (exists) {
          return prev.map(i =>
            i.livroId === livroId
              ? { ...i, quantidade: i.quantidade + quantidade }
              : i
          );
        } else {
          return [...prev, { livroId, quantidade, livro }];
        }
      });

      addToast('success', `${livro.titulo} adicionado ao carrinho`);
    } catch (e) {
      if (e instanceof DadosInvalidosException || e instanceof EstoqueInsuficienteException) {
        addToast('error', e.message);
      } else {
        addToast('error', e.message);
      }
      throw e;
    }
  };

  const removerDoCarrinho = (livroId) => {
    setCarrinho(prev => prev.filter(i => i.livroId !== livroId));
  };

  const finalizarCompra = (cupom) => {
    try {
      if (carrinho.length === 0) {
        throw new CarrinhoInvalidoException('Carrinho vazio. Nenhuma compra a finalizar.');
      }

      if (cupom !== '' && cupom !== 'POO10') {
        throw new CupomInvalidoException(
          `Cupom '${cupom}' inválido. Cupons disponíveis: POO10`
        );
      }

      let total = 0;
      for (const item of carrinho) {
        const preco = item.livro.calcularPrecoFinal();
        total += preco * item.quantidade;
      }

      let desconto = 0;
      if (cupom === 'POO10') {
        desconto = total * 0.10;
        total -= desconto;
      }

      try {
        const novosCatalogo = catalogo.map(l => {
          const item = carrinho.find(i => i.livroId === l.id);
          if (item) {
            const copia = Object.create(Object.getPrototypeOf(l));
            Object.assign(copia, l);
            copia.removerEstoque(item.quantidade);
            return copia;
          }
          return l;
        });

        setCatalogo(novosCatalogo);
        setCarrinho([]);
        setShowCart(false);

        const msg = `COMPRA FINALIZADA! Total: R$ ${(total + desconto).toFixed(2)} | Desconto: R$ ${desconto.toFixed(2)} | A Pagar: R$ ${total.toFixed(2)}`;
        addToast('success', msg);
      } catch (e) {
        if (e instanceof EstoqueInsuficienteException) {
          throw e;
        }
        throw new Error(e.message);
      }
    } catch (e) {
      if (e instanceof CarrinhoInvalidoException ||
          e instanceof CupomInvalidoException ||
          e instanceof EstoqueInsuficienteException) {
        addToast('error', e.message);
      } else {
        addToast('error', e.message);
      }
      throw e;
    }
  };

  const value = {
    catalogo,
    carrinho,
    toasts,
    showCart,
    showModalCadastro,
    searchQuery,
    cadastrarLivro,
    buscarLivroPorId,
    adicionarAoCarrinho,
    removerDoCarrinho,
    finalizarCompra,
    addToast,
    removeToast,
    setShowCart,
    setShowModalCadastro,
    setSearchQuery
  };

  return (
    <EcommerceContext.Provider value={value}>
      {children}
    </EcommerceContext.Provider>
  );
}
