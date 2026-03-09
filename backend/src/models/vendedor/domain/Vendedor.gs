function TestDomainVendedor() {
  const dados = {
    id: null,
    vendedor: 'Julio',
    email: 'email@teste.com'
  }

  const vendedor = Vendedor.criar(dados)
  console.log(vendedor)
  
}


function schemaDomainVendedor(){
  return {
    id: null,
    vendedor: undefined,
    email: undefined,
    criadoEm: null
  }
}

class Vendedor {

  constructor(propsVendedor = {}){
    
    // Valida o schemaDomainRegua
    const props = Object.assign({}, schemaDomainVendedor(), propsVendedor);

    // Função para validar os dados preenchidos
    this._validaPreenchimento(props)

    this._id = props.id
    this.vendedor = props.vendedor
    this.email = props.email
    this._criadoEm = props.criadoEm 
      ? new Date(props.criadoEm).toISOString()
      : new Date().toISOString()
    
  }

  static criar(props = schemaDomainVendedor()) {
    return new Vendedor(props)
  }

  upDates(props = schemaDomainVendedor()) {
    return new Vendedor({
      id: props.id ?? this._id,
      vendedor: props.vendedor ?? this.vendedor,
      email: props.email ?? this.email,
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

  get id() { return this._id }
  get criadoEm() { return this._criadoEm }

  set id(value) { return this._id = value }

}