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
  constructor (cobranca, qtdCobrancas, cliente, fase) {
    this.id = cobranca._id
    this.codCliente = cobranca.codCliente,
    this.diasAtraso = cobranca.diasAtraso
    this.cliente = cliente ?? null
    this.documento = cobranca.documento
    this.qtdCobrancas = qtdCobrancas
    this.dataContato = new Date(cobranca.dataContato).toISOString()
    this.fase = fase
    this.canal = cobranca.canal
    this.acao = cobranca.acao
    this.status = cobranca.status
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