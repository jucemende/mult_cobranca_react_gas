function TestCobrancasUseCase() {
  
  const faturas = [
    {
      id: '952fcf95-1bca-4d73-a7a3-f72e10078c16',
      documento: 80502,
      codCliente: 10462,
      clienteId: '10462a',
      cliente: 'PAULO SERGIO FERIANI',
      email: 'nfe.feriani@gmail.com;grupoferiani@gmail.com;karlaferiani@ucl.br',
      telefone: '(28) 9998-9414',
      idVendedor: null,
      vencimento: '05/06/2026', //'2026-05-06T03:00:00.000Z',
      status: 'VENCIDA',
      diasAtraso: 20,
      vlrLiquido: 'R$ 1.322,16',
      tipoDocumento: 'MENSALIDADE',
      criadoEm: '2026-05-25T19:54:26.958Z',
      cobrado: true,
      multa: 'R$ 26,44',
      juros: 'R$ 8,73',
      total: 'R$ 1.357,33'
    }
  ]

  const serviceCharges = new CobrancasUseCase(
    {cobrancasRepository: new SheetsCobrancasRepository()}
  )

  const chargesView = serviceCharges.getView(faturas)

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
    const faturas = this.boots.faturas()
    
    let rows = Object.keys(cobrancas).map(c =>{
      const listCobranca = cobrancas[c]
      
      const ultima = listCobranca.sort((a, b) =>
        new Date(b.dataContato) - new Date(a.dataContato)
      )[0]

      const fase = reguas[ultima.reguaId]?._faseRegua
      const cliente = clientes[ultima.codCliente]?.cliente
      const qtdCobrancas = listCobranca.length

      return new CobrancasListDTO(ultima, qtdCobrancas, cliente, fase)

    }).filter(row => Boolean(faturas[row.documento])) // filtra apenas as cobranças com faturas abertas.

    if (search) {
      rows = this.repository.applyAdvancedSearch(rows, search[0].value);
    }

    if (Object.keys(params).length > 0) {
      rows = this.repository.applyFilters(rows, params);
    }

    return rows
    
  }

  getById( id ) {
    if (!id) throw new Error('ID é obrigatório');
    
    const cobrancas = this.repository.getById(id)
    if (!cobrancas) throw new Error('Registro não encontrado')

    const clientes = this.boots.clientes()
    const reguas = this.boots.regua()

    let rows = cobrancas.map(c =>{
      const fase = reguas[c.reguaId]?._faseRegua
      const cliente = clientes[c.codCliente]?.cliente
      
      return new CobrancasListDTO(c, 0, cliente, fase)
    })

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