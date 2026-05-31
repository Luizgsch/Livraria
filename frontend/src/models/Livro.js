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
