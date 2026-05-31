# Frontend React - Ecommerce Livraria Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build React frontend (Vite + Tailwind) espelhando arquitetura C++ do e-commerce com 3 colunas, dark mode obsidian, validações/exceções 100% fiéis, state local + localStorage.

**Architecture:** Context API gerencia estado global (catálogo, carrinho, exceções) — espelha `class Ecommerce` C++. Componentes modulares (FormCadastro, Vitrine, Carrinho, ConsoleExcecoes) consomem hook `useEcommerce()`. Modelos (Livro, LivroImpresso, Ebook) implementam polimorfismo. Persistência via localStorage.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, vanilla JavaScript (sem deps extras).

---

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── FormCadastro.jsx      (formulários: cadastro livro + carrinho + cupom)
│   │   ├── Vitrine.jsx           (grid catálogo com cards polimórficos)
│   │   ├── Carrinho.jsx          (tabela items + totalização + finalizar compra)
│   │   ├── ConsoleExcecoes.jsx   (log exceções/sucessos, monospace)
│   │   └── EcommerceDashboard.jsx (layout 3 colunas, header)
│   ├── context/
│   │   └── EcommerceContext.jsx  (Context global + Provider)
│   ├── hooks/
│   │   └── useEcommerce.js       (useContext wrapper + action dispatchers)
│   ├── models/
│   │   ├── Livro.js             (classe base)
│   │   ├── LivroImpresso.js      (subclasse, peso)
│   │   └── Ebook.js             (subclasse, tamanhoMB + formato)
│   ├── exceptions/
│   │   └── Excecoes.js          (5 exception classes)
│   ├── utils/
│   │   └── uuid.js              (gerador UUID simples)
│   ├── App.jsx                   (main component, Provider wrapper)
│   ├── index.css                 (Tailwind directives + custom vars)
│   ├── main.jsx                  (React.render)
├── public/
├── tailwind.config.js
├── vite.config.js
├── package.json
├── .gitignore
└── index.html
```

---

## Task 1: Setup Vite + Dependências

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/.gitignore`
- Create: `frontend/vite.config.js`
- Create: `frontend/index.html`
- Create: `frontend/public/.gitkeep`

- [ ] **Step 1: Criar estrutura base**

```bash
cd /home/luiz/Documentos/Faculdade/OrientacaoObjetos/Avaliacao
mkdir -p frontend/public frontend/src
cd frontend
```

- [ ] **Step 2: Criar package.json**

```json
{
  "name": "livraria-ecommerce",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

- [ ] **Step 3: Criar vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

- [ ] **Step 4: Criar index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Livraria E-commerce POO</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Criar .gitignore**

```
node_modules/
dist/
.DS_Store
*.local
.env
.env.local
```

- [ ] **Step 6: Instalar dependências**

```bash
npm install
```

Expected: "added X packages"

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: setup Vite + React + Tailwind project scaffold"
```

---

## Task 2: Configurar Tailwind + Dark Mode Theme

**Files:**
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Create: `frontend/src/index.css`

- [ ] **Step 1: Criar tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#0f0f0f',
          900: '#1a1a1a',
          800: '#333333',
          700: '#e0e0e0',
          600: '#999999',
        },
        accent: {
          success: '#2d5016',
          error: '#8B3A3A',
          warning: '#5c4033',
        }
      },
      fontSize: {
        xs: ['12px', '1.5'],
        sm: ['14px', '1.5'],
        base: ['14px', '1.5'],
        lg: ['16px', '1.5'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
      }
    }
  },
  plugins: []
}
```

- [ ] **Step 2: Criar postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Criar src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-obsidian-950: #0f0f0f;
  --color-obsidian-900: #1a1a1a;
  --color-obsidian-800: #333333;
  --color-obsidian-700: #e0e0e0;
  --color-obsidian-600: #999999;
  --color-success: #2d5016;
  --color-error: #8B3A3A;
  --color-warning: #5c4033;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-obsidian-950);
  color: var(--color-obsidian-700);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

button {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 2px;
  padding: 8px 12px;
  transition: background-color 0.2s;
}

input, select, textarea {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  background-color: var(--color-obsidian-900);
  color: var(--color-obsidian-700);
  border: 1px solid var(--color-obsidian-800);
  border-radius: 2px;
  padding: 8px 12px;
  transition: border-color 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-success);
}

.monospace {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.btn-success {
  background-color: var(--color-success);
  color: white;
}

.btn-success:hover {
  background-color: #1e3810;
}

.btn-error {
  background-color: var(--color-error);
  color: white;
}

.btn-error:hover {
  background-color: #6B2A2A;
}

.card {
  background-color: var(--color-obsidian-900);
  border: 0.5px solid var(--color-obsidian-800);
  border-radius: 2px;
  padding: 16px;
}

.card:hover {
  background-color: #252525;
}
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js postcss.config.js src/index.css
git commit -m "chore: setup Tailwind + dark mode theme (obsidian palette)"
```

---

## Task 3: Implementar Classes de Modelo (Livro, LivroImpresso, Ebook)

**Files:**
- Create: `frontend/src/models/Livro.js`
- Create: `frontend/src/models/LivroImpresso.js`
- Create: `frontend/src/models/Ebook.js`

- [ ] **Step 1: Criar Livro.js (classe base)**

```javascript
export class Livro {
  constructor(id, titulo, autor, preco, estoque, tipo) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.preco = preco;
    this.estoque = estoque;
    this.tipo = tipo;
  }

  calcularPrecoFinal() {
    // Override em subclasses
    return this.preco;
  }

  removerEstoque(quantidade) {
    if (quantidade > this.estoque) {
      throw new Error(`Estoque insuficiente: ${quantidade} > ${this.estoque}`);
    }
    this.estoque -= quantidade;
  }

  getDescricaoTipo() {
    return this.tipo;
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      autor: this.autor,
      preco: this.preco,
      estoque: this.estoque,
      tipo: this.tipo
    };
  }

  static fromJSON(data) {
    if (data.tipo === 'impresso') {
      return LivroImpresso.fromJSON(data);
    } else if (data.tipo === 'ebook') {
      return Ebook.fromJSON(data);
    }
    return null;
  }
}
```

- [ ] **Step 2: Criar LivroImpresso.js**

```javascript
import { Livro } from './Livro.js';

export class LivroImpresso extends Livro {
  constructor(id, titulo, autor, preco, estoque, peso) {
    super(id, titulo, autor, preco, estoque, 'impresso');
    this.peso = peso; // gramas
  }

  calcularPrecoFinal() {
    // Preço + taxa por peso (0.001 por grama)
    return this.preco + (this.peso * 0.001);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      peso: this.peso
    };
  }

  static fromJSON(data) {
    const livro = new LivroImpresso(
      data.id,
      data.titulo,
      data.autor,
      data.preco,
      data.estoque,
      data.peso
    );
    return livro;
  }
}
```

- [ ] **Step 3: Criar Ebook.js**

```javascript
import { Livro } from './Livro.js';

export class Ebook extends Livro {
  constructor(id, titulo, autor, preco, estoque, tamanhoMB, formato) {
    super(id, titulo, autor, preco, estoque, 'ebook');
    this.tamanhoMB = tamanhoMB;
    this.formato = formato; // PDF, EPUB, MOBI
  }

  calcularPrecoFinal() {
    // Preço - desconto por tamanho (0.10 por MB)
    return Math.max(0, this.preco - (this.tamanhoMB * 0.10));
  }

  toJSON() {
    return {
      ...super.toJSON(),
      tamanhoMB: this.tamanhoMB,
      formato: this.formato
    };
  }

  static fromJSON(data) {
    const livro = new Ebook(
      data.id,
      data.titulo,
      data.autor,
      data.preco,
      data.estoque,
      data.tamanhoMB,
      data.formato
    );
    return livro;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/models/
git commit -m "feat: implement Livro, LivroImpresso, Ebook classes with polymorphic pricing"
```

---

## Task 4: Implementar Classes de Exceção

**Files:**
- Create: `frontend/src/exceptions/Excecoes.js`

- [ ] **Step 1: Criar Excecoes.js**

```javascript
export class DadosInvalidosException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'DadosInvalidosException';
  }
}

export class EstoqueInsuficienteException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'EstoqueInsuficienteException';
  }
}

export class CupomInvalidoException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'CupomInvalidoException';
  }
}

export class CarrinhoInvalidoException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'CarrinhoInvalidoException';
  }
}

export class SucessoException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'Sucesso';
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/exceptions/Excecoes.js
git commit -m "feat: implement exception classes (DadosInvalidos, EstoqueInsuficiente, CupomInvalido, CarrinhoInvalido, Sucesso)"
```

---

## Task 5: Implementar Utilitário UUID

**Files:**
- Create: `frontend/src/utils/uuid.js`

- [ ] **Step 1: Criar uuid.js**

```javascript
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/uuid.js
git commit -m "chore: add UUID generator utility"
```

---

## Task 6: Implementar EcommerceContext

**Files:**
- Create: `frontend/src/context/EcommerceContext.jsx`

- [ ] **Step 1: Criar EcommerceContext.jsx**

```javascript
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

  // Load from storage on mount
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

  // Save on change
  useEffect(() => {
    if (catalogo.length > 0 || carrinho.length > 0) {
      salvarStorage(catalogo, carrinho);
    }
  }, [catalogo, carrinho]);

  const adicionarExcecao = (tipo, mensagem) => {
    const excecao = {
      id: generateUUID(),
      tipo,
      mensagem,
      timestamp: new Date().toLocaleTimeString('pt-BR')
    };
    setExcecoes(prev => [...prev, excecao]);
  };

  const cadastrarLivro = (livro) => {
    try {
      // Validação 1: dados vazios
      if (!livro.titulo || !livro.autor) {
        throw new DadosInvalidosException('Título e autor são obrigatórios');
      }

      // Validação 2: preço inválido
      if (livro.preco <= 0) {
        throw new DadosInvalidosException('Preço deve ser > 0');
      }

      // Validação 3: estoque inválido
      if (livro.estoque < 0) {
        throw new DadosInvalidosException('Estoque não pode ser negativo');
      }

      // Validação 4: ID duplicado
      if (catalogo.some(l => l.id === livro.id)) {
        throw new DadosInvalidosException(`Livro com ID ${livro.id} já existe`);
      }

      setCatalogo(prev => [...prev, livro]);
      adicionarExcecao('Sucesso', `Livro ID ${livro.id} cadastrado (${livro.titulo})`);
    } catch (e) {
      if (e instanceof DadosInvalidosException) {
        adicionarExcecao(e.name, e.message);
      } else {
        adicionarExcecao('Erro', e.message);
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

      // Verifica se livro já está no carrinho
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

      adicionarExcecao('Sucesso', `${livro.titulo} x${quantidade} adicionado ao carrinho`);
    } catch (e) {
      if (e instanceof DadosInvalidosException || e instanceof EstoqueInsuficienteException) {
        adicionarExcecao(e.name, e.message);
      } else {
        adicionarExcecao('Erro', e.message);
      }
      throw e;
    }
  };

  const removerDoCarrinho = (livroId) => {
    setCarrinho(prev => prev.filter(i => i.livroId !== livroId));
  };

  const finalizarCompra = (cupom) => {
    try {
      // Validação 1: carrinho vazio (ANTES de tocar estoque)
      if (carrinho.length === 0) {
        throw new CarrinhoInvalidoException('Carrinho vazio. Nenhuma compra a finalizar.');
      }

      // Validação 2: cupom inválido (ANTES de tocar estoque)
      if (cupom !== '' && cupom !== 'POO10') {
        throw new CupomInvalidoException(
          `Cupom '${cupom}' inválido. Cupons disponíveis: POO10`
        );
      }

      // Calcula total
      let total = 0;
      for (const item of carrinho) {
        const preco = item.livro.calcularPrecoFinal();
        total += preco * item.quantidade;
      }

      // Aplica desconto
      let desconto = 0;
      if (cupom === 'POO10') {
        desconto = total * 0.10;
        total -= desconto;
      }

      // PONTO CRÍTICO: Efetua baixa do estoque (ROLLBACK se falhar)
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

        // Tudo passou, confirma mudanças
        setCatalogo(novosCatalogo);
        setCarrinho([]);

        const msg = `COMPRA FINALIZADA | Total: R$ ${(total + desconto).toFixed(2)} | Desconto: R$ ${desconto.toFixed(2)} | A Pagar: R$ ${total.toFixed(2)}`;
        adicionarExcecao('Sucesso', msg);
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
        adicionarExcecao(e.name, e.message);
      } else {
        adicionarExcecao('Erro', e.message);
      }
      throw e;
    }
  };

  const limparExcecoes = () => {
    setExcecoes([]);
  };

  const value = {
    catalogo,
    carrinho,
    excecoes,
    cadastrarLivro,
    buscarLivroPorId,
    adicionarAoCarrinho,
    removerDoCarrinho,
    finalizarCompra,
    limparExcecoes,
    adicionarExcecao
  };

  return (
    <EcommerceContext.Provider value={value}>
      {children}
    </EcommerceContext.Provider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/context/EcommerceContext.jsx
git commit -m "feat: implement EcommerceContext with complete business logic (mirrors C++ Ecommerce class)"
```

---

## Task 7: Implementar useEcommerce Hook

**Files:**
- Create: `frontend/src/hooks/useEcommerce.js`

- [ ] **Step 1: Criar useEcommerce.js**

```javascript
import { useContext } from 'react';
import { EcommerceContext } from '../context/EcommerceContext.jsx';

export function useEcommerce() {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce deve ser usado dentro de EcommerceProvider');
  }
  return context;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useEcommerce.js
git commit -m "chore: implement useEcommerce custom hook"
```

---

## Task 8: Implementar FormCadastro Component

**Files:**
- Create: `frontend/src/components/FormCadastro.jsx`

- [ ] **Step 1: Criar FormCadastro.jsx**

```javascript
import React, { useState } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';
import { LivroImpresso } from '../models/LivroImpresso.js';
import { Ebook } from '../models/Ebook.js';

export function FormCadastro() {
  const { cadastrarLivro, adicionarAoCarrinho } = useEcommerce();

  // Estado Cadastro
  const [tipo, setTipo] = useState('impresso');
  const [id, setId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [peso, setPeso] = useState('');
  const [tamanhoMB, setTamanhoMB] = useState('');
  const [formato, setFormato] = useState('PDF');

  // Estado Carrinho
  const [idCarrinho, setIdCarrinho] = useState('');
  const [qtdCarrinho, setQtdCarrinho] = useState('');

  // Estado Cupom
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
      // Reset form
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

      {/* Seção 1: Cadastro de Livro */}
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

      {/* Seção 2: Adicionar ao Carrinho */}
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

      {/* Seção 3: Cupom */}
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
```

**Note:** `cupom` estado está em FormCadastro, será passado para Carrinho via props ou context em próximas tarefas.

- [ ] **Step 2: Commit**

```bash
git add src/components/FormCadastro.jsx
git commit -m "feat: implement FormCadastro component with 3 sections (register, add to cart, coupon)"
```

---

## Task 9: Implementar Vitrine Component

**Files:**
- Create: `frontend/src/components/Vitrine.jsx`

- [ ] **Step 1: Criar Vitrine.jsx**

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Vitrine.jsx
git commit -m "feat: implement Vitrine component with polymorphic pricing display"
```

---

## Task 10: Implementar Carrinho Component

**Files:**
- Create: `frontend/src/components/Carrinho.jsx`

- [ ] **Step 1: Criar Carrinho.jsx**

```javascript
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

      {/* Totalização */}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Carrinho.jsx
git commit -m "feat: implement Carrinho component with totalization and coupon logic"
```

---

## Task 11: Implementar ConsoleExcecoes Component

**Files:**
- Create: `frontend/src/components/ConsoleExcecoes.jsx`

- [ ] **Step 1: Criar ConsoleExcecoes.jsx**

```javascript
import React, { useEffect, useRef } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function ConsoleExcecoes() {
  const { excecoes, limparExcecoes } = useEcommerce();
  const endRef = useRef(null);

  // Auto-scroll ao fim quando nova exceção chega
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ConsoleExcecoes.jsx
git commit -m "feat: implement ConsoleExcecoes component with real-time log display"
```

---

## Task 12: Implementar EcommerceDashboard Component

**Files:**
- Create: `frontend/src/components/EcommerceDashboard.jsx`

- [ ] **Step 1: Criar EcommerceDashboard.jsx**

```javascript
import React from 'react';
import { FormCadastro } from './FormCadastro.jsx';
import { Vitrine } from './Vitrine.jsx';
import { Carrinho } from './Carrinho.jsx';
import { ConsoleExcecoes } from './ConsoleExcecoes.jsx';

export function EcommerceDashboard() {
  return (
    <div className="flex flex-col gap-6 h-screen overflow-hidden p-6 bg-obsidian-950">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-obsidian-700">
          Livraria E-commerce POO
        </h1>
        <p className="text-xs text-obsidian-600 mt-1">
          Sistema de vendas com validações arquitetura C++
        </p>
      </div>

      {/* Layout 3 colunas */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Formulários */}
        <div className="overflow-y-auto">
          <FormCadastro />
        </div>

        {/* Coluna 2: Vitrine + Carrinho */}
        <div className="overflow-y-auto lg:col-span-1">
          <div className="flex flex-col gap-8">
            <Vitrine />
            <div className="border-t border-obsidian-800" />
            <Carrinho />
          </div>
        </div>

        {/* Coluna 3: Console */}
        <div className="overflow-hidden">
          <ConsoleExcecoes />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EcommerceDashboard.jsx
git commit -m "feat: implement EcommerceDashboard main layout (3 columns)"
```

---

## Task 13: Implementar App.jsx

**Files:**
- Create: `frontend/src/App.jsx`

- [ ] **Step 1: Criar App.jsx**

```javascript
import React from 'react';
import { EcommerceProvider } from './context/EcommerceContext.jsx';
import { EcommerceDashboard } from './components/EcommerceDashboard.jsx';
import './index.css';

export function App() {
  return (
    <EcommerceProvider>
      <EcommerceDashboard />
    </EcommerceProvider>
  );
}

export default App;
```

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: implement App.jsx with EcommerceProvider wrapper"
```

---

## Task 14: Implementar main.jsx

**Files:**
- Create: `frontend/src/main.jsx`

- [ ] **Step 1: Criar main.jsx**

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 2: Commit**

```bash
git add src/main.jsx
git commit -m "chore: implement main.jsx entry point"
```

---

## Task 15: Verificar e Testar Aplicação

**Files:**
- Run: `npm run dev`
- Manual testing de fluxos

- [ ] **Step 1: Iniciar dev server**

```bash
cd /home/luiz/Documentos/Faculdade/OrientacaoObjetos/Avaliacao/frontend
npm run dev
```

Expected output: "VITE v5.x.x ready in XXX ms" + "➜ Local: http://localhost:5173"

- [ ] **Step 2: Abrir no browser**

- Abra http://localhost:5173
- Deve aparecer "Livraria E-commerce POO" com 3 colunas
- Catálogo deve mostrar 3 livros iniciais
- Dark mode obsidian aplicado

- [ ] **Step 3: Testar Cadastro Livro (sucesso)**

- Preench Form (tipo: impresso, id: 4, título: "XYZ", autor: "ABC", preço: 150, estoque: 7, peso: 700)
- Click "Cadastrar Livro"
- ✓ Novo card aparece na Vitrine
- ✓ Console: "✓ Livro ID 4 cadastrado (XYZ)"

- [ ] **Step 4: Testar Validação ID Duplicado**

- Tenta cadastrar ID 1 (já existe)
- ✓ Console: "✗ DadosInvalidosException: Livro com ID 1 já existe"
- ✓ Vitrine não atualiza

- [ ] **Step 5: Testar Validação Preço Inválido**

- Preench Form com preço: -10
- Click "Cadastrar"
- ✓ Console: "✗ DadosInvalidosException: Preço deve ser > 0"

- [ ] **Step 6: Testar Adicionar ao Carrinho (sucesso)**

- Preench Form Carrinho: id: 1, quantidade: 2
- Click "Adicionar ao Carrinho"
- ✓ Item aparece no Carrinho (Clean Code, Qtd 2, Preço Final R$ 100.80)
- ✓ Console: "✓ Clean Code x2 adicionado ao carrinho"

- [ ] **Step 7: Testar Validação Estoque Insuficiente**

- Preench Form Carrinho: id: 1, quantidade: 99
- Click "Adicionar"
- ✓ Console: "✗ EstoqueInsuficienteException: Estoque insuficiente para Clean Code..."
- ✓ Carrinho não atualiza

- [ ] **Step 8: Testar Finalizar Compra com Cupom Válido**

- Carrinho tem items (Clean Code x2)
- Preench cupom: POO10
- Click "Finalizar Compra"
- ✓ Carrinho limpa
- ✓ Console: "✓ COMPRA FINALIZADA | Total: ... | Desconto: ... | A Pagar: ..."
- ✓ Vitrine: Clean Code agora mostra estoque 3 (5-2)

- [ ] **Step 9: Testar Validação Cupom Inválido**

- Adiciona novo item ao carrinho (Design Patterns)
- Preench cupom: INVALIDO
- Click "Finalizar"
- ✓ Console: "✗ CupomInvalidoException: Cupom 'INVALIDO' inválido..."
- ✓ Carrinho mantém item (ROLLBACK protegido)
- ✓ Estoque não alterado

- [ ] **Step 10: Testar Carrinho Vazio**

- Limpa carrinho (remove todos items)
- Preench cupom vazio
- Click "Finalizar"
- ✓ Console: "✗ CarrinhoInvalidoException: Carrinho vazio..."

- [ ] **Step 11: Testar localStorage**

- Refresh página (F5)
- ✓ Catálogo persiste com livros cadastrados
- ✓ Carrinho persiste se tiver items (antes de finalizar)

- [ ] **Step 12: Testar Responsividade**

- Redimensiona browser (mobile view)
- ✓ Layout vira 1 coluna (stack vertical)
- ✓ Sem scroll horizontal
- ✓ Dark mode mantém

---

## Task 16: Build & Finalização

**Files:**
- Run: `npm run build`
- Gerar relatório de sucesso

- [ ] **Step 1: Build produção**

```bash
cd /home/luiz/Documentos/Faculdade/OrientacaoObjetos/Avaliacao/frontend
npm run build
```

Expected: "dist/ 12 files, XXkb"

- [ ] **Step 2: Preview build**

```bash
npm run preview
```

Expected: "➜ Local: http://localhost:4173"

- [ ] **Step 3: Verificar build**

- Abra http://localhost:4173
- Todos fluxos testados em Task 15 devem funcionar
- Performance sem console warning

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "feat: complete React frontend with all validations and dark mode obsidian theme"
```

- [ ] **Step 5: Status final**

Gera log de completion:

```
✓ Vite + React + Tailwind setup
✓ Dark mode obsidian theme
✓ Modelos polimórficos (Livro, LivroImpresso, Ebook)
✓ 4 exception classes + Sucesso
✓ Context API com lógica espelha C++
✓ 5 componentes modulares
✓ 3 colunas layout responsive
✓ localStorage persistência
✓ Validações 100% = C++
✓ Testes de integração passando
✓ Build produção pronto

Frontend completo e funcional. Pronto para integração.
```

---

## Success Criteria (All Tested)

✅ **Funcionalidade:**
- Catálogo inicial com 3 livros
- Cadastro novo livro com validações (id, tipo, preço, estoque, peso/tamanho)
- Adicionar carrinho com validação estoque
- Finalizar compra com desconto POO10 (10%)
- Todas 4 exceções disparam corretamente
- localStorage persiste estado

✅ **Visual:**
- Dark mode obsidian (cinza + verde esmeralda + vermelho carmim)
- 3 colunas (Controle | Vitrine+Carrinho | Console)
- Responsive (mobile: 1 coluna)
- Sem scroll horizontal

✅ **Arquitetura:**
- Context API espelha class Ecommerce (C++)
- Validações idênticas C++ (ordem importa em finalizarCompra)
- Polimorfismo calcularPrecoFinal() funcionando
- Rollback seguro (estoque não alterado se erro)

---

## Próximas Etapas

- Deploy frontend em servidor (opcional)
- Integração futura com backend C++ (API REST)
- Testes E2E com Cypress (opcional)

**Fim do plano de implementação.**
