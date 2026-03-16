class CobrancasCreateDTO extends BaseDTO {
  
  constructor ({
    codCliente,
    canal,
    acao,
    status,
  } = {}) {

    super()
    
    this.codCliente = codCliente
    this.canal = this._isString(canal, "Canal")
    this.acao = this._isString(acao, "Ação")
    this.status = this._isString(status, "Status da Cobrança")
    
  }
}

class CobrancasListDTO {
  constructor (cobranca, cliente, regua) {
    this.id = cobranca.id
    this.documento = cobranca.documento
    this.codCliente = cobranca.codCliente
    this.cliente = cliente?.cliente ?? null
    this.diasAtraso = cobranca.diasAtraso
    this.vlrLiquido = cobranca.vlrLiquido
    this.dataContato = cobranca.dataContato
    this.reguaId = cobranca.reguaId
    this.regua = regua?._faseRegua ?? null
    this.canal = cobranca.canal
    this.acao = cobranca.acao
    this.status = cobranca.status
    this.criadoEm = cobranca.criadoEm
  }
}

class CobrancaViewDTO {
  constructor(faturas, regua) {
    this.regua = {
      reguaId: regua.id,
      faseRegua: regua.faseRegua
    };
      
    this.cliente = {
      cliente: faturas[0].cliente,
      codCliente: faturas[0].codCliente,
      email: faturas[0].email,
      telefone: faturas[0].telefone
    };

    this.faturas = faturas.map(f => {
      return {
        documento: f.documento,
        tipoDocumento: f.tipoDocumento,
        vencimento: f.vencimento,
        vlrLiquido: f.vlrLiquido,
        total: f.total
      }
    })
  }
}