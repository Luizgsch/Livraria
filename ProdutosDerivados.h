#ifndef PRODUTOS_DERIVADOS_H
#define PRODUTOS_DERIVADOS_H

#include <string>
#include "Livro.h"
#include "Excecoes.h"

// ============================================================================
// CONCEITO: HERANÇA
// As classes LivroImpresso e Ebook herdam de Livro, reutilizando todos os
// atributos e métodos da classe base. Cada subclasse adiciona suas próprias
// características específicas (peso para livros físicos, tamanho e formato
// para e-books).
// ============================================================================

// ============================================================================
// CLASSE: LivroImpresso (Produto Físico com Logística)
// ============================================================================
// Representa livros impressos no sistema
// Herança: Estende a classe abstrata Livro com características de livros físicos
class LivroImpresso : public Livro {
private:
    // Atributo específico para livro impresso
    double peso;  // Peso em gramas (afeta cálculo de frete/preço final)

public:
    // Construtor que recebe parâmetros da classe base e do livro impresso
    // Delega inicialização da classe base para o construtor de Livro
    // HERANÇA: Chamada explícita ao construtor da classe base com ": Livro(...)"
    LivroImpresso(int id, const std::string& titulo, const std::string& autor,
                  double precoBase, int qtdEstoque, double peso)
        : Livro(id, titulo, autor, precoBase, qtdEstoque), peso(0) {

        // Validação do peso específica para livro impresso
        if (peso <= 0) {
            throw PesoInvalidoException("Peso do livro impresso deve ser maior que zero");
        }
        this->peso = peso;
    }

    // Destrutor virtual (herdado do conceito de destruição polimórfica)
    virtual ~LivroImpresso() = default;

    // ===== GETTER E SETTER PARA PESO =====

    double getPeso() const {
        return peso;
    }

    // Setter com validação: peso não pode ser <= 0
    void setPeso(double novoPeso) {
        if (novoPeso <= 0) {
            throw PesoInvalidoException("Peso do livro impresso deve ser maior que zero");
        }
        this->peso = novoPeso;
    }

    // ===== SOBRESCRITA POLIMÓRFICA (POLIMORFISMO) =====
    // Este método SOBRESCREVE o método virtual puro de Livro
    // POLIMORFISMO: Mesma assinatura, comportamento diferente baseado no tipo real do objeto
    // Cada tipo de livro calcula seu preço final de forma específica

    // Regra de Negócio para Livro Impresso:
    // Preço Final = Preço Base + Taxa de Frete (peso * 0.05)
    // Quanto mais pesado o livro, maior o custo de envio
    virtual double calcularPrecoFinal() const override {
        // "override" garante que este método sobrescreve o da classe base
        // Acesso aos atributos da classe base através dos getters públicos
        return getPrecoBase() + (peso * 0.05);
    }
};

// ============================================================================
// CLASSE: Ebook (Produto Digital sem Logística Física)
// ============================================================================
// Representa livros digitais (e-books) no sistema
// Herança: Estende a classe abstrata Livro com características de produtos digitais
class Ebook : public Livro {
private:
    // Atributos específicos para e-book
    double tamanhoMB;         // Tamanho do arquivo em megabytes
    std::string formato;      // Formato do arquivo (ex: "PDF", "EPUB", "MOBI")

public:
    // Construtor que recebe parâmetros da classe base e do e-book
    // HERANÇA: Chamada ao construtor da classe base com ": Livro(...)"
    Ebook(int id, const std::string& titulo, const std::string& autor,
          double precoBase, int qtdEstoque, double tamanhoMB,
          const std::string& formato)
        : Livro(id, titulo, autor, precoBase, qtdEstoque),
          tamanhoMB(0), formato("") {

        // Validação do tamanho do arquivo
        if (tamanhoMB <= 0) {
            throw TamanhoInvalidoException("Tamanho do e-book deve ser maior que zero");
        }
        this->tamanhoMB = tamanhoMB;

        // Validação do formato (não pode ser vazio)
        if (formato.empty()) {
            throw FormatoInvalidoException("Formato do e-book não pode ser vazio");
        }
        this->formato = formato;
    }

    // Destrutor virtual (herdado do conceito de destruição polimórfica)
    virtual ~Ebook() = default;

    // ===== GETTERS E SETTERS PARA ATRIBUTOS ESPECÍFICOS =====

    double getTamanhoMB() const {
        return tamanhoMB;
    }

    // Setter com validação: tamanho não pode ser <= 0
    void setTamanhoMB(double novoTamanho) {
        if (novoTamanho <= 0) {
            throw TamanhoInvalidoException("Tamanho do e-book deve ser maior que zero");
        }
        this->tamanhoMB = novoTamanho;
    }

    std::string getFormato() const {
        return formato;
    }

    // Setter com validação: formato não pode ser vazio
    void setFormato(const std::string& novoFormato) {
        if (novoFormato.empty()) {
            throw FormatoInvalidoException("Formato do e-book não pode ser vazio");
        }
        this->formato = novoFormato;
    }

    // ===== SOBRESCRITA POLIMÓRFICA (POLIMORFISMO) =====
    // Este método SOBRESCREVE o método virtual puro de Livro
    // POLIMORFISMO: Mesma assinatura, comportamento diferente baseado no tipo real do objeto
    // Cada tipo de livro calcula seu preço final de forma específica

    // Regra de Negócio para E-book:
    // Preço Final = Preço Base * 0.85 (desconto de 15%)
    // E-books são mais baratos pois não têm custos de impressão ou logística física
    virtual double calcularPrecoFinal() const override {
        // "override" garante que este método sobrescreve o da classe base
        // Acesso aos atributos da classe base através dos getters públicos
        return getPrecoBase() * 0.85;
    }
};

#endif // PRODUTOS_DERIVADOS_H
