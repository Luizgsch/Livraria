#ifndef EXCECOES_H
#define EXCECOES_H

#include <stdexcept>
#include <string>

// Classe de exceção para preços inválidos
// Disparada quando tenta-se definir um preço menor ou igual a zero
class PrecoInvalidoException : public std::runtime_error {
public:
    explicit PrecoInvalidoException(const std::string& mensagem = "Preço inválido: deve ser maior que zero")
        : std::runtime_error(mensagem) {}
};

// Classe de exceção para estoque insuficiente
// Disparada quando tenta-se vender uma quantidade maior que o estoque disponível
class EstoqueInsuficienteException : public std::runtime_error {
public:
    explicit EstoqueInsuficienteException(const std::string& mensagem = "Estoque insuficiente para completar a operação")
        : std::runtime_error(mensagem) {}
};

// Classe de exceção para quantidade inválida
// Disparada quando tenta-se adicionar uma quantidade negativa ao estoque
class QuantidadeInvalidaException : public std::runtime_error {
public:
    explicit QuantidadeInvalidaException(const std::string& mensagem = "Quantidade inválida: não pode ser negativa")
        : std::runtime_error(mensagem) {}
};

// Classe de exceção para peso inválido
// Disparada quando tenta-se definir um peso menor ou igual a zero em livros impressos
class PesoInvalidoException : public std::runtime_error {
public:
    explicit PesoInvalidoException(const std::string& mensagem = "Peso inválido: deve ser maior que zero")
        : std::runtime_error(mensagem) {}
};

// Classe de exceção para tamanho inválido
// Disparada quando tenta-se definir um tamanho menor ou igual a zero em e-books
class TamanhoInvalidoException : public std::runtime_error {
public:
    explicit TamanhoInvalidoException(const std::string& mensagem = "Tamanho inválido: deve ser maior que zero")
        : std::runtime_error(mensagem) {}
};

// Classe de exceção para formato inválido
// Disparada quando tenta-se definir um formato vazio para um e-book
class FormatoInvalidoException : public std::runtime_error {
public:
    explicit FormatoInvalidoException(const std::string& mensagem = "Formato inválido: não pode ser vazio")
        : std::runtime_error(mensagem) {}
};

// Classe de exceção para cupom inválido
// Disparada quando tenta-se usar um cupom de desconto inexistente ou expirado
class CupomInvalidoException : public std::runtime_error {
public:
    explicit CupomInvalidoException(const std::string& mensagem = "Cupom inválido ou expirado")
        : std::runtime_error(mensagem) {}
};

// Classe de exceção para dados inválidos
// Disparada quando tenta-se cadastrar dados inválidos (ID duplicado, título vazio, etc)
class DadosInvalidosException : public std::runtime_error {
public:
    explicit DadosInvalidosException(const std::string& mensagem = "Dados inválidos fornecidos")
        : std::runtime_error(mensagem) {}
};

// Classe de exceção para carrinho inválido
// Disparada quando tenta-se realizar operações inválidas no carrinho
class CarrinhoInvalidoException : public std::runtime_error {
public:
    explicit CarrinhoInvalidoException(const std::string& mensagem = "Operação inválida no carrinho")
        : std::runtime_error(mensagem) {}
};

#endif // EXCECOES_H
