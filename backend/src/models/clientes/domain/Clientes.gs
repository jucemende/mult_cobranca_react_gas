function TestDomainCliente() {

  const dadosCriacao = {
    cod: 1234,
    idVendedor: 4567,
    cliente: 'JULIO CESAR',
    tipo: 'CNPJ',
    cnpjCpf: '12.123.123/1234-12',
    telefone: '62 99240-9051',
    email: 'email@teste.com',
    status: 'ATIVO',
    permiteNotificacao: true,
    obs: 'Obs teste',
  }

  const dados2 = {
    cod: 1234,
    idVendedor: 4567,
    cliente: 'JULIO CESAR',
    tipo: 'CNPJ',
    cnpjCpf: '12.123.123/1234-12',
    telefone: '62 99240-9051',
    email: 'email@teste.com',
    status: 'CANCELADO',
    permiteNotificacao: false,
    obs: 'Obs teste',
    criadoEm: '2026-02-22T16:37:00.155Z'
  }

  const meuTeste = Cliente.criar(dadosCriacao)
  meuTeste.id = 'ab-1234'
  console.log(meuTeste)
  
  const meuTeste2 = meuTeste.upDates(dados2)
  console.log(meuTeste2)

}

function getEnunsClientes() {
  return {
    statusCliente: {
      ATIVO: 'ATIVO',
      CANCELADO: 'CANCELADO',
      INATIVO: 'INATIVO',
      SUSPENSO: 'SUSPENSO'
    },
    tipoPessoa: {
      CNPJ: 'CNPJ',
      CPF: 'CPF'
    }
  }
}

function schemaDomainCliente(){
  return {
    id: null,
    cod: undefined,
    idVendedor: null,
    cliente: undefined,
    tipo: null,
    cnpjCpf: null,
    telefone: null,
    email: null,
    status: undefined,
    permiteNotificacao: undefined,
    obs: null,
    criadoEm: null
  }
}

class Cliente {

  constructor(propsRegua = {}) {
    
    // Valida o schemaDomainCliente
    const props = Object.assign({}, schemaDomainCliente(), propsRegua);
    
    // Função para validar os dados preenchidos
    this._validaPreenchimento(props)

    this._id = props.id
    this.cod = props.cod
    this.idVendedor = props.idVendedor
    this.cliente = props.cliente
    this._tipo = this._validarTipo(props.tipo)
    this.cnpjCpf = this._validarCnpjCPF(props.cnpjCpf)
    this.telefone = props.telefone
    this.email = props.email
    this._status = this._validarStatus(props.status)
    this._permiteNotificacao = this._validaPerimissao(props.permiteNotificacao)
    this.obs = props.obs
    this._criadoEm = props.criadoEm 
      ? new Date(props.criadoEm).toISOString()
      : new Date().toISOString()
    
  }

  static criar(props = schemaDomainCliente()) {
    return new Cliente(props)
  }

  upDates(props = schemaDomainCliente()) {
    return new Cliente({
      id: props.id ?? this._id,
      cod: props.cod ?? this.cod,
      idVendedor: props.idVendedor ?? this.idVendedor,
      cliente: props.cliente ?? this.cliente,
      tipo: props.tipo ?? this._tipo,
      cnpjCpf: props.cnpjCpf ?? this.cnpjCpf,
      telefone: props.telefone ?? this.telefone,
      email: props.email ?? this.email,
      status: props.status ?? this._status,
      permiteNotificacao: props.permiteNotificacao ?? this._permiteNotificacao,
      obs: props.obs ?? this.obs,
      criadoEm: this._criadoEm
    })
  }

  _validaPreenchimento(props) {
    for (const key in props) {
      if(props[key] === undefined) {
        throw new Error(`O campo ${key} é de preenchimento obrigatório`)
      }
    }
  }

  _validarTipo(valor) {
    
    if(!valor) {
      return null 
    }

    const { tipoPessoa } = getEnunsClientes()
    if (!tipoPessoa[valor]) {
      throw new Error(`Tipo de pessoa inválido: ${valor}`);
    }
    return valor;
  }

  _validarStatus(valor) {
    const { statusCliente } = getEnunsClientes()
    if (!statusCliente[valor]) {
      throw new Error(`Status inválido: ${valor}`);
    }
    return valor;
  }

  _validarCnpjCPF(valor) {
    
    if(!valor) {
      return null
    }

    // Remove caracteres não numéricos
    const documento = valor.replace(/[^\d]+/g, '');
    
    const { tipoPessoa } = getEnunsClientes()

    // Validação de CPF (11 dígitos)
    if (this._tipo === tipoPessoa.CPF && documento.length === 11) {
        return documento;
    } 
    // Validação de CNPJ (14 dígitos)
    else if (this._tipo === tipoPessoa.CNPJ && documento.length === 14) {
        return documento;
    }

    throw new Error(`Informe um número ${this._tipo} válido`)
  }

  _validaPerimissao(valor) {
    
    const permissao = Boolean(valor)

    if (typeof valor !== 'boolean') {
      throw new Error(`O campo permiteNotificacao deve ser um booleano (true ou false)`);
    }
    
    const { statusCliente } = getEnunsClientes()
    if (this._status != statusCliente.ATIVO && permissao === true){
      throw new Error(`Somente clientes ativos podem receber notificações`)
    }

    return valor ?? false

  }

  get id() { return this._id; }
  get tipo() { return this._tipo; }
  get status() { return this._status; }
  get permiteNotificacao() { return this._permiteNotificacao; }
  get criadoEm() { return this._criadoEm; }

  set id(value) { return this._id = value }

}