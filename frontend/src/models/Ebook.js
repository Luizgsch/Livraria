import { Livro } from './Livro.js';

export class Ebook extends Livro {
  constructor(id, titulo, autor, preco, estoque, tamanhoMB, formato) {
    super(id, titulo, autor, preco, estoque, 'ebook');
    this.tamanhoMB = tamanhoMB;
    this.formato = formato;
  }

  calcularPrecoFinal() {
    return Math.max(0, this.preco - (this.tamanhoMB * 0.10));
  }

  toJSON() {
    return {
      ...super.toJSON(),
      tamanhoMB: this.tamanhoMB,
      formato: this.formato
    };
  }

  static fromJSON(data) {
    const livro = new Ebook(
      data.id,
      data.titulo,
      data.autor,
      data.preco,
      data.estoque,
      data.tamanhoMB,
      data.formato
    );
    return livro;
  }
}
