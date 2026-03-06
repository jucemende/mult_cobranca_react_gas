class ReguaDTO extends BaseDTO {

  constructor({
    id_regua = null,
    fase_regua,
    titulo,
    atraso_de,
    atraso_ate,
    acoes_regua,
    permite_bloqueio,
    mensagem_padrao,
    criado_em,
  } = {}) {

    super()

    this.id_regua = id_regua;
    this.fase_regua = this._isString(fase_regua, 'Nome')
    this.titulo = titulo
    this.atraso_de = this._isNumber(atraso_de, "Atraso de")
    this.atraso_ate = this._isNumber(atraso_ate, "Atraso até")
    this.permite_bloqueio = permite_bloqueio
    this.acoes_regua = acoes_regua
    this.mensagem_padrao = mensagem_padrao
    this.criado_em = this._isISODate(criado_em, 'Criado em', false)
    
  }
}