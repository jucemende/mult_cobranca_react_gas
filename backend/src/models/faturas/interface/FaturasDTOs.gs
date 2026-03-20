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
    this.clienteId = cliente?._id ?? null
    this.cliente = cliente?.cliente ?? null
    this.email = cliente?.email ?? null
    this.telefone = cliente?.telefone ?? null
    this.idVendedor = cliente?.idVendedor ?? null
    this.vencimento = new Date(faturas.vencimento).toLocaleDateString()
    this.status = faturas.status
    this.diasAtraso = faturas.diasAtraso
    this.vlrLiquido = this._parseValue(faturas.vlrLiquido)
    this.tipoDocumento = faturas.tipoDocumento
    this.criadoEm = faturas.criadoEm
    this.cobrado = faturas.cobrado,
    this.multa = this._parseValue(encargo?.multa ?? 0)
    this.juros = this._parseValue(encargo?.juros ?? 0)
    this.total = this._parseValue(encargo?.total ?? faturas.vlrLiquido)
  }

  _parseValue(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
}

class FaturasGroupedDTO {
  constructor(grouped) {
    this.codCliente = grouped.codCliente
    this.clienteId = grouped?.id ?? null
    this.cliente = grouped .cliente
    this.vendedor = grouped.vendedor
    this.vlrLiquido = grouped.vlrLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    this.ultVencimento = grouped.ultVencimento
    this.multa = grouped.multa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    this.juros = grouped.juros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    this.total = grouped.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    this.cobrado = Boolean(grouped.cobrado)
  }
}