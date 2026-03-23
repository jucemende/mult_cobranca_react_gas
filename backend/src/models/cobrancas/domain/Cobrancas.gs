function TestDomainCobrancas() {
  const data = {
    documento: "1234",
    clienteId: "5678",
    diasAtraso: "10",
    vlrLiquido: 500.50,
    dataContato: "2026/02/31",
    reguaId: "1234",
    canal: 'WHATSAPP',
    acao: "LEMBRETE",
    status: "PENDENTE",
  }

  const cobranca = Cobranca.criar(data)
  console.log(cobranca)

  // Retorno do getWay
  cobranca.status = getEnunsCobranca().status.FALHA
  console.log(cobranca)

}

function getEnunsCobranca() {
  return {
    canais: {
      WHATSAPP: 'WHATSAPP',
      EMAIL: 'EMAIL',
      CHAT: 'CHAT',
      LIGACAO: 'LIGACAO',
      AUTOMACAO: 'AUTOMACAO',
    },
    acoes: {
      LEMBRETE: 'LEMBRETE',
      NOTIFICACAO: 'NOTIFICACAO',
      NEGOCIACAO: 'NEGOCIACAO',
    },
    status: {
      PENDENTE: 'PENDENTE',
      FINALIZADO: 'FINALIZADO',
      FALHA: 'FALHA'
    }
  }
}

function schemaDomainCobranca(){
  return {
    id: null,
    documento: undefined,
    codCliente: undefined,
    diasAtraso: undefined,
    vlrLiquido: undefined,
    dataContato: undefined,
    reguaId: undefined,
    canal: undefined,
    acao: undefined,
    status: undefined,
    criadoEm: null,
  }
}

class Cobranca {

  constructor(propsCobranca = {}) {
    
    // Valida o schemaDomainCobranca
    const props = Object.assign({}, schemaDomainCobranca(), propsCobranca);
    
    // Função para validar os dados preenchidos
    this._validaPreenchimento(props)

    this._id = props.id

    this.documento = props.documento
    this.codCliente = props.codCliente
    this.diasAtraso = props.diasAtraso
    this.vlrLiquido = props.vlrLiquido
    this.dataContato = new Date(props.dataContato).toISOString()
    this.reguaId = props.reguaId
    this._canal = this._getEnuns(props.canal, getEnunsCobranca().canais)
    this._acao = this._getEnuns(props.acao, getEnunsCobranca().acoes)
    this._status = this._getEnuns(props.status, getEnunsCobranca().status)
  
    this._criadoEm = props.criadoEm 
      ? new Date(props.criadoEm).toISOString()
      : new Date().toISOString() 
  }

  static criar(props = schemaDomainCobranca()) {
    return new Cobranca(props)
  }

  _validaPreenchimento(props) {
    for (const key in props) {
      if(props[key] === undefined) {
        throw new Error(`O campo ${key} é de preenchimento obrigatório`)
      }
    }
  }

  _getEnuns(value, enumObj) {
    
    const isValorValido = Object.values(enumObj)

    if (!isValorValido.includes(value)) {
      throw new Error(`Opção ${value} inválida.`);
    }

    return value

  }

  get id() { return this._id }
  get canal() { return this._canal }
  get acao() { return this._acao }
  get status() { return this._status }
  get criadoEm() { return this._criadoEm }

  set id(value) { return this._id = value }
  set status(value) { 
    
    this._getEnuns(value, getEnunsCobranca().status)
    return this._status = value

  }

}