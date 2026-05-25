class ClienteCreatDTO extends BaseDTO {

  constructor({
    id = null,
    cod,
    idVendedor,
    vendedorId,
    cliente,
    tipo,
    cnpjCpf,
    telefone,
    email,
    status,
    permiteNotificacao,
    obs,
    criado_em,
  } = {}) {

    super()

    this.id = id
    this.cod = cod
    this.vendedorId = this._isString(vendedorId, "Vendedor", false)
    this.idVendedor = this._isString(idVendedor ?? vendedorId, "Vendedor", false)
    this.cliente = this._isString(cliente, 'Nome do Cliente')
    this.tipo = this._isString(tipo, 'Tipo')
    this.cnpjCpf = this._isString(cnpjCpf, 'CPF/CNPJ')
    this.telefone = this._isString(telefone, 'Telefone', false)
    this.email = this._isString(email, 'E-mail', false)
    this.status = this._isString(status, 'Status')
    this.permiteNotificacao = permiteNotificacao
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