import { Livro } from './Livro.js';

export class LivroImpresso extends Livro {
  constructor(id, titulo, autor, preco, estoque, peso) {
    super(id, titulo, autor, preco, estoque, 'impresso');
    this.peso = peso;
  }

  calcularPrecoFinal() {
    return this.preco + (this.peso * 0.001);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      peso: this.peso
    };
  }

  static fromJSON(data) {
    const livro = new LivroImpresso(
      data.id,
      data.titulo,
      data.autor,
      data.preco,
      data.estoque,
      data.peso
    );
    return livro;
  }
}
