class ClienteDTO extends BaseDTO {

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