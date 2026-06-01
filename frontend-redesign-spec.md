# Frontend Redesign - Landing Page Light Mode

**Data:** 2026-05-31  
**Projeto:** Livraria E-commerce (Frontend Redesign)  
**Status:** Design Completo

---

## 1. Visão Geral

Redesenho do frontend React para landing page profissional light mode. Transição de dark 3-colunas para light 2-sections (catálogo + carrinho drawer).

**Objetivo:** Landing page e-commerce livraria com header sticky, hero section, grid catálogo responsivo, carrinho drawer on-click, cadastro modal, alertas toast+inline.

**Paleta:** Branco #fff, Bege #f5f1ed, Marrom #6b4423, Marrom escuro #4a2c1a

---

## 2. Arquitetura

### 2.1 Estrutura Componentes

```
App (Context Provider)
├── Header (logo, search, cart icon)
├── HeroSection
├── CatalogGrid
│   └── ProductCard (repeat)
├── CartDrawer (oculto por padrão, click icon mostra)
├── ProductModal (cadastro, oculto por padrão)
├── Toast (notifications stack)
└── Footer
```

**State Management:**
- `EcommerceContext` (catálogo, carrinho, UI state)
- `showCart` boolean (drawer visibility)
- `showProductModal` boolean (modal visibility)
- `toasts` array (notifications)

### 2.2 Data Flow

```
User action (busca/add/checkout)
  ↓
EcommerceContext (validação, lógica)
  ↓
Sucesso: Toast "✓ Added" + close modal
Erro: Toast "✗ Error" + inline field highlight
```

---

## 3. Paleta & Styling

### 3.1 Cores

```javascript
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
}
```

### 3.2 Tipografia

- **Headings:** serif font (Merriweather, Georgia) — livraria elegante
- **Body:** sans-serif system (Segoe UI, -apple-system)
- **Tamanhos:** H1=48px, H2=36px, body=16px

### 3.3 Componentes

| Elemento | BG | Border | Text | Hover |
|----------|----|----|------|-------|
| Body | #fff | — | #4a2c1a | — |
| Header | #f5f1ed | bottom 1px #d9ccc0 | #4a2c1a | — |
| Card livro | #fff | 1px #d9ccc0 | #4a2c1a | shadow + scale 1.02 |
| Button primary | #6b4423 | — | #fff | #4a2c1a |
| Button secondary | #f5f1ed | 1px #6b4423 | #6b4423 | #ebe4dd |
| Input | #fff | 1px #d9ccc0 | #4a2c1a | border #6b4423 focus |
| Toast success | #2d6a4f | — | #fff | — |
| Toast error | #c1121f | — | #fff | — |
| Drawer | #fff | left 1px #d9ccc0 | #4a2c1a | — |
| Modal overlay | rgba(0,0,0,0.5) | — | — | — |

---

## 4. Componentes Detalhados

### 4.1 Header

```
┌─────────────────────────────────────────┐
│ 📚 Logo Livraria    🔍 Search...   🛒(5) │
└─────────────────────────────────────────┘
```

**Props:** `cartCount`, `onCartClick`, `onSearch`
**Elementos:**
- Logo (text ou svg, clickable → home)
- SearchBar (input + debounce busca)
- Cart icon + badge (numero items, click abre CartDrawer)
- Sticky top (z-index 100)

**Comportamento:**
- Search filtra catálogo (title/author/description match)
- Cart icon click → `setShowCart(true)` → CartDrawer overlay
- Badge mostra quantidade items (update em tempo real)

### 4.2 HeroSection

```
┌──────────────────────────────────┐
│                                  │
│  FUNDO MARROM #6b4423           │
│  "Descubra Novos Mundos"        │
│  "Explore nossa coleção"        │
│  [Botão: Explorar Catálogo]     │
│                                  │
└──────────────────────────────────┘
```

**Props:** none
**Elementos:**
- Background color marrom ou imagem biblioteca
- Heading serif "Descubra Novos Mundos"
- Subheading "Explore nossa coleção de livros selecionados"
- CTA button white text → scroll to catalog

**Responsivo:** 100% height mobile, 60vh desktop

### 4.3 CatalogGrid

Grid responsivo: desktop 4 col, tablet 2 col, mobile 1 col.

```
┌─────┬─────┬─────┬─────┐
│ 📖  │ 📖  │ 📖  │ 📖  │
│ Title           │ Title           │
│ Author          │ Author          │
│ R$ 100          │ R$ 100          │
│ [Add]           │ [Add]           │
└─────┴─────┴─────┴─────┘
```

**Props:** `products`, `onAddToCart`
**Elementos:**
- Loop catálogo items
- Render ProductCard cada um

**Comportamento:**
- Search filtra grid
- Loading skeleton enquanto carrega
- Infinite scroll ou pagination (optional)

### 4.4 ProductCard

```
┌────────────────────┐
│   📖 [Thumb]       │
├────────────────────┤
│ Clean Code         │
│ Robert Martin      │
│ R$ 100.80          │
│ 📦 5 un            │
│ [Adicionar Cart]   │
└────────────────────┘
```

**Props:** `livro`, `onAddClick`
**Elementos:**
- Thumb image (genérico livro icon se não houver)
- Título (truncate 2 lines)
- Autor (texto pequeno)
- Preço final polimórfico (destacado marrom bold)
- Estoque info (cinza pequeno)
- Botão "Adicionar ao Carrinho" (primary button)

**Comportamento:**
- Hover: shadow + scale 1.02 + cursor pointer
- Click botão: modal quantidade ou direto add (depende)
- Estoque 0: botão disabled vermelho "Indisponível"

### 4.5 CartDrawer

```
┌──────────────────────┐
│ CARRINHO         [X] │  ← Overlay direita, width 400px
├──────────────────────┤
│ Clean Code x2        │
│ R$ 200.80           │
│ [Remove]            │
│ ────────────────────│
│ Design Patterns x1   │
│ R$ 80               │
│ [Remove]            │
├──────────────────────┤
│ Cupom: [POO10__]    │
│ Total: R$ 280.80    │
│ [Finalizar Compra]  │
└──────────────────────┘
```

**Props:** `visible`, `onClose`, `cartItems`, `onRemove`, `onCheckout`
**Elementos:**
- Header "Carrinho" + close button (X)
- Scroll area: items (table ou list)
  - Livro nome + qtd + preço unit + subtotal
  - Botão remove (ícone trash ou X)
- Cupom input (opcional)
- Total calculado
- Botão "Finalizar Compra" (primary)

**Comportamento:**
- Click fora drawer (overlay) → close
- Click X → close
- Remove item → atualiza total
- Click Finalizar → valida cupom → sucesso toast + limpa cart + close drawer

**Styling:**
- Position fixed right 0
- Width 400px (mobile 100vw)
- Height 100vh
- Background #fff
- Overlay opacity 0.5 fundo

### 4.6 ProductModal

```
┌─────────────────────────────────────┐
│ Adicionar Novo Livro            [X] │
├─────────────────────────────────────┤
│ Tipo: [Impresso ▼]                  │
│ ID:   [___]                         │
│ Título: [___________________________│
│ Autor: [___________________________] │
│ Preço (R$): [___]                   │
│ Estoque: [___]                      │
│ Peso (g): [___]                     │
│ [Cancelar]  [Cadastrar]             │
└─────────────────────────────────────┘
```

**Props:** `visible`, `onClose`, `onSubmit`
**Elementos:**
- Header "Adicionar Novo Livro" + close (X)
- Form (3 sections):
  1. Tipo select (Impresso/Ebook)
  2. Campos obrigatórios (ID, título, autor, preço, estoque)
  3. Tipo-específicos (peso | tamanhoMB+formato)
- Buttons: Cancel (secondary), Cadastrar (primary)

**Comportamento:**
- Form fields com inline errors (validação onBlur)
- Submit → context.cadastrarLivro()
- Sucesso: toast "✓ Livro ID X cadastrado" + close modal + refresh grid
- Erro: toast "✗ [mensagem]" + highlight field + stay open

**Styling:**
- Position fixed center
- Width 500px (mobile 90vw)
- Background #fff
- Overlay backdrop
- Smooth fade-in/out

### 4.7 Toast Notifications

```
┌─────────────────────────┐
│ ✓ Livro adicionado!     │ ← Canto direito, auto-dismiss 3s
└─────────────────────────┘
```

**Props:** `toasts` (array), `onDismiss`
**Elementos:**
- Stack vertical, canto direito (ou customizável)
- Icon (✓ verde, ✗ vermelho, ⚠ amarelo)
- Mensagem (max 1 linha)
- Auto-dismiss 3s
- Click close manual

**Typing:**
```javascript
{
  id: uuid(),
  type: 'success' | 'error' | 'warning',
  message: string,
  duration: 3000
}
```

### 4.8 Footer

```
┌──────────────────────┐
│ © 2026 Livraria POO  │
│ [Links] [Sociais]    │
└──────────────────────┘
```

**Props:** none
**Elementos:**
- Copyright text
- Links (About, Contact, FAQ)
- Social icons (optional)

**Styling:** BG bege, text marrom escuro, sticky bottom

---

## 5. Fluxos Críticos

### 5.1 Adicionar ao Carrinho

```
User clica "Adicionar ao Carrinho" (ProductCard)
  ↓
Valida: estoque suficiente?
  ✗ Erro → Toast "✗ Estoque insuficiente"
  ✓ OK → context.adicionarAoCarrinho()
  ↓
Sucesso → Toast "✓ [Livro] adicionado"
         + Cart badge update (+1)
         + ProductCard button disable 1s
```

### 5.2 Finalizar Compra

```
User clica "Finalizar Compra" (CartDrawer)
  ↓
Valida (ordem importa):
  1. Carrinho vazio? → Toast "✗ Carrinho vazio"
  2. Cupom inválido? → Toast "✗ Cupom '[cupom]' inválido"
  ↓
Calcula total + desconto (POO10 = 10%)
  ↓
TRY: Efetua baixa estoque
  ✗ EstoqueInsuficiente → Toast "✗ Estoque insuficiente"
  ✓ OK → Atualiza catálogo, limpa carrinho
  ↓
Sucesso → Toast "✓ COMPRA FINALIZADA | Total: R$ X"
         + Close CartDrawer
         + Refresh grid (estoque novo)
```

### 5.3 Cadastro Livro

```
User clica botão cadastro (header ou link)
  ↓
Modal abre vazio
  ↓
User preench form + clica "Cadastrar"
  ↓
Validações (inline):
  ✗ ID duplicado → highlight ID field + toast
  ✗ Preço <= 0 → highlight Preço field + toast
  ✗ Estoque < 0 → highlight Estoque field + toast
  ✓ OK → context.cadastrarLivro()
  ↓
Sucesso → Toast "✓ Livro ID X cadastrado"
         + Modal close
         + Grid atualiza (novo card aparece)
```

---

## 6. Responsividade

### 6.1 Breakpoints

- **Mobile:** < 640px (1 col grid, full-width drawer, modal 90vw)
- **Tablet:** 640-1024px (2 col grid, drawer 350px)
- **Desktop:** > 1024px (4 col grid, drawer 400px)

### 6.2 Mobile-First

- Drawer full-width mobile
- Header search pode se ocultar em hamburger (optional)
- Hero section height reduzido
- Cards stack vertical

---

## 7. Estrutura Pastas (Updated)

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CatalogGrid.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── ProductModal.jsx
│   │   ├── Toast.jsx
│   │   ├── SearchBar.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   └── EcommerceContext.jsx (updated)
│   ├── hooks/
│   │   └── useEcommerce.js (unchanged)
│   ├── models/ (unchanged)
│   ├── exceptions/ (unchanged)
│   ├── utils/ (unchanged)
│   ├── App.jsx (updated)
│   ├── index.css (updated paleta light)
│   └── main.jsx (unchanged)
├── tailwind.config.js (updated cores)
├── package.json (unchanged)
└── vite.config.js (unchanged)
```

---

## 8. Dependências (Unchanged)

React 18, Vite 5, Tailwind 3 (cores customizadas).

---

## 9. Success Criteria

✅ **Visual:**
- Light mode branco/bege/marrom aplicado
- Header sticky com search + cart icon
- Hero section CTA funcional
- Grid 4-col responsivo
- Cards with hover efeito
- Drawer desliza direita on-click
- Modal overlay centered
- Toast stack canto direito

✅ **Funcionalidade:**
- Search filtra catálogo (título, autor)
- Add to cart (com validação estoque)
- Cart drawer (mostrar/ocultar, remove, totaliza)
- Finalizar compra (cupom POO10, desconto, baixa estoque)
- Cadastro livro (modal, validações inline)
- Todas exceções → toast (não console)

✅ **Responsividade:**
- Mobile: 1 col grid, drawer full-width
- Tablet: 2 col grid, drawer 350px
- Desktop: 4 col grid, drawer 400px

✅ **Persistência:**
- localStorage catálogo + carrinho (unchanged)

---

## 10. Próximas Etapas

Implementar com writing-plans skill → execute-plans inline.

---

**Fim do spec redesign.**
