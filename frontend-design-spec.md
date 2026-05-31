# Frontend React - Ecommerce Livraria (Design Spec)

**Data:** 2026-05-31  
**Projeto:** Avaliacao - Livraria E-commerce  
**Status:** Design Completo

---

## 1. Visão Geral

Frontend React (Vite + Tailwind CSS) espelhando arquitetura C++ do backend.

**Objetivo:** Dashboard unificado com 3 colunas (Cadastro | Vitrine+Carrinho | Console Exceções) em Dark Mode Obsidian, validações 100% fiéis ao C++, state local + localStorage.

---

## 2. Arquitetura

### 2.1 Fluxo de Estado (Context API)

```
EcommerceContext
├── state: {
│   ├── catalogo: Livro[]
│   ├── carrinho: ItemCarrinho[]
│   ├── excecoes: Exception[]
│   └── cupom: string
├── actions: {
│   ├── cadastrarLivro(livro)
│   ├── buscarLivroPorId(id)
│   ├── adicionarAoCarrinho(livroId, quantidade)
│   ├── removerDoCarrinho(livroId)
│   ├── finalizarCompra(cupom)
│   ├── limparCarrinho()
│   └── adicionarExcecao(tipo, mensagem)
│
└── Provider wraps App
    └── todos componentes acessam via useEcommerce()
```

**Espelhamento C++:**
- Context = `class Ecommerce`
- Actions = métodos públicos (cadastrarLivro, finalizarCompra, etc)
- State = atributos privados (catalogo, carrinho)
- Exceções = capturadas em try-catch JS, adicionadas a `excecoes[]`

### 2.2 Persistência

**localStorage:**
- Key: `ecommerce-state`
- Valor: JSON stringificado `{ catalogo, carrinho }`
- Load: ao montar EcommerceContext
- Save: após cada ação (cadastro, remover, finalizar)
- Fallback: catálogo inicial com 3 livros (Clean Code, Design Patterns, Introduction to Algorithms)

---

## 3. Modelo de Dados

### 3.1 Livro (Classe Base)

```javascript
class Livro {
  id: number
  titulo: string
  autor: string
  preco: number
  estoque: number
  tipo: "impresso" | "ebook"
  
  calcularPrecoFinal(): number // Polimórfico
  removerEstoque(quantidade): void
  getDescricaoTipo(): string
}
```

### 3.2 LivroImpresso (Subclasse)

```javascript
class LivroImpresso extends Livro {
  peso: number // gramas
  
  calcularPrecoFinal(): number {
    return this.preco + (this.peso * 0.001)
  }
}
```

### 3.3 Ebook (Subclasse)

```javascript
class Ebook extends Livro {
  tamanhoMB: number
  formato: "PDF" | "EPUB" | "MOBI"
  
  calcularPrecoFinal(): number {
    return this.preco - (this.tamanhoMB * 0.10)
  }
}
```

### 3.4 ItemCarrinho

```javascript
{
  livroId: number
  quantidade: number
  livro: Livro (objeto completo)
  getSubtotal(): number {
    return this.livro.calcularPrecoFinal() * this.quantidade
  }
}
```

### 3.5 Exceção

```javascript
{
  id: uuid()
  tipo: string // "EstoqueInsuficienteException", etc
  mensagem: string
  timestamp: number (Date.now())
}
```

---

## 4. Exceções (Espelho Total C++)

| Exceção | Trigger | Mensagem |
|---------|---------|----------|
| **DadosInvalidosException** | ID duplicado, campos vazios, preço <= 0, estoque < 0 | "Dados inválidos: [motivo]" |
| **EstoqueInsuficienteException** | Qtd cart > estoque, ou durante finalizar compra | "Estoque insuficiente para [livro]: disponível [X], solicitado [Y]" |
| **CupomInvalidoException** | cupom != "POO10" && cupom != "" | "Cupom '[cupom]' inválido. Cupons disponíveis: POO10" |
| **CarrinhoInvalidoException** | Carrinho vazio ao finalizar | "Carrinho vazio. Nenhuma compra a finalizar." |

**Comportamento:**
- ❌ Exceção → adicionada a `excecoes[]` → renderizada no Console (vermelho)
- ✅ Sucesso → mensagem positiva no Console (verde)
- Timestamp sempre incluído

---

## 5. Componentes

### 5.1 FormCadastro.jsx

**Props:** nenhum (usa hook useEcommerce)

**State local:**
```javascript
{
  id, titulo, autor, preco, estoque,
  tipo: "impresso" | "ebook",
  peso, // se impresso
  tamanhoMB, formato // se ebook
  cupom
}
```

**Funcionalidades:**
1. **Seção 1 - Cadastro Livro:**
   - Select tipo (Impresso/Ebook) → renderização condicional campos
   - Inputs: id, titulo, autor, preco, estoque, (peso | tamanhoMB+formato)
   - Botão "Cadastrar Livro" → valida → cadastrarLivro()
   - Se erro → adicionado ao console

2. **Seção 2 - Adicionar ao Carrinho:**
   - Input: idLivro
   - Input: quantidade
   - Botão "Adicionar ao Carrinho" → adicionarAoCarrinho()
   - Se erro → console

3. **Seção 3 - Cupom:**
   - Input: código cupom (default "")
   - Display: "POO10 = 10% desconto"

**Styling:** Inputs dark, bordas finas, labels acima, espaçamento vertical uniforme

### 5.2 Vitrine.jsx

**Props:** nenhum (usa hook)

**Funcionalidade:**
- Grid 3 colunas responsivo (1 col em mobile)
- Card por livro:
  ```
  ┌─────────────────────┐
  │ ID: 1               │
  │ Clean Code          │
  │ Robert Martin       │
  │ Tipo: Impresso      │
  │ Preço Final: R$ 100 │
  │ Estoque: 5 un       │
  └─────────────────────┘
  ```
- Atualiza em tempo real quando estoque decrementado (finalizar compra)

**Styling:** Card border fino, hover levemente mais claro, sem sombra

### 5.3 Carrinho.jsx

**Props:** nenhum (usa hook)

**Funcionalidade:**
- Tabela/Lista items:
  ```
  | Livro | Qtd | Preço Final | Subtotal | Remover |
  |-------|-----|------------|----------|---------|
  | ID 1  | 2   | R$ 100     | R$ 200   | ✕       |
  ```
- Rodapé:
  ```
  ════════════════════════
  Total: R$ 200
  Cupom: [POO10] (desconto 10%)
  TOTAL A PAGAR: R$ 180
  
  [Finalizar Compra]
  ════════════════════════
  ```
- Botão "Finalizar Compra" → finalizarCompra(cupom)
  - Valida cupom
  - Decrementa estoque
  - Limpa carrinho
  - Exibe "COMPRA FINALIZADA" no console (verde)
- Botão "Remover" por item → removerDoCarrinho(livroId)

**Styling:** Monospace para números, alinhamento direita para valores

### 5.4 ConsoleExcecoes.jsx

**Props:** nenhum (usa hook)

**Funcionalidade:**
- Painel com altura fixa (max-height: 400px, overflow-y auto)
- Lista exceções (timestamp + tipo + mensagem)
- Cores:
  - ❌ Exceção: vermelho carmim fosso (#8B3A3A)
  - ✅ Sucesso: verde esmeralda (#2d5016)
  - ⓘ Info: cinza (#666)
- Ordem: newest primeiro (scroll bottom)
- Botão "Limpar Log" → limpa `excecoes[]`
- Font: monospace

**Exemplo:**
```
[14:32:10] ❌ EstoqueInsuficienteException: Estoque insuficiente para Clean Code
[14:32:05] ✅ Sucesso: Livro ID 4 cadastrado (Design Patterns Avançados)
[14:31:50] ❌ CupomInvalidoException: Cupom 'INVALIDO' inválido
```

### 5.5 EcommerceDashboard.jsx

**Props:** nenhum (usa hook)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  EcommerceDashboard (3 colunas)                         │
├──────────────────┬──────────────────┬──────────────────┤
│  FormCadastro    │  Vitrine +       │  ConsoleExcecoes │
│  (menu)          │  Carrinho        │  (logs)          │
│                  │                  │                  │
│  • Cadastro      │  • Grid livros   │  • Exceções      │
│  • Add Carrinho  │  • Tabela cart   │  • Sucessos      │
│  • Cupom         │                  │                  │
└──────────────────┴──────────────────┴──────────────────┘
```

- Grid 3 colunas (gap 16px)
- Responsive: em mobile vira stack vertical (1 col)
- Header com título "Livraria E-commerce POO"

---

## 6. Fluxos Críticos

### 6.1 Cadastrar Livro

```
User inputs → FormCadastro → onClick "Cadastrar"
  ↓
Validação:
  ❌ ID duplicado? → DadosInvalidosException
  ❌ Preço <= 0? → DadosInvalidosException
  ❌ Estoque < 0? → DadosInvalidosException
  ✅ Válido? → prossegue

  ↓
useEcommerce.cadastrarLivro(livro)
  ↓
EcommerceContext.catalogo.push(livro)
localStorage.save()
Vitrine atualiza (novo card aparece)
Console: "✅ Livro ID X cadastrado"
```

### 6.2 Adicionar ao Carrinho

```
User inputs (idLivro, quantidade) → FormCadastro → onClick "Adicionar"
  ↓
Validação:
  ❌ Livro não existe? → DadosInvalidosException
  ❌ Quantidade > estoque? → EstoqueInsuficienteException
  ✅ Válido? → prossegue

  ↓
useEcommerce.adicionarAoCarrinho(livroId, quantidade)
  ↓
EcommerceContext.carrinho.push({ livroId, quantidade, livro })
localStorage.save()
Carrinho renderiza novo item
Console: "✅ [Livro] x[Quantidade] adicionado ao carrinho"
```

### 6.3 Finalizar Compra (Crítico - Espelha C++)

```
User clica "Finalizar Compra" (com cupom) → Carrinho
  ↓
Validações sequenciais (ordem importa!):
  1. ❌ Carrinho vazio? → CarrinhoInvalidoException (ANTES de tocar estoque)
  2. ❌ Cupom inválido (!=POO10 && !="")? → CupomInvalidoException (ANTES de tocar estoque)
  3. ✅ Tudo valid? → prossegue
  
  ↓
Calcula total = sum(item.subtotal)
Aplica desconto (cupom POO10 = 10%)
totalFinal = total - desconto

  ↓
TRY: Efetiva baixa estoque (PONTO CRÍTICO)
  for each item in carrinho:
    livro.removerEstoque(quantidade)
    ❌ EstoqueInsuficienteException? → throw + ROLLBACK (nada foi alterado)
    
CATCH EstoqueInsuficienteException:
  → console erro
  → nada alterado (segurança!)
  → user pode tentar novamente
  
SUCCESS:
  ✓ Estoque atualizado
  ✓ Vitrine renderiza com estoque novo
  ✓ Carrinho limpo
  ✓ localStorage atualizado
  ✓ Console: "✅ COMPRA FINALIZADA | Total: R$ X | Desconto: R$ Y | A Pagar: R$ Z"
```

---

## 7. Styling - Dark Mode Obsidian

### 7.1 Palette

```javascript
colors: {
  obsidian: {
    950: '#0f0f0f', // bg main
    900: '#1a1a1a', // bg secondary (cards, inputs)
    800: '#333333', // border, divider
    700: '#e0e0e0', // text primary
    600: '#999999', // text secondary
  },
  accent: {
    success: '#2d5016',   // verde esmeralda muted
    error: '#8B3A3A',     // vermelho carmim fosso
    warning: '#5c4033',   // marrom terra
  }
}
```

### 7.2 Componentes

| Elemento | BG | Border | Text | Hover |
|----------|----|---------|----|-------|
| Body | #0f0f0f | — | #e0e0e0 | — |
| Card | #1a1a1a | 0.5px #333 | #e0e0e0 | #252525 |
| Input | #1a1a1a | 1px #333 | #e0e0e0 | #1a1a1a |
| Input Focus | #1a1a1a | 1px #2d5016 | #e0e0e0 | — |
| Button Success | #2d5016 | none | white | #1e3810 |
| Button Error | #8B3A3A | none | white | #6B2A2A |
| Console | #0f0f0f | 0.5px #333 | #e0e0e0 | — |
| Exception | #8B3A3A bg | — | white | — |
| Success msg | #2d5016 bg | — | white | — |

### 7.3 Tipografia

- Font: system-ui, -apple-system, sans-serif
- Body: 14px, line-height 1.5
- Headings: 16px, font-weight 600
- Console: monospace (Monaco, Menlo, etc), 12px

### 7.4 Spacing

- Gap componentes: 16px
- Padding card: 16px
- Border radius: 2px (mínimo, quase reto)

---

## 8. Estrutura de Pastas

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── FormCadastro.jsx
│   │   ├── Vitrine.jsx
│   │   ├── Carrinho.jsx
│   │   ├── ConsoleExcecoes.jsx
│   │   └── EcommerceDashboard.jsx
│   ├── context/
│   │   └── EcommerceContext.jsx
│   ├── hooks/
│   │   └── useEcommerce.js
│   ├── models/
│   │   ├── Livro.js (classe base)
│   │   ├── LivroImpresso.js
│   │   └── Ebook.js
│   ├── exceptions/
│   │   └── Excecoes.js
│   ├── utils/
│   │   └── uuid.js (gerador ID exceções)
│   ├── App.jsx
│   ├── index.css (Tailwind + custom vars)
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
├── package.json
└── .gitignore
```

---

## 9. Dependências

```json
{
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

---

## 10. Checklist de Implementação

- [ ] Criar estrutura Vite
- [ ] Instalar dependências
- [ ] Implementar classes Livro, LivroImpresso, Ebook
- [ ] Implementar Excecoes.js (5 classes)
- [ ] Implementar EcommerceContext.jsx
- [ ] Implementar useEcommerce hook
- [ ] Implementar FormCadastro.jsx
- [ ] Implementar Vitrine.jsx
- [ ] Implementar Carrinho.jsx
- [ ] Implementar ConsoleExcecoes.jsx
- [ ] Implementar EcommerceDashboard.jsx
- [ ] Implementar App.jsx
- [ ] Config Tailwind + tema dark
- [ ] Config vite.config.js
- [ ] Testar fluxos (cadastro, carrinho, finalizar)
- [ ] Validar localStorage persistência
- [ ] Testar exceções (todas)

---

## 11. Success Criteria

✅ **Funcional:**
- 3 livros iniciais carregam (localStorage fallback)
- Cadastro novo livro funciona + valida
- Adicionar carrinho funciona + valida estoque
- Finalizar compra decrementada estoque + aplica cupom POO10
- Todas 4 exceções disparam corretamente

✅ **Visual:**
- Dark mode obsidian aplicado
- 3 colunas layout responsivo
- Console atualiza em tempo real
- Sem scroll horizontal (exceto console)

✅ **Fidelidade C++:**
- Validações idênticas C++
- Exceções espelhadas (nomes, mensagens)
- Cálculo preço final (polimorfismo)
- Tratamento exceção finalizar compra (rollback seguro)

---

**Próximas Etapas:** Escrever implementation plan com writing-plans skill.
