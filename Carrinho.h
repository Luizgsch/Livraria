#ifndef CARRINHO_H
#define CARRINHO_H

#include <string>
#include "Livro.h"
#include "Excecoes.h"

// ============================================================================
// CONCEITO: AGREGAÇÃO E RELACIONAMENTO ENTRE OBJETOS
//
// ItemCarrinho AGREGA um Livro (tem um ponteiro para a classe base Livro)
// O carrinho não "é dono" do objeto Livro original (não deleta ele)
// Apenas referencia-o para calcular preço e validar estoque
// ============================================================================

// ============================================================================
// CLASSE: ItemCarrinho (Agregação)
// ============================================================================
// Representa um item individual no carrinho de compras
// Cada item contém um ponteiro para um Livro e a quantidade desejada
class ItemCarrinho {
private:
    // AGREGAÇÃO: Ponteiro para a classe base Livro
    // Este objeto não é responsável por deletar o Livro
    // Apenas referencia-o para leitura
    Livro* livro;
    int quantidade;

public:
    // Construtor que recebe ponteiro para Livro e quantidade
    // Validação: quantidade deve ser maior que zero
    ItemCarrinho(Livro* livro, int quantidade)
        : livro(livro), quantidade(0) {

        if (quantidade <= 0) {
            throw QuantidadeInvalidaException("Quantidade no carrinho deve ser maior que zero");
        }
        this->quantidade = quantidade;
    }

    // Destrutor: não deleta o Livro (apenas agregamos, não somos donos)
    ~ItemCarrinho() = default;

    // ===== GETTERS =====

    // Retorna ponteiro para o Livro (agregado)
    Livro* getLivro() const {
        return livro;
    }

    int getQuantidade() const {
        return quantidade;
    }

    // ===== SETTER PARA QUANTIDADE =====

    void setQuantidade(int novaQuantidade) {
        if (novaQuantidade <= 0) {
            throw QuantidadeInvalidaException("Quantidade no carrinho deve ser maior que zero");
        }
        this->quantidade = novaQuantidade;
    }

    // ===== CÁLCULO DO SUBTOTAL COM POLIMORFISMO =====
    // POLIMORFISMO EM RUNTIME:
    // Este método chama calcularPrecoFinal() do objeto Livro real
    // Não sabemos se é LivroImpresso ou Ebook, mas a chamada virtual
    // resolve para o método correto em tempo de execução
    // - Se for LivroImpresso: calcula com taxa de frete
    // - Se for Ebook: calcula com desconto de 15%

    double calcularSubtotal() const {
        // Chamada polimórfica: qual versão de calcularPrecoFinal() será executada?
        // Depende do tipo REAL do objeto, não do tipo do ponteiro (Livro*)
        return livro->calcularPrecoFinal() * quantidade;
    }
};

// ============================================================================
// CLASSE: Carrinho (Agregação de Múltiplos Itens)
// ============================================================================
// Gerencia uma coleção dinâmica de itens de compra
// Implementado com array dinâmico clássico (sem STL)
// Demonstra alocação dinâmica, redimensionamento e limpeza de memória
class Carrinho {
private:
    // AGREGAÇÃO: Array dinâmico de ponteiros para ItemCarrinho
    // O Carrinho É DONO dos ItemCarrinho e é responsável por deletá-los
    ItemCarrinho** itens;

    int capacidade;    // Tamanho atual do array
    int numItens;      // Quantidade de itens realmente armazenados

    // Método privado para redimensionar o array quando necessário
    // Estratégia: dobra a capacidade
    void redimensionar() {
        int novaCapacidade = capacidade * 2;

        // Aloca novo array maior
        ItemCarrinho** novoArray = new ItemCarrinho*[novaCapacidade];

        // Copia ponteiros dos itens existentes
        for (int i = 0; i < numItens; i++) {
            novoArray[i] = itens[i];
        }

        // Deleta o array antigo (mas NÃO os ItemCarrinho, apenas o array)
        delete[] itens;

        // Atualiza para novo array
        itens = novoArray;
        capacidade = novaCapacidade;
    }

    // Método privado para buscar um item pelo Livro
    // Retorna o índice se encontrar, -1 se não encontrar
    int buscarIndiceItem(Livro* livro) {
        for (int i = 0; i < numItens; i++) {
            if (itens[i]->getLivro()->getId() == livro->getId()) {
                return i;
            }
        }
        return -1;
    }

public:
    // Construtor: inicializa o carrinho com capacidade padrão
    // Aloca array dinâmico para armazenar ponteiros de ItemCarrinho
    Carrinho(int capacidadeInicial = 5)
        : capacidade(capacidadeInicial), numItens(0) {

        // Alocação dinâmica do array de ponteiros
        itens = new ItemCarrinho*[capacidade];
    }

    // Destrutor: Responsável por liberar toda a memória
    // IMPORTANTE: Segue ordem de limpeza correta para não criar memory leaks
    ~Carrinho() {
        // Primeiro: deleta cada ItemCarrinho (foram alocados com new)
        for (int i = 0; i < numItens; i++) {
            delete itens[i];
        }

        // Depois: deleta o array de ponteiros (foi alocado com new[])
        delete[] itens;
    }

    // ===== ADIÇÃO DE ITEMS AO CARRINHO =====
    // Lógica: Se livro já existe no carrinho, soma quantidade
    //         Se não existe, cria novo ItemCarrinho
    // Validações:
    //   - Quantidade solicitada deve ser > 0 (validada no ItemCarrinho)
    //   - Estoque do livro deve ser suficiente
    //   - Redimensiona array se necessário

    void adicionarItem(Livro* livro, int quantidade) {
        // Validação 1: Quantidade deve ser positiva
        if (quantidade <= 0) {
            throw QuantidadeInvalidaException("Quantidade a adicionar deve ser maior que zero");
        }

        // Validação 2: Estoque disponível deve ser suficiente
        if (livro->getQtdEstoque() < quantidade) {
            throw EstoqueInsuficienteException(
                "Estoque insuficiente. Disponível: " +
                std::to_string(livro->getQtdEstoque()) +
                ", Solicitado: " + std::to_string(quantidade)
            );
        }

        // Busca se o livro já está no carrinho
        int indice = buscarIndiceItem(livro);

        if (indice != -1) {
            // Livro já existe: apenas aumenta a quantidade
            int qtdAtual = itens[indice]->getQuantidade();
            int novaQtd = qtdAtual + quantidade;

            // Validação: nova quantidade não pode exceder estoque
            if (novaQtd > livro->getQtdEstoque()) {
                throw EstoqueInsuficienteException(
                    "Estoque insuficiente para aumentar quantidade. "
                    "Total solicitado: " + std::to_string(novaQtd)
                );
            }

            itens[indice]->setQuantidade(novaQtd);
        } else {
            // Livro não está no carrinho: cria novo ItemCarrinho

            // Verifica se precisa redimensionar
            if (numItens >= capacidade) {
                redimensionar();
            }

            // Cria novo ItemCarrinho com alocação dinâmica
            itens[numItens] = new ItemCarrinho(livro, quantidade);
            numItens++;
        }
    }

    // ===== CÁLCULO DO TOTAL COM POLIMORFISMO =====
    // Percorre todos os itens e acumula subtotais
    // POLIMORFISMO EM RUNTIME:
    // Cada chamada de calcularSubtotal() no ItemCarrinho chama
    // calcularPrecoFinal() polimorficamente no Livro agregado
    // A decisão de qual método executar é feita em tempo de execução

    double calcularTotal() const {
        double total = 0.0;

        for (int i = 0; i < numItens; i++) {
            // Polimorfismo: cada item pode ter um tipo diferente de Livro
            // (LivroImpresso ou Ebook) e cada um calcula seu preço diferente
            total += itens[i]->calcularSubtotal();
        }

        return total;
    }

    // ===== GETTER PARA NÚMERO DE ITENS =====

    int getNumItens() const {
        return numItens;
    }

    // ===== GETTER PARA UM ITEM ESPECÍFICO =====

    ItemCarrinho* getItem(int indice) const {
        if (indice < 0 || indice >= numItens) {
            throw std::out_of_range("Índice de item fora do intervalo");
        }
        return itens[indice];
    }

    // ===== LIMPEZA DO CARRINHO =====
    // Remove todos os itens e libera memória

    void limpar() {
        for (int i = 0; i < numItens; i++) {
            delete itens[i];
        }
        numItens = 0;
    }
};

#endif // CARRINHO_H
