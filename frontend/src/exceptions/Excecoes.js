export class DadosInvalidosException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'DadosInvalidosException';
  }
}

export class EstoqueInsuficienteException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'EstoqueInsuficienteException';
  }
}

export class CupomInvalidoException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'CupomInvalidoException';
  }
}

export class CarrinhoInvalidoException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'CarrinhoInvalidoException';
  }
}

export class SucessoException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'Sucesso';
  }
}
