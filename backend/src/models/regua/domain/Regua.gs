function TestRegua() {

  const dadosCriacao = {
    id: null,
    faseRegua: 'LEVE',
    titulo: 'Teste',
    atrasoDe: '5',
    atrasoAte: '10',
    acoesRegua: 'WhatsApp',
    permiteBloqueio: false,
    mensagemPadrao: 'Mensagem',
  }

  const dados2 = {
    id: null,
    faseRegua: 'PREVENTIVA',
    titulo: 'Teste',
    atrasoDe: '-5',
    atrasoAte: '0',
    acoesRegua: 'WhatsApp',
    permiteBloqueio: true,
    mensagemPadrao: 'Mensagem',
    criadoEm: '2026-02-22T16:37:00.155Z'
  }

  const meuTeste = Regua.criar(dadosCriacao)
  
  meuTeste.id = '1234'
  console.log(meuTeste)

  const meuTesteNovo = meuTeste.upDates(dados2)

  console.log(meuTesteNovo)

}

function getEnunsRegua() {
  return {
    faseRegua: {
      PREVENTIVA: 'PREVENTIVA',
      LEVE: 'LEVE',
      MEDIA: 'MEDIA',
      ALTA: 'ALTA',
      CRITICA: 'CRÍTICA'
    }
  }
}

function schemaDomainRegua(){
  return {
    id: null,
    faseRegua: undefined,
    titulo: undefined,
    atrasoDe: undefined,
    atrasoAte: undefined,
    acoesRegua: undefined,
    permiteBloqueio: null,
    mensagemPadrao: undefined,
    criadoEm: null
  }
}

class Regua {

  constructor(propsRegua = {}){
    
    // Valida o schemaDomainRegua
    const props = Object.assign({}, schemaDomainRegua(), propsRegua);

    // Função para validar os dados preenchidos
    this._validaPreenchimento(props)

    this._id = props.id
    this.titulo = props.titulo
    this._atrasoDe = this._isNumber(props.atrasoDe)
    this._atrasoAte = this._validaIntervalo(props.atrasoAte)
    this.acoesRegua = props.acoesRegua
    this._permiteBloqueio = props.permiteBloqueio ?? false
    this.mensagemPadrao = props.mensagemPadrao
    this._faseRegua = this._validaFaseRegua(props.faseRegua)
    this._criadoEm = props.criadoEm 
      ? new Date(props.criadoEm).toISOString()
      : new Date().toISOString()
    
  }

  static criar(props = schemaDomainRegua()) {
    return new Regua(props)
  }

  upDates(props = schemaDomainRegua()) {
    return new Regua({
      id: props.id ?? this._id,
      titulo: props.titulo ?? this.titulo,
      atrasoDe: props.atrasoDe ?? this._atrasoDe,
      atrasoAte: props.atrasoAte ?? this._atrasoAte,
      faseRegua: props.faseRegua ?? this._faseRegua,
      acoesRegua: props.acoesRegua ?? this.acoesRegua,
      permiteBloqueio: props.permiteBloqueio ?? this._permiteBloqueio,
      mensagemPadrao: props.mensagemPadrao ?? this.mensagemPadrao,
      criadoEm: this._criadoEm
    })
  }
  
  _validaPreenchimento(props) {
    for (const key in props) {
      if(props[key] === undefined) {
        throw new Error(`O campo ${key} é de preenchimento obrigatório`)
      }
    }
  }

  _isNumber(value){
    const numero = Number(value)
    
    if (isNaN(numero)) {
      throw new Error(`O intervalo da régua deve conter apenas números`);
    }

    return numero
  }

  _validaIntervalo(value) {
    const numero = this._isNumber(value)

    if(numero < this._atrasoDe) {
        throw new Error('O fim do intervalo da régua deve ser maior que o inicio')
    }

    return numero
  }

  _validaFaseRegua (value) {
    const { faseRegua } = getEnunsRegua()
    
    if (!faseRegua[value]) {
      throw new Error(`Fase da Régua inválida: ${value}`);
    }

    if(value === faseRegua.PREVENTIVA && this._atrasoAte > 0) {
      throw new Error(`O fim da regua deve ser menor ou igual a 0 para a fase ${faseRegua.PREVENTIVA}`)
    }

    if(value === faseRegua.PREVENTIVA && this._permiteBloqueio) {
      throw new Error(`A fase ${faseRegua.PREVENTIVA} não permite bloqueio`)
    }

    return value;
  }

  get id() { return this._id }
  get atrasoDe() { return this._atrasoDe }
  get atrasoAte() { return this._atrasoAte }
  get faseRegua() { return this._faseRegua }
  get permiteBloqueio() { return this._permiteBloqueio }
  get criadoEm() { return this._criadoEm }

  set id(value) { return this._id = value }

}