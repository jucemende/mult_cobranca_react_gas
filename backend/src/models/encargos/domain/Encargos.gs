class Encargo {

  constructor({
    id = null,
    taxaJuros,
    tipoCobranca,
    aplicacao,
    recorrencia,
    criadoEm = null,
  }) {

    this._id = id;
    this._taxaJuros = this._validarTaxa(taxaJuros);
    this._tipoCobranca = this._validarTipo(tipoCobranca);
    this._aplicacao = this._validarAplicacao(aplicacao);
    this._recorrencia = this._validarRecorrencia(recorrencia);
    this._criadoEm = criadoEm;
    
    Object.freeze(this);
  }

  get id() { return this._id; }
  get taxaJuros() { return this._taxaJuros; }
  get tipoCobranca() { return this._tipoCobranca; }
  get aplicacao() { return this._aplicacao; }
  get recorrencia() { return this._recorrencia; }
  get criadoEm() { return this._criadoEm; }
  
  isJuros() {
    return this._tipoCobranca === 'JUROS';
  }

  isMulta() {
    return this._tipoCobranca === 'MULTA';
  }

  isRecorrente() {
    return this._recorrencia !== 'UNICA';
  }

  atualizar(dados) {
    return new Encargo({
      id: this._id,
      taxaJuros: dados.taxaJuros ?? this._taxaJuros,
      tipoCobranca: dados.tipoCobranca ?? this._tipoCobranca,
      aplicacao: dados.aplicacao ?? this._aplicacao,
      recorrencia: dados.recorrencia ?? this._recorrencia,
      criadoEm: dados.criadoEm ?? this._criadoEm,
    });
  }

  _validarTaxa(valor) {
    const numero = Number(valor);
    if (isNaN(numero) || numero < 0) {
      throw new Error(`Taxa de juros inválida`);
    }
    return numero;
  }

  _validarTipo(valor) {
    const permitidos = ['JUROS', 'MULTA'];
    if (!permitidos.includes(valor)) {
      throw new Error(`Tipo de cobrança inválido: ${valor}`);
    }
    return valor;
  }

  _validarAplicacao(valor) {
    const permitidos = ['ATRASO', 'PARCELAMENTO'];
    if (!permitidos.includes(valor)) {
      throw new Error(`Aplicação inválida: ${valor}`);
    }
    return valor;
  }

  _validarRecorrencia(valor) {
    const permitidos = ['DIARIA', 'MENSAL', 'UNICA'];
    if (!permitidos.includes(valor)) {
      throw new Error(`Recorrência inválida: ${valor}`);
    }
    return valor;
  }

  toJSON() {
    return {
      id: this._id,
      taxaJuros: this._taxaJuros,
      tipoCobranca: this._tipoCobranca,
      aplicacao: this._aplicacao,
      recorrencia: this._recorrencia,
      criadoEm: this._criadoEm
    };
  }

  static criar(dados) {
    return new Encargo(dados);
  }
}