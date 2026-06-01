# Frontend Redesign - Landing Page Light Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform dark 3-column dashboard into light-mode landing page with header, hero section, responsive catalog grid, drawer cart, modal product form, and toast alerts.

**Architecture:** EcommerceContext expands with UI state (showCart, showModalCadastro, toasts). App becomes two-section layout: header-hero-grid-footer + overlays (CartDrawer, ProductModal, Toast). Components follow single-responsibility (Header, HeroSection, ProductCard, CatalogGrid, CartDrawer, ProductModal, Toast, Footer). Tailwind config switches to light palette (branco, bege, marrom).

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3 (light palette), vanilla JS.

---

## File Structure

**Create (9 new components):**
- `src/components/Header.jsx` — Logo, search, cart icon
- `src/components/HeroSection.jsx` — Hero banner + CTA
- `src/components/SearchBar.jsx` — Search input with debounce
- `src/components/ProductCard.jsx` — Individual book card
- `src/components/CatalogGrid.jsx` — Grid of cards
- `src/components/CartDrawer.jsx` — Right-side cart overlay
- `src/components/ProductModal.jsx` — Add book modal
- `src/components/Toast.jsx` — Notification stack
- `src/components/Footer.jsx` — Footer

**Modify:**
- `src/context/EcommerceContext.jsx` — Add UI state (showCart, showModalCadastro, toasts, search query)
- `src/App.jsx` — New 2-section layout (header/hero/grid + overlays)
- `tailwind.config.js` — Light palette colors
- `src/index.css` — Base light-mode styles

**Remove:**
- `src/components/FormCadastro.jsx` — Replace with ProductModal
- `src/components/ConsoleExcecoes.jsx` — Replace with Toast
- `src/components/EcommerceDashboard.jsx` — Replace with App layout
- `src/components/Vitrine.jsx` — Replace with CatalogGrid + ProductCard

---

## Task 1: Update Tailwind Palette

**Files:**
- Modify: `frontend/tailwind.config.js`

- [ ] **Step 1: Open tailwind.config.js**

Read current file and note existing obsidian color definitions.

- [ ] **Step 2: Replace colors with light palette**

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
        white: '#ffffff',
        beige: {
          50: '#f5f1ed',
          100: '#ebe4dd',
          200: '#d9ccc0',
        },
        brown: {
          light: '#8b6f47',
          base: '#6b4423',
          dark: '#4a2c1a',
        },
        status: {
          success: '#2d6a4f',
          error: '#c1121f',
          warning: '#fca311',
        }
      },
      fontSize: {
        xs: ['12px', '1.5'],
        sm: ['14px', '1.5'],
        base: ['16px', '1.6'],
        lg: ['18px', '1.6'],
        xl: ['24px', '1.4'],
        '2xl': ['36px', '1.2'],
        '3xl': ['48px', '1.2'],
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        md: '6px',
      }
    }
  },
  plugins: []
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/tailwind.config.js
git commit -m "chore: update Tailwind palette to light mode (branco, bege, marrom)"
```

---

## Task 2: Update Base Styles

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Replace index.css with light-mode base**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-white: #ffffff;
  --color-beige-50: #f5f1ed;
  --color-beige-100: #ebe4dd;
  --color-beige-200: #d9ccc0;
  --color-brown-light: #8b6f47;
  --color-brown-base: #6b4423;
  --color-brown-dark: #4a2c1a;
  --color-success: #2d6a4f;
  --color-error: #c1121f;
  --color-warning: #fca311;
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
  background-color: var(--color-white);
  color: var(--color-brown-dark);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: Merriweather, Georgia, serif;
  color: var(--color-brown-dark);
  margin: 0;
}

h1 {
  font-size: 48px;
  line-height: 1.2;
}

h2 {
  font-size: 36px;
  line-height: 1.2;
}

h3 {
  font-size: 24px;
  line-height: 1.3;
}

button {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  transition: all 0.2s;
  font-weight: 600;
}

button.btn-primary {
  background-color: var(--color-brown-base);
  color: white;
}

button.btn-primary:hover {
  background-color: var(--color-brown-dark);
}

button.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button.btn-secondary {
  background-color: var(--color-beige-50);
  color: var(--color-brown-base);
  border: 1px solid var(--color-brown-base);
}

button.btn-secondary:hover {
  background-color: var(--color-beige-100);
}

input, select, textarea {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 16px;
  background-color: white;
  color: var(--color-brown-dark);
  border: 1px solid var(--color-beige-200);
  border-radius: 4px;
  padding: 10px 12px;
  transition: border-color 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-brown-base);
  box-shadow: 0 0 0 3px rgba(107, 68, 35, 0.1);
}

.card {
  background-color: white;
  border: 1px solid var(--color-beige-200);
  border-radius: 6px;
  padding: 16px;
  transition: all 0.3s;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

/* Toast styles */
.toast {
  position: fixed;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.toast.success {
  background-color: var(--color-success);
  color: white;
}

.toast.error {
  background-color: var(--color-error);
  color: white;
}

.toast.warning {
  background-color: var(--color-warning);
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Drawer styles */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  animation: fadeIn 0.2s;
}

.drawer {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  background-color: white;
  z-index: 50;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background-color: white;
  border-radius: 6px;
  padding: 32px;
  max-height: 90vh;
  overflow-y: auto;
  animation: fadeIn 0.3s;
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/index.css
git commit -m "chore: update base styles to light mode (branco, bege, marrom palette)"
```

---

## Task 3: Expand EcommerceContext with UI State

**Files:**
- Modify: `frontend/src/context/EcommerceContext.jsx`

- [ ] **Step 1: Add UI state to context**

Add after the existing state declarations (after `const [excecoes, setExcecoes]`):

```javascript
  const [showCart, setShowCart] = useState(false);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
```

- [ ] **Step 2: Replace adicionarExcecao with addToast**

Replace the entire `adicionarExcecao` function with:

```javascript
  const addToast = (type, message) => {
    const id = generateUUID();
    const toast = { id, type, message };
    setToasts(prev => [...prev, toast]);
    
    // Auto-dismiss after 3s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
```

- [ ] **Step 3: Update cadastrarLivro to use addToast**

Replace all `adicionarExcecao` calls with `addToast`:

```javascript
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
    setShowModalCadastro(false); // Close modal on success
  } catch (e) {
    if (e instanceof DadosInvalidosException) {
      addToast('error', e.message);
    } else {
      addToast('error', e.message);
    }
    throw e;
  }
};
```

- [ ] **Step 4: Update adicionarAoCarrinho**

```javascript
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
```

- [ ] **Step 5: Update finalizarCompra**

```javascript
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
```

- [ ] **Step 6: Update Provider value**

```javascript
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
};
```

- [ ] **Step 7: Commit**

```bash
git add frontend/src/context/EcommerceContext.jsx
git commit -m "feat: expand EcommerceContext with UI state (showCart, showModalCadastro, toasts, searchQuery)"
```

---

## Task 4: Create Header Component

**Files:**
- Create: `frontend/src/components/Header.jsx`

- [ ] **Step 1: Create Header.jsx**

```jsx
import React from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';
import { SearchBar } from './SearchBar.jsx';

export function Header() {
  const { carrinho, setShowCart, showCart } = useEcommerce();
  
  const cartCount = carrinho.length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-beige-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-xl font-bold text-brown-dark">Livraria POO</h1>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Cart Icon */}
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-md hover:bg-beige-50 transition-colors"
          title="Abrir carrinho"
        >
          <span className="text-2xl">🛒</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-status-error text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Header.jsx
git commit -m "feat: create Header component with logo, search bar, and cart icon"
```

---

## Task 5: Create SearchBar Component

**Files:**
- Create: `frontend/src/components/SearchBar.jsx`

- [ ] **Step 1: Create SearchBar.jsx**

```jsx
import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function SearchBar() {
  const { setSearchQuery } = useEcommerce();
  const [input, setInput] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    const timer = setTimeout(() => {
      setSearchQuery(input);
    }, 300);
    
    setDebounceTimer(timer);
    
    return () => clearTimeout(timer);
  }, [input, setSearchQuery]);

  return (
    <div className="flex-1 max-w-md">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Buscar livros, autores..."
        className="w-full px-4 py-2 border border-beige-200 rounded-md focus:outline-none focus:border-brown-base focus:ring-2 focus:ring-brown-base focus:ring-opacity-10"
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/SearchBar.jsx
git commit -m "chore: create SearchBar component with debounced search"
```

---

## Task 6: Create HeroSection Component

**Files:**
- Create: `frontend/src/components/HeroSection.jsx`

- [ ] **Step 1: Create HeroSection.jsx**

```jsx
import React from 'react';

export function HeroSection() {
  const handleExplore = () => {
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-brown-base text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
          Descubra Novos Mundos
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Explore nossa coleção curada de livros selecionados com cuidado
        </p>
        <button
          onClick={handleExplore}
          className="btn-primary bg-white text-brown-base hover:bg-beige-50"
        >
          Explorar Catálogo
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/HeroSection.jsx
git commit -m "feat: create HeroSection component with CTA button"
```

---

## Task 7: Create ProductCard Component

**Files:**
- Create: `frontend/src/components/ProductCard.jsx`

- [ ] **Step 1: Create ProductCard.jsx**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ProductCard.jsx
git commit -m "feat: create ProductCard component with add-to-cart and quantity selector"
```

---

## Task 8: Create CatalogGrid Component

**Files:**
- Create: `frontend/src/components/CatalogGrid.jsx`

- [ ] **Step 1: Create CatalogGrid.jsx**

```jsx
import React, { useMemo } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';
import { ProductCard } from './ProductCard.jsx';

export function CatalogGrid() {
  const { catalogo, searchQuery } = useEcommerce();

  const filteredCatalogo = useMemo(() => {
    if (!searchQuery) return catalogo;
    
    const query = searchQuery.toLowerCase();
    return catalogo.filter(livro =>
      livro.titulo.toLowerCase().includes(query) ||
      livro.autor.toLowerCase().includes(query)
    );
  }, [catalogo, searchQuery]);

  return (
    <section id="catalog" className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-brown-dark mb-8">Nosso Catálogo</h2>
        
        {filteredCatalogo.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brown-light text-lg">
              {searchQuery
                ? `Nenhum livro encontrado para "${searchQuery}"`
                : 'Catálogo vazio'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCatalogo.map(livro => (
              <ProductCard key={livro.id} livro={livro} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/CatalogGrid.jsx
git commit -m "feat: create CatalogGrid component with responsive grid and search filtering"
```

---

## Task 9: Create CartDrawer Component

**Files:**
- Create: `frontend/src/components/CartDrawer.jsx`

- [ ] **Step 1: Create CartDrawer.jsx**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/CartDrawer.jsx
git commit -m "feat: create CartDrawer component with overlay and checkout logic"
```

---

## Task 10: Create ProductModal Component

**Files:**
- Create: `frontend/src/components/ProductModal.jsx`

- [ ] **Step 1: Create ProductModal.jsx**

```jsx
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
      // Form reset happens in context on success
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
      {/* Overlay */}
      <div
        className="modal-overlay"
        onClick={() => setShowModalCadastro(false)}
      />

      {/* Modal */}
      <div className="modal w-full md:w-96">
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
          {/* Tipo */}
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

          {/* ID */}
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

          {/* Título */}
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

          {/* Autor */}
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

          {/* Preço */}
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

          {/* Estoque */}
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

          {/* Tipo-specific fields */}
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

          {/* Buttons */}
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
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ProductModal.jsx
git commit -m "feat: create ProductModal component for adding new books"
```

---

## Task 11: Create Toast Component

**Files:**
- Create: `frontend/src/components/Toast.jsx`

- [ ] **Step 1: Create Toast.jsx**

```jsx
import React from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function Toast() {
  const { toasts, removeToast } = useEcommerce();

  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast pointer-events-auto cursor-pointer ${
            toast.type === 'success' ? 'toast.success' :
            toast.type === 'error' ? 'toast.error' :
            'toast.warning'
          } flex items-center gap-2`}
          style={{
            backgroundColor:
              toast.type === 'success' ? '#2d6a4f' :
              toast.type === 'error' ? '#c1121f' :
              '#fca311',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '6px',
            animation: 'slideIn 0.3s ease-out',
          }}
          onClick={() => removeToast(toast.id)}
        >
          <span>
            {toast.type === 'success' ? '✓' :
             toast.type === 'error' ? '✗' :
             '⚠'}
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Toast.jsx
git commit -m "feat: create Toast component for notifications"
```

---

## Task 12: Create Footer Component

**Files:**
- Create: `frontend/src/components/Footer.jsx`

- [ ] **Step 1: Create Footer.jsx**

```jsx
import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-beige-50 border-t border-beige-200 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-brown-light text-sm">
          © {currentYear} Livraria POO. Todos os direitos reservados.
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="text-brown-base hover:text-brown-dark text-sm">
            Sobre
          </a>
          <a href="#" className="text-brown-base hover:text-brown-dark text-sm">
            Contato
          </a>
          <a href="#" className="text-brown-base hover:text-brown-dark text-sm">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Footer.jsx
git commit -m "chore: create Footer component"
```

---

## Task 13: Refactor App.jsx

**Files:**
- Modify: `frontend/src/App.jsx`
- Delete: `src/components/FormCadastro.jsx`, `src/components/ConsoleExcecoes.jsx`, `src/components/EcommerceDashboard.jsx`, `src/components/Vitrine.jsx`

- [ ] **Step 1: Rewrite App.jsx**

```jsx
import React from 'react';
import { EcommerceProvider } from './context/EcommerceContext.jsx';
import { Header } from './components/Header.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { CatalogGrid } from './components/CatalogGrid.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';
import { ProductModal } from './components/ProductModal.jsx';
import { Toast } from './components/Toast.jsx';
import { Footer } from './components/Footer.jsx';
import './index.css';

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CatalogGrid />
      </main>
      <CartDrawer />
      <ProductModal />
      <Toast />
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <EcommerceProvider>
      <AppContent />
    </EcommerceProvider>
  );
}

export default App;
```

- [ ] **Step 2: Remove old components**

```bash
rm frontend/src/components/FormCadastro.jsx \
   frontend/src/components/ConsoleExcecoes.jsx \
   frontend/src/components/EcommerceDashboard.jsx \
   frontend/src/components/Vitrine.jsx
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/App.jsx && \
git rm frontend/src/components/FormCadastro.jsx \
        frontend/src/components/ConsoleExcecoes.jsx \
        frontend/src/components/EcommerceDashboard.jsx \
        frontend/src/components/Vitrine.jsx && \
git commit -m "refactor: rewrite App.jsx for landing page layout, remove old components"
```

---

## Task 14: Test & Build

**Files:**
- Run: `npm run dev`, `npm run build`

- [ ] **Step 1: Start dev server**

```bash
cd frontend && npm run dev
```

Expected: "VITE v5.x.x ready in XXX ms" + "➜ Local: http://localhost:5173"

- [ ] **Step 2: Manual Testing (in browser)**

- ✓ Header visible, logo, search bar, cart icon (0 badge)
- ✓ Hero section with "Explorar Catálogo" button
- ✓ Grid 4-colunas com 3 livros iniciais
- ✓ Hover card: shadow + scale
- ✓ Search filtra (tipo "Clean", vê Clean Code)
- ✓ Add to cart: badge atualiza (+1), toast aparece
- ✓ Click cart icon: drawer abre direita
- ✓ Cart drawer mostra items, remove funciona
- ✓ Cupom "POO10" calcula desconto 10%
- ✓ "Finalizar Compra" limpa carrinho, estoque atualiza grid
- ✓ Click header logo/buttons: sem erros console
- ✓ Light mode colors aplicadas (branco, bege, marrom)

- [ ] **Step 3: Build produção**

```bash
npm run build
```

Expected: "dist/ X files, XXkb"

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "feat: complete frontend redesign - light landing page with drawer cart, modal form, toast alerts"
```

---

## Success Criteria

✅ **Visual:** Light mode (branco/bege/marrom), header sticky, hero section, responsive grid, cards hover effect, drawer + modal overlays

✅ **Funcionalidade:** Search filter, add to cart, cart drawer, remove items, cupom POO10 (10%), finalizar compra, cadastro modal, toast alerts

✅ **Responsividade:** Mobile (1 col, full-width drawer), tablet (2 col), desktop (4 col)

✅ **Build:** Vite production build sem erros

✅ **Git:** Commits clean, one feature per commit

---

**Fim do plano.**
