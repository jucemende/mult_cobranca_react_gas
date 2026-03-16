class FaturasCreateDTO extends BaseDTO {
  constructor({
    id = null,
    documento,
    codCliente,
    vencimento,
    vlrLiquido,
    possuiEncargos,
    criadoEm
  } = {}) {

    super()

    this.id = id 
    this.documento = this._isNumber(documento, 'Documento')
    this.codCliente = codCliente 
    this.vencimento = this._isISODate(vencimento, 'Data Vencimento') 
    this.vlrLiquido = this._isFloat(vlrLiquido, 'Valor') 
    this.possuiEncargos = possuiEncargos 
    this.criadoEm = this._isISODate(criadoEm, 'Criado em', false) 

  }
}

class FaturasListDTO {
  constructor (faturas, cliente, encargo) {
    this.id = faturas.id
    this.documento = faturas.documento
    this.codCliente = faturas.codCliente
    this.cliente = cliente?.cliente ?? null
    this.email = cliente?.email ?? null
    this.telefone = cliente?.telefone ?? null
    this.idVendedor = cliente?.idVendedor ?? null
    this.vencimento = faturas.vencimento
    this.status = faturas.status
    this.diasAtraso = faturas.diasAtraso
    this.vlrLiquido = faturas.vlrLiquido
    this.tipoDocumento = faturas.tipoDocumento
    this.criadoEm = faturas.criadoEm
    this.multa = encargo?.multa ?? 0
    this.juros = encargo?.juros ?? 0
    this.total = encargo?.total ?? faturas.vlrLiquido
  }
}