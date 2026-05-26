function TestDomainFatura() {

  const data = {
    documento: 1234,
    codCliente: 1234,
    vencimento: '2026-06-05T03:00:00.000Z',
    vlrLiquido: 550.00,
    possuiEncargos: true
  }

  const data2 = {
    codCliente: 1234,
    vencimento: '2026/03/30',
    vlrLiquido: 550.00,
    possuiEncargos: true
  }

  const fatura = Fatura.criar(data)
  console.log(fatura)

  const encargos = fatura.calcularEncargos({
    taxaJuros: 0.00033,
    taxaMulta: 0.02
  })
  console.log(encargos)
}

function getEnunsFatura() {
  return {
    status: {
      ABERTA: 'ABERTA',
      VENCIDA: 'VENCIDA'
    },
    tipoDocumento: {
      MENSALIDADE: 'MENSALIDADE',
      REEMBOLSO: 'REEMBOLSO'
    }
  }
}

function schemaDomainFatura(){
  return {
    id: null,
    documento: undefined,
    codCliente: undefined,
    vencimento: undefined,
    vlrLiquido: undefined,
    possuiEncargos: undefined,
    cobrado: null,
    criadoEm: null
  }
}

class Fatura {

  constructor(propsFatura = {}) {
    
    // Valida o schemaDomainFatura
    const props = Object.assign({}, schemaDomainFatura(), propsFatura);
    
    // Função para validar os dados preenchidos
    this._validaPreenchimento(props)

    this._id = props.id
    this._documento = props.documento
    this.codCliente = props.codCliente
    this.vencimento = new Date(props.vencimento).toISOString()
    this._vlrLiquido = this._validaValor(props.vlrLiquido)
    this._possuiEncargos = this._validaEncargos(props.possuiEncargos)
    this._tipoDocumento = this._possuiEncargos
      ? getEnunsFatura().tipoDocumento.MENSALIDADE
      : getEnunsFatura().tipoDocumento.REEMBOLSO

    this._diasAtraso = this._verificaAtraso(this.vencimento)
    this._cobrado = false
    
    this._status = this._diasAtraso > 0
      ? getEnunsFatura().status.VENCIDA
      : getEnunsFatura().status.ABERTA

    this._criadoEm = props.criadoEm 
      ? new Date(props.criadoEm).toISOString()
      : new Date().toISOString() 
  }

  static criar(props = schemaDomainFatura()) {
    return new Fatura(props)
  }

  upDates(props = schemaDomainFatura()) {
  
    return new Fatura({
      id: props.id ?? this._id,
      documento: props.documento ?? this._documento,
      codCliente: props.codCliente ?? this.codCliente,
      vencimento: props.vencimento ?? this.vencimento,
      vlrLiquido: props.vlrLiquido ?? this._vlrLiquido,
      possuiEncargos: props.possuiEncargos ?? this._possuiEncargos,
      cobrado: props.cobrado ?? this._cobrado,
      criadoEm: this._criadoEm
    })
  }

  calcularEncargos({ taxaJuros, taxaMulta }){
    
    const multa = this._vlrLiquido * taxaMulta
    const juros = this._vlrLiquido * (this._diasAtraso * taxaJuros)
    const total = this._vlrLiquido + multa + juros

    return {
      multa,
      juros,
      total
    }

  }

  _validaPreenchimento(props) {
    for (const key in props) {
      if(props[key] === undefined) {
        throw new Error(`O campo ${key} é de preenchimento obrigatório`)
      }
    }
  }

  _validaValor(value) {
    const numero = Number(value);
    if (isNaN(numero) || numero < 0) {
      throw new Error(`O valor da fatura não pode ser zero ou negativo`);
    }
    return numero;
  }

  _validaEncargos(value) {
    
    const applyEncargo = Boolean(value)

    if (typeof value !== 'boolean') {
      throw new Error(`O campo possuiEncargos deve ser um booleano (true ou false)`);
    }

    return applyEncargo
  
  }

  _verificaAtraso(date) {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const vencimento = new Date(date);
    const diaSemana = vencimento.getUTCDay();

    if (diaSemana === 6) vencimento.setUTCDate(vencimento.getUTCDate() + 2);
    else if (diaSemana === 0) vencimento.setUTCDate(vencimento.getUTCDate() + 1);

    vencimento.setUTCHours(0, 0, 0, 0);

    const diferenca = today - vencimento;
    const umDia = 1000 * 60 * 60 * 24;

    return Math.floor(diferenca / umDia);
  }

  get id() { return this._id }
  get documento() { return this._documento }
  get vlrLiquido() { return this._vlrLiquido }
  get possuiEncargos() { return this._possuiEncargos }
  get tipoDocumento() { return this._tipoDocumento }
  get diasAtraso() { return this._diasAtraso }
  get status() { return this._status }
  get cobrado() { return this._cobrado }
  get criadoEm() { return this._criadoEm }

  set id(value) { return this._id = value }
  set cobrado(value) { return this._cobrado = value }

}