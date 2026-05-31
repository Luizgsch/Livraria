#ifndef ECOMMERCE_H
#define ECOMMERCE_H

#include <string>
#include <iostream>
#include "Livro.h"
#include "ProdutosDerivados.h"
#include "Carrinho.h"
#include "Excecoes.h"

// ============================================================================
// CONCEITO: ENCAPSULAMENTO E CONTROLADORA DE NEGÓCIO
//
// A classe Ecommerce é o coração do sistema. Ela:
// 1. Gerencia o catálogo completo de livros
// 2. É DONA dos objetos Livro (responsável pela destruição)
// 3. Controla transações comerciais (vendas)
// 4. Garante integridade dos dados através de validações e exceções
//
// ENCAPSULAMENTO: Toda alteração no estoque DEVE passar por métodos
// validados, nunca direto. Isso garante consistência dos dados.
// ============================================================================

class Ecommerce {
private:
    // COMPOSIÇÃO: O E-commerce É DONO do catálogo de livros
    // Diferente do Carrinho (que agrega Livros existentes),
    // aqui CRIAMOS e DELETAMOS os livros. São nossos.
    Livro** catalogo;

    int capacidade;     // Tamanho atual do array de catálogo
    int numLivros;      // Quantidade real de livros cadastrados

    // Método privado para redimensionar catálogo
    // Estratégia: dobra a capacidade quando espaço acaba
    void redimensionar() {
        int novaCapacidade = capacidade * 2;

        // Aloca novo array maior
        Livro** novoCatalogo = new Livro*[novaCapacidade];

        // Copia ponteiros dos livros existentes
        for (int i = 0; i < numLivros; i++) {
            novoCatalogo[i] = catalogo[i];
        }

        // Deleta o array antigo (mas não os livros, apenas o array)
        delete[] catalogo;

        // Atualiza para novo array
        catalogo = novoCatalogo;
        capacidade = novaCapacidade;
    }

public:
    // Construtor: inicializa catálogo vazio
    // Capacidade padrão: 10 livros (expande automaticamente)
    Ecommerce(int capacidadeInicial = 10)
        : capacidade(capacidadeInicial), numLivros(0) {

        // Alocação dinâmica do array de ponteiros
        catalogo = new Livro*[capacidade];
    }

    // Destrutor: Responsável por liberar TODA a memória alocada
    // CRÍTICO: Deve deletar cada livro (somos donos!)
    // Depois deleta o array (foi alocado com new[])
    // ENCAPSULAMENTO GARANTIDO: Se não fezermos isso corretamente,
    // teremos memory leaks e dados corrompidos
    ~Ecommerce() {
        // Primeiro: deleta cada Livro individual (são objetos alocados com new)
        // Isso chama o destrutor virtual de Livro, que é polimórfico
        // Cada subclasse (LivroImpresso, Ebook) libera seus recursos específicos
        for (int i = 0; i < numLivros; i++) {
            delete catalogo[i];
        }

        // Depois: deleta o array de ponteiros (foi alocado com new[])
        delete[] catalogo;
    }

    // ===== CADASTRO DE LIVROS =====
    // ENCAPSULAMENTO: Ponto de entrada único para adicionar livros ao sistema
    // Validações garantem que só dados válidos entram
    void cadastrarLivro(Livro* novoLivro) {
        // Validação: não aceita ponteiro nulo
        if (novoLivro == nullptr) {
            throw std::invalid_argument("Não é possível cadastrar livro nulo");
        }

        // Verifica se o livro já existe (por ID)
        // Previne duplicação no catálogo
        for (int i = 0; i < numLivros; i++) {
            if (catalogo[i]->getId() == novoLivro->getId()) {
                throw std::invalid_argument(
                    "Livro com ID " + std::to_string(novoLivro->getId()) +
                    " já existe no catálogo"
                );
            }
        }

        // Verifica se precisa redimensionar
        if (numLivros >= capacidade) {
            redimensionar();
        }

        // Adiciona livro ao catálogo
        catalogo[numLivros] = novoLivro;
        numLivros++;
    }

    // ===== LISTAGEM DO CATÁLOGO =====
    // ENCAPSULAMENTO: Interface pública para consultar dados
    // O usuário não mexe diretamente no array, usa este método
    // Demonstra POLIMORFISMO: cada Livro calcula seu preço diferente
    void listarCatalogo() const {
        if (numLivros == 0) {
            std::cout << "Catálogo vazio!\n";
            return;
        }

        std::cout << "\n========== CATÁLOGO DA LIVRARIA ==========\n";

        for (int i = 0; i < numLivros; i++) {
            Livro* livro = catalogo[i];

            // Identifica tipo do livro (Impresso ou Ebook)
            // Sem RTTI (typeid), usamos método virtual
            std::string tipo = livro->getDescricaoTipo();

            std::cout << "\nID: " << livro->getId()
                      << " | Título: " << livro->getTitulo()
                      << " | Autor: " << livro->getAutor()
                      << "\nTipo: " << tipo
                      << " | Preço Final: R$ " << livro->calcularPrecoFinal()
                      << " | Estoque: " << livro->getQtdEstoque() << " unidades\n";
        }

        std::cout << "\n==========================================\n\n";
    }

    // ===== BUSCA POR ID =====
    // ENCAPSULAMENTO: Controla acesso aos livros
    // Retorna ponteiro ou nullptr, nunca expõe índice interno
    Livro* buscarLivroPorId(int id) const {
        for (int i = 0; i < numLivros; i++) {
            if (catalogo[i]->getId() == id) {
                return catalogo[i];
            }
        }
        return nullptr;  // Não encontrou
    }

    // ===== FINALIZAÇÃO DE COMPRA =====
    // MÉTODO CRÍTICO: Encapsula a lógica de venda completa
    // TRATAMENTO DE EXCEÇÕES: Garante que falhas não corrompem o estoque
    //
    // Fluxo seguro:
    // 1. Valida cupom (lança exceção se inválido)
    // 2. Calcula total com desconto
    // 3. SÓ DEPOIS de validar tudo, efetiva a baixa do estoque
    // 4. Se algo der errado no meio do caminho, Exception interrompe tudo
    //    e nenhuma alteração de estoque acontece (TRANSAÇÃO ATÔMICA SIMULADA)
    //
    // Se fosse código com banco de dados, seria um ROLLBACK automático.

    void finalizarCompra(Carrinho& carrinho, const std::string& cupom) {
        // Validação 1: Carrinho deve ter itens
        if (carrinho.getNumItens() == 0) {
            throw std::invalid_argument("Carrinho vazio. Nenhuma compra a finalizar.");
        }

        // Validação 2: Validação de cupom (encapsulamento de regra de negócio)
        // EXCEÇÃO: Se cupom for inválido, lança exception ANTES de tocar no estoque
        // Isso garante que um cupom errado não corrompa nada
        if (cupom != "" && cupom != "POO10") {
            throw CupomInvalidoException(
                "Cupom '" + cupom + "' é inválido. Cupons disponíveis: POO10"
            );
        }

        // Calcula total do carrinho
        double total = carrinho.calcularTotal();

        // Aplica desconto se cupom válido
        double desconto = 0.0;
        if (cupom == "POO10") {
            desconto = total * 0.10;  // 10% de desconto
            total -= desconto;
        }

        // PONTO CRÍTICO: Só a partir daqui começamos a alterar estoque
        // Se chegar aqui, todas as validações passaram
        // Se algo falhar daqui para frente, a exceção interrompe tudo
        // e o estoque fica no estado anterior (segurança de dados)

        try {
            // Efetiva a baixa do estoque para cada item
            // POLIMORFISMO: cada Livro remove estoque de forma apropriada
            for (int i = 0; i < carrinho.getNumItens(); i++) {
                ItemCarrinho* item = carrinho.getItem(i);
                Livro* livro = item->getLivro();
                int quantidade = item->getQuantidade();

                // Chamada ao método virtual removerEstoque()
                // Cada subclasse pode ter sua própria implementação
                livro->removerEstoque(quantidade);
            }

            // Exibe resumo da venda
            std::cout << "\n========== COMPRA FINALIZADA COM SUCESSO ==========\n";
            std::cout << "Total original: R$ " << (total + desconto) << "\n";
            if (cupom == "POO10") {
                std::cout << "Desconto (10%): -R$ " << desconto << "\n";
            }
            std::cout << "TOTAL A PAGAR: R$ " << total << "\n";
            std::cout << "==================================================\n\n";

            // Limpa o carrinho (destrói os ItemCarrinho, não os Livros)
            carrinho.limpar();

        } catch (const EstoqueInsuficienteException& e) {
            // Se falhar ao remover estoque, relança a exceção
            // O estoque permanece intacto (nenhuma alteração foi feita completamente)
            throw;
        }
    }

    // ===== GETTER PARA NÚMERO DE LIVROS =====
    int getNumLivros() const {
        return numLivros;
    }
};

#endif // ECOMMERCE_H
