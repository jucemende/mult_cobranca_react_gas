function testEncargoDomin() {

  const dados = {
    taxaJuros: 0.02,
    tipoCobranca: 'JUROS',
    aplicacao: 'PARCELAMENTO',
    recorrencia: 'MENSAL'
  }

  const encargo = Encargo.criar(dados)

  console.log(encargo)

}
function getEnunsEncargos() {
  return {
    tipoCobranca: {
      JUROS: 'JUROS',
      MULTA: 'MULTA'
    },
    aplicacao: {
      ATRASO: 'ATRASO',
      PARCELAMENTO: 'PARCELAMENTO'
    },
    recorrencia: {
      DIARIA: 'DIARIA',
      MENSAL: 'MENSAL',
      UNICA: 'UNICA'
    }
  }
}

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
    const { tipoCobranca } = getEnunsEncargos()
    if (!tipoCobranca[valor]) {
      throw new Error(`Tipo de cobrança inválido: ${valor}`);
    }
    return valor;
  }

  _validarAplicacao(valor) {
    const { aplicacao } = getEnunsEncargos();
    if (!aplicacao[valor]) {
      throw new Error(`Aplicação inválida: ${valor}`);
    }
    return valor;
  }

  _validarRecorrencia(valor) {
    const { tipoCobranca, aplicacao, recorrencia } = getEnunsEncargos()
    
    if (!recorrencia[valor]) {
      throw new Error(`Recorrência inválida: ${valor}`);
    }

    if( this._tipoCobranca === tipoCobranca.MULTA ) {
      
      const isAtraso = this._aplicacao === aplicacao.ATRASO;
      const isUnica = valor === recorrencia.UNICA;

      if (!isAtraso || !isUnica) {
        throw new Error(
          `O tipo de cobrança ${tipoCobranca.MULTA} exige aplicação em ` +
          `${aplicacao.ATRASO} com recorrência ${recorrencia.UNICA}.`
        )
      } 
    }

    if (this._tipoCobranca === tipoCobranca.JUROS) {
      
      const isRecorrenciaValida = valor === recorrencia.MENSAL ||
                                  valor === recorrencia.DIARIA
      
      const isParcelamentoMensal = this._aplicacao === aplicacao.PARCELAMENTO && 
                                   valor === recorrencia.MENSAL;
                                  
      const isAtrasoDiario = this._aplicacao === aplicacao.ATRASO && 
                             valor === recorrencia.DIARIA;

      if (!isRecorrenciaValida) {
        throw new Error(
          `O tipo de cobranca ${tipoCobranca.JUROS} só permite recorrência ` +
          `${recorrencia.MENSAL} ou ${recorrencia.DIARIA}`
        )
      }
      
      if (!isParcelamentoMensal && this._aplicacao === aplicacao.PARCELAMENTO) {
        throw new Error(
          `A aplicação ${aplicacao.PARCELAMENTO} só permite recorrência ${recorrencia.MENSAL}`
        );
      }
        
      if (!isAtrasoDiario && this._aplicacao === aplicacao.ATRASO) {
        throw new Error(
          `A aplicação ${aplicacao.ATRASO} só permite recorrência ${recorrencia.DIARIA}`
        );
      }

    }

    return valor

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