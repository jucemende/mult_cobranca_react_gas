function TestCobrancasUseCase() {
  
  const serviceCharges = new CobrancasUseCase(
    {cobrancasRepository: new SheetsCobrancasRepository()}
  )

  const chargesView = serviceCharges.getAll()

  console.log(chargesView)

}

class CobrancasUseCase {

  constructor({ cobrancasRepository }) {
    this.repository = cobrancasRepository
    this.serviceRegua = new ReguaService({
      reguaRepository: new SheetsReguaRepository()
    })
    this.boots = BootstrapIndex()
  }

  getAll( params = {} ) {
    
    const search = params.search

    const cobrancas = this.boots.cobrancas()
    const clientes = this.boots.clientes()
    const reguas = this.boots.regua()
    
    let rows = Object.keys(cobrancas).map(c =>{
      const listCobranca = cobrancas[c]
      
      const ultima = listCobranca.sort((a, b) =>
        new Date(b.dataContato) - new Date(a.dataContato)
      )[0]

      const fase = reguas[ultima.reguaId]?._faseRegua
      const cliente = clientes[ultima.codCliente]?.cliente
      const qtdCobrancas = listCobranca.length

      return new CobrancasListDTO(ultima, qtdCobrancas, cliente, fase)

    })

    if (search) {
      rows = this.repository.applyAdvancedSearch(rows, search[0].value);
    }

    if (Object.keys(params).length > 0) {
      rows = this.repository.applyFilters(rows, params);
    }

    return rows
    
  }

  getView(faturas) {

    const regua = this._getReguaPrincipal(faturas)

    if (!faturas.length || !regua)
      throw new Error('Nenhuma fatura elegível para cobranças')
    
    return new CobrancaViewDTO(faturas, regua)
  }

  create(data) {

    const regua = this._getReguaPrincipal(data.faturas)
    const cobrancas = data.faturas.map(f => {
      
      const propsCobranca = {
        documento: f.documento,
        codCliente: data.codCliente,
        diasAtraso: f.diasAtraso,
        vlrLiquido: f.vlrLiquido,
        dataContato: new Date().toISOString(),
        reguaId: regua.id,
        canal: data.canal,
        acao: data.acao,
        status: data.status,
      }

      const props = Object.assign({}, schemaDomainCobranca(), propsCobranca)

      const cobranca = Cobranca.criar(props)

      cobranca.id = Utilities.getUuid()
      
      return cobranca
    })

    return this.repository.insert(cobrancas);
  }

  _getReguaPrincipal(faturas) {

    const reguas = this.serviceRegua.getAll()
    const reguasAplicadas = faturas
      .map(f => {
        console.log(f.diasAtraso)
        return reguas.find(r =>
          f.diasAtraso >= r.atrasoDe &&
          f.diasAtraso <= r.atrasoAte
        )
      })
      .filter(Boolean)

    console.log(reguasAplicadas)
    if (!reguasAplicadas.length)
      return null

    return reguasAplicadas
      .sort((a, b) =>
        b.atrasoDe - a.atrasoDe
      )[0]
  }
}