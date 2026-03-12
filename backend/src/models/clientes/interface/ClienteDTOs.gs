class ClienteCreatDTO extends BaseDTO {

  constructor({
    id = null,
    cod,
    id_vendedor,
    cliente,
    tipo,
    cnpj_cpf,
    telefone,
    email,
    status,
    permite_notificacao,
    obs,
    criado_em,
  } = {}) {

    super()

    this.id = id
    this.cod = cod
    this.id_vendedor = this._isString(id_vendedor, "Vendedor", false)
    this.cliente = this._isString(cliente, 'Nome do Cliente')
    this.tipo = this._isString(tipo, 'Tipo')
    this.cnpj_cpf = this._isString(cnpj_cpf, 'CPF/CNPJ')
    this.telefone = this._isString(telefone, 'Telefone', false)
    this.email = this._isString(email, 'E-mail', false)
    this.status = this._isString(status, 'Status')
    this.permite_notificacao = permite_notificacao
    this.obs = obs
    this.criado_em = this._isISODate(criado_em, 'Criado em', false)

  }
}

class ClienteListDTO {
  constructor(cliente, vendedor) {
    this.id = cliente.id
    this.cliente = cliente.cliente
    this.cod = cliente.cod
    this.idVendedor = cliente.idVendedor
    this.tipo = cliente.tipo
    this.cnpjCpf = cliente.cnpjCpf
    this.telefone = cliente.telefone
    this.email = cliente.email
    this.status = cliente.status
    this.permiteNotificacao = cliente.permiteNotificacao
    this.obs = cliente.obs
    this.vendedor = vendedor ?? null
  }
}