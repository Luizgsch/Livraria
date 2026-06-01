#include <iostream>
#include <string>
#include <iomanip>
#include "Ecommerce.h"
#include "ProdutosDerivados.h"
#include "Carrinho.h"
#include "Excecoes.h"

using namespace std;

// Função auxiliar para limpar buffer de entrada
void limparBuffer() {
    cin.clear();
    cin.ignore(10000, '\n');
}

// Função para exibir o menu principal
void exibirMenu() {
    cout << "\n";
    cout << "╔════════════════════════════════════════╗\n";
    cout << "║       LIVRARIA POO - MENU PRINCIPAL    ║\n";
    cout << "╠════════════════════════════════════════╣\n";
    cout << "║ [1] Listar Catálogo                    ║\n";
    cout << "║ [2] Adicionar Livro ao Carrinho        ║\n";
    cout << "║ [3] Ver Carrinho                       ║\n";
    cout << "║ [4] Finalizar Compra                   ║\n";
    cout << "║ [5] Cadastrar Novo Livro               ║\n";
    cout << "║ [6] Sair                               ║\n";
    cout << "╚════════════════════════════════════════╝\n";
    cout << "Escolha uma opção: ";
}

// Função para adicionar livro ao carrinho com validação
void adicionarAoCarrinho(Ecommerce& ecommerce, Carrinho& carrinho) {
    try {
        cout << "\n--- ADICIONAR LIVRO AO CARRINHO ---\n";

        int id;
        cout << "ID do livro: ";
        cin >> id;

        if (cin.fail()) {
            throw DadosInvalidosException("ID inválido. Digite um número inteiro.");
        }

        Livro* livro = ecommerce.buscarLivroPorId(id);
        if (livro == nullptr) {
            throw DadosInvalidosException("Livro com ID " + to_string(id) + " não encontrado no catálogo.");
        }

        int quantidade;
        cout << "Quantidade: ";
        cin >> quantidade;

        if (cin.fail() || quantidade <= 0) {
            throw DadosInvalidosException("Quantidade inválida. Digite um número positivo.");
        }

        carrinho.adicionarItem(livro, quantidade);
        cout << "\n✓ Livro adicionado ao carrinho com sucesso!\n";

    } catch (const QuantidadeInvalidaException& e) {
        cout << "\n✗ ERRO: " << e.what() << "\n";
        limparBuffer();
    } catch (const CarrinhoInvalidoException& e) {
        cout << "\n✗ ERRO: " << e.what() << "\n";
        limparBuffer();
    } catch (const DadosInvalidosException& e) {
        cout << "\n✗ ERRO: " << e.what() << "\n";
        limparBuffer();
    } catch (const exception& e) {
        cout << "\n✗ ERRO INESPERADO: " << e.what() << "\n";
        limparBuffer();
    }
}

// Função para visualizar carrinho
void verCarrinho(Carrinho& carrinho) {
    try {
        cout << "\n";
        if (carrinho.getNumItens() == 0) {
            cout << "Carrinho vazio!\n";
            return;
        }

        cout << "╔════════════════════════════════════════╗\n";
        cout << "║          ITENS NO CARRINHO             ║\n";
        cout << "╠════════════════════════════════════════╣\n";

        double totalCarrinho = 0.0;

        for (int i = 0; i < carrinho.getNumItens(); i++) {
            ItemCarrinho* item = carrinho.getItem(i);
            Livro* livro = item->getLivro();
            int qty = item->getQuantidade();
            double subtotal = livro->calcularPrecoFinal() * qty;

            cout << "\n[" << (i+1) << "] " << livro->getTitulo() << "\n";
            cout << "    Autor: " << livro->getAutor() << "\n";
            cout << "    Preço unitário: R$ " << fixed << setprecision(2) << livro->calcularPrecoFinal() << "\n";
            cout << "    Quantidade: " << qty << "\n";
            cout << "    Subtotal: R$ " << fixed << setprecision(2) << subtotal << "\n";

            totalCarrinho += subtotal;
        }

        cout << "\n" << string(40, '-') << "\n";
        cout << "TOTAL: R$ " << fixed << setprecision(2) << totalCarrinho << "\n";
        cout << "╚════════════════════════════════════════╝\n";

    } catch (const exception& e) {
        cout << "\n✗ ERRO ao exibir carrinho: " << e.what() << "\n";
    }
}

// Função para finalizar compra com cupom
void finalizarCompra(Ecommerce& ecommerce, Carrinho& carrinho) {
    try {
        if (carrinho.getNumItens() == 0) {
            throw CarrinhoInvalidoException("Carrinho vazio! Adicione livros antes de finalizar.");
        }

        cout << "\n--- FINALIZAR COMPRA ---\n";
        cout << "Digite o cupom de desconto (deixe em branco se não tiver): ";
        limparBuffer();

        string cupom;
        getline(cin, cupom);

        if (cupom.empty()) {
            cupom = "";
        }

        ecommerce.finalizarCompra(carrinho, cupom);

    } catch (const EstoqueInsuficienteException& e) {
        cout << "\n✗ ERRO DE ESTOQUE: " << e.what() << "\n";
        limparBuffer();
    } catch (const CupomInvalidoException& e) {
        cout << "\n✗ CUPOM INVÁLIDO: " << e.what() << "\n";
        limparBuffer();
    } catch (const CarrinhoInvalidoException& e) {
        cout << "\n✗ ERRO NO CARRINHO: " << e.what() << "\n";
        limparBuffer();
    } catch (const exception& e) {
        cout << "\n✗ ERRO INESPERADO: " << e.what() << "\n";
        limparBuffer();
    }
}

// Função para cadastrar novo livro
void cadastrarNovoLivro(Ecommerce& ecommerce) {
    try {
        cout << "\n--- CADASTRAR NOVO LIVRO ---\n";

        int id;
        cout << "ID do livro: ";
        cin >> id;

        if (cin.fail()) {
            throw DadosInvalidosException("ID inválido.");
        }

        limparBuffer();

        string titulo;
        cout << "Título: ";
        getline(cin, titulo);

        if (titulo.empty()) {
            throw DadosInvalidosException("Título não pode ser vazio.");
        }

        string autor;
        cout << "Autor: ";
        getline(cin, autor);

        if (autor.empty()) {
            throw DadosInvalidosException("Autor não pode ser vazio.");
        }

        double preco;
        cout << "Preço base: R$ ";
        cin >> preco;

        if (cin.fail() || preco <= 0) {
            throw PrecoInvalidoException("Preço inválido. Deve ser maior que zero.");
        }

        int quantidade;
        cout << "Quantidade em estoque: ";
        cin >> quantidade;

        if (cin.fail() || quantidade < 0) {
            throw QuantidadeInvalidaException("Quantidade inválida.");
        }

        cout << "\nTipo de livro:\n";
        cout << "[1] Livro Impresso\n";
        cout << "[2] E-book\n";
        cout << "Escolha: ";

        int tipo;
        cin >> tipo;

        if (cin.fail() || (tipo != 1 && tipo != 2)) {
            throw DadosInvalidosException("Opção de tipo inválida.");
        }

        Livro* novoLivro = nullptr;

        if (tipo == 1) {
            double peso;
            cout << "Peso (em kg): ";
            cin >> peso;

            if (cin.fail() || peso <= 0) {
                throw PesoInvalidoException("Peso inválido.");
            }

            novoLivro = new LivroImpresso(id, titulo, autor, preco, quantidade, peso);
        } else {
            limparBuffer();

            string formato;
            cout << "Formato (PDF, EPUB, MOBI, etc): ";
            getline(cin, formato);

            if (formato.empty()) {
                throw FormatoInvalidoException("Formato não pode ser vazio.");
            }

            double tamanhoMB;
            cout << "Tamanho do arquivo (em MB): ";
            cin >> tamanhoMB;

            if (cin.fail() || tamanhoMB <= 0) {
                throw TamanhoInvalidoException("Tamanho inválido.");
            }

            novoLivro = new Ebook(id, titulo, autor, preco, quantidade, tamanhoMB, formato);
        }

        ecommerce.cadastrarLivro(novoLivro);
        cout << "\n✓ Livro cadastrado com sucesso!\n";

    } catch (const PrecoInvalidoException& e) {
        cout << "\n✗ ERRO DE PREÇO: " << e.what() << "\n";
        limparBuffer();
    } catch (const PesoInvalidoException& e) {
        cout << "\n✗ ERRO DE PESO: " << e.what() << "\n";
        limparBuffer();
    } catch (const FormatoInvalidoException& e) {
        cout << "\n✗ ERRO DE FORMATO: " << e.what() << "\n";
        limparBuffer();
    } catch (const TamanhoInvalidoException& e) {
        cout << "\n✗ ERRO DE TAMANHO: " << e.what() << "\n";
        limparBuffer();
    } catch (const DadosInvalidosException& e) {
        cout << "\n✗ ERRO NOS DADOS: " << e.what() << "\n";
        limparBuffer();
    } catch (const QuantidadeInvalidaException& e) {
        cout << "\n✗ ERRO DE QUANTIDADE: " << e.what() << "\n";
        limparBuffer();
    } catch (const exception& e) {
        cout << "\n✗ ERRO INESPERADO: " << e.what() << "\n";
        limparBuffer();
    }
}

int main() {
    // Criar instância do e-commerce
    Ecommerce ecommerce(20);

    // Pré-cadastrar 3 livros (2 impressos + 1 ebook)
    try {
        // Livro Impresso 1
        Livro* livro1 = new LivroImpresso(
            1,
            "Clean Code: A Handbook of Agile Software Craftsmanship",
            "Robert C. Martin",
            89.90,
            15,
            0.8
        );
        ecommerce.cadastrarLivro(livro1);

        // Livro Impresso 2
        Livro* livro2 = new LivroImpresso(
            2,
            "Design Patterns: Elements of Reusable Object-Oriented Software",
            "Gang of Four",
            120.50,
            8,
            1.2
        );
        ecommerce.cadastrarLivro(livro2);

        // E-book
        Livro* livro3 = new Ebook(
            3,
            "Introduction to Algorithms",
            "Thomas H. Cormen",
            45.00,
            100,
            15.5,
            "PDF"
        );
        ecommerce.cadastrarLivro(livro3);

    } catch (const exception& e) {
        cout << "Erro ao pré-cadastrar livros: " << e.what() << "\n";
        return 1;
    }

    // Carrinho de compras
    Carrinho carrinho;

    // Loop do menu principal
    int opcao = 0;
    bool sair = false;

    cout << "\n╔════════════════════════════════════════╗\n";
    cout << "║  BEM-VINDO À LIVRARIA POO!             ║\n";
    cout << "║  Sistema de E-commerce para Livros     ║\n";
    cout << "╚════════════════════════════════════════╝\n";

    while (!sair) {
        exibirMenu();
        cin >> opcao;

        if (cin.fail()) {
            cout << "\n✗ Opção inválida. Digite um número entre 1 e 6.\n";
            limparBuffer();
            continue;
        }

        switch (opcao) {
            case 1:
                ecommerce.listarCatalogo();
                break;

            case 2:
                adicionarAoCarrinho(ecommerce, carrinho);
                break;

            case 3:
                verCarrinho(carrinho);
                break;

            case 4:
                finalizarCompra(ecommerce, carrinho);
                break;

            case 5:
                cadastrarNovoLivro(ecommerce);
                break;

            case 6:
                cout << "\n╔════════════════════════════════════════╗\n";
                cout << "║     OBRIGADO POR USAR NOSSA LIVRARIA!  ║\n";
                cout << "║          Até a próxima compra!         ║\n";
                cout << "╚════════════════════════════════════════╝\n\n";
                sair = true;
                break;

            default:
                cout << "\n✗ Opção inválida. Escolha entre 1 e 6.\n";
                limparBuffer();
        }
    }

    return 0;
}
