class EncargosDTO extends BaseDTO {
  
  constructor({
    taxaJuros,
    tipoCobranca,
    aplicacao,
    recorrencia,
    criadoEm,
  } = {}) {

    super()

    this.taxaJuros = this._isNumber(taxaJuros, 'Taxa de Juros')
    this.tipoCobranca = this._isString(tipoCobranca, 'Tipo de Cobrança')
    this.aplicacao = this._isString(aplicacao, "Aplicação")
    this.recorrencia = this._isString(recorrencia, "Recorrência")
    this.criadoEm = this._isISODate(criadoEm, 'Criado em', false)

  }
}