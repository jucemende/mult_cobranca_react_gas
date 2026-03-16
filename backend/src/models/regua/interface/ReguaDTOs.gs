class ReguaCreateDTO extends BaseDTO {

  constructor({
    id,
    faseRegua,
    titulo,
    atrasoDe,
    atrasoAte,
    acoesRegua,
    permiteBloqueio,
    mensagemPadrao,
    criadoEm,
  } = {}) {

    super()

    this.id = id
    this.faseRegua = this._isString(faseRegua, 'Nome')
    this.titulo = titulo
    this.atrasode = this._isNumber(atrasoDe, "Atraso de")
    this.atrasoAte = this._isNumber(atrasoAte, "Atraso até")
    this.permiteBloqueio = permiteBloqueio
    this.acoesRegua = acoesRegua
    this.mensagemPadrao = mensagemPadrao
    this.criadoEm = this._isISODate(criadoEm, 'Criado em', false)
    
  }
}

class ReguaListDTO {
  constructor(reguas) {
    this.id = reguas.id
    this.faseRegua = reguas.faseRegua
    this.titulo = reguas.titulo
    this.atrasoDe = reguas.atrasoDe
    this.atrasoAte = reguas.atrasoAte
    this.permiteBloqueio = reguas.permiteBloqueio
    this.acoesRegua = reguas. acoesRegua
    this.mensagemPadrao = reguas.mensagemPadrao
    this.criadoEm = reguas.criadoEm
  }
}