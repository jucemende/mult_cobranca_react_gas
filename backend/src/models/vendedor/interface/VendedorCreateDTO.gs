class VendedoresDTO extends BaseDTO {

  constructor({
    vendedor,
    email,
    criado_em
  } = {}) {

    super()

    this.vendedor = this._isString(vendedor, 'Nome Vendedor')
    this.email = email
    this.criado_em = this._isISODate(criado_em, 'Criado em', false)
    
  }
}