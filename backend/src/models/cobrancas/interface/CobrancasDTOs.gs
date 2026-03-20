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
  constructor (ultima, qtdCobrancas, cliente, fase) {
    this.id = ultima._id
    this.codCliente = ultima.codCliente
    this.cliente = cliente ?? null
    this.documento = ultima.documento
    this.qtdCobrancas = qtdCobrancas
    this.dataContato = new Date(ultima.dataContato).toLocaleDateString()
    this.fase = fase
    this.canal = ultima.canal
    this.acao = ultima.acao
    this.status = ultima.status
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