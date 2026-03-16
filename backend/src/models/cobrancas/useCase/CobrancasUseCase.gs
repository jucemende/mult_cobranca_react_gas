function TestCobrancasUseCase() {
  
  const fatura = [
    {
      diasAtraso: 0
    },
    {
      diasAtraso: 3
    },
    {
      diasAtraso: 6
    }
  ]

  const params = {
    codCliente: [{op: '=', value: 9937}],
    status: [{op: '=', value: 'VENCIDA'}]
  }

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

    const cobrancas = this.repository.getAll()
    const clientes = this.boots.clientes()
    const regua = this.boots.regua()
    
    let rows = cobrancas.map(c => {
      return new CobrancasListDTO(c, clientes[c.codCliente], regua[c.reguaId])
    })

    if (search) {
      rows = this.repository.applyAdvancedSearch(rows, search[0].value);
    }

    if (Object.keys(params).length > 0) {
      rows = this.repository.applyFilters(rows, params);
    }

    return rows;
    
  }

  getView(faturas) {

    if (!faturas.length)
      throw new Error('Nenhuma fatura elegível para cobranças')

    const regua = this._getReguaPrincipal(faturas)

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
      .map(f =>
        reguas.find(r =>
          f.diasAtraso >= r.atrasoDe &&
          f.diasAtraso <= r.atrasoAte
        )
      )
      .filter(Boolean)

    if (!reguasAplicadas.length)
      return null

    return reguasAplicadas
      .sort((a, b) =>
        b.atrasoDe - a.atrasoDe
      )[0]
  }
}