#ifndef LIVRO_H
#define LIVRO_H

#include <string>
#include "Excecoes.h"

// Classe abstrata que representa um livro genérico no sistema
// Servem como base para livros impressos e digitais
class Livro {
private:
    // Atributos privados encapsulados
    int id;                      // Identificador único do livro
    std::string titulo;          // Título do livro
    std::string autor;           // Nome do autor
    double precoBase;            // Preço base em reais
    int qtdEstoque;              // Quantidade disponível em estoque

public:
    // Construtor personalizado que inicializa todos os atributos
    // Valida os parâmetros antes de atribuir
    Livro(int id, const std::string& titulo, const std::string& autor,
          double precoBase, int qtdEstoque)
        : id(id), titulo(titulo), autor(autor), precoBase(0), qtdEstoque(0) {

        // Validação do preço base
        if (precoBase <= 0) {
            throw PrecoInvalidoException("Preço base deve ser maior que zero");
        }
        this->precoBase = precoBase;

        // Validação da quantidade de estoque
        if (qtdEstoque < 0) {
            throw QuantidadeInvalidaException("Quantidade em estoque não pode ser negativa");
        }
        this->qtdEstoque = qtdEstoque;
    }

    // Destrutor virtual para permitir destruição polimórfica
    virtual ~Livro() = default;

    // ===== GETTERS (Acesso aos atributos privados) =====

    int getId() const {
        return id;
    }

    std::string getTitulo() const {
        return titulo;
    }

    std::string getAutor() const {
        return autor;
    }

    double getPrecoBase() const {
        return precoBase;
    }

    int getQtdEstoque() const {
        return qtdEstoque;
    }

    // ===== SETTERS (Modificação com validações) =====

    // Setter para o preço base com validação
    // Lança PrecoInvalidoException se o preço for <= 0
    void setPrecoBase(double novoPreco) {
        if (novoPreco <= 0) {
            throw PrecoInvalidoException("Preço base deve ser maior que zero");
        }
        this->precoBase = novoPreco;
    }

    // Setter para quantidade de estoque com validação
    // Lança QuantidadeInvalidaException se a quantidade for negativa
    void setQtdEstoque(int novaQtd) {
        if (novaQtd < 0) {
            throw QuantidadeInvalidaException("Quantidade em estoque não pode ser negativa");
        }
        this->qtdEstoque = novaQtd;
    }

    // Método para adicionar quantidade ao estoque
    // Lança exceção se tentar adicionar quantidade negativa
    void adicionarEstoque(int quantidade) {
        if (quantidade < 0) {
            throw QuantidadeInvalidaException("Não é possível adicionar quantidade negativa ao estoque");
        }
        this->qtdEstoque += quantidade;
    }

    // Método para remover quantidade do estoque (venda)
    // Lança EstoqueInsuficienteException se não houver estoque suficiente
    void removerEstoque(int quantidade) {
        if (quantidade < 0) {
            throw QuantidadeInvalidaException("Não é possível remover quantidade negativa");
        }
        if (quantidade > this->qtdEstoque) {
            throw EstoqueInsuficienteException("Estoque insuficiente para esta operação");
        }
        this->qtdEstoque -= quantidade;
    }

    // ===== MÉTODO VIRTUAL PURO (Polimorfismo) =====

    // Calcula o preço final do livro de forma específica para cada tipo
    // Será implementado por LivroImpresso e LivroDigital
    virtual double calcularPrecoFinal() const = 0;
};

#endif // LIVRO_H
