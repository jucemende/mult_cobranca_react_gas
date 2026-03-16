function TestFaturasUseCase() {
  
  const dadosCriacao = {
    documento: 141881,
    codCliente: 1234,
    vencimento: '2026/02/31',
    vlrLiquido: 550.00,
    possuiEncargos: true
  }

  const service = new FaturasUseCase({
    faturasRepository: new SheetsFaturasRepository()
  })

  const data = service.getById('77837a')
  console.log(data)

}

class FaturasUseCase {

  constructor({ faturasRepository }) {
    this.repository = faturasRepository
    this.boots = BootstrapIndex()
  }

  getAll( params = {} ) {
    
    const search = params.search

    const faturas = this.repository.getAll()
    
    const clientes = this.boots.clientes()
    const cobrancas = this.boots.cobrancas()
    const { taxaJuros, taxaMulta } = this._getEncargos()

    let rows = faturas.map(f => {
      
      if(cobrancas[f.documento]?.length) f.cobrado = true

      const encargo = f.diasAtraso > 0 && f.possuiEncargos
        ? f.calcularEncargos({
          taxaJuros,
          taxaMulta
        })
        : null
      
      return new FaturasListDTO(f, clientes[f.codCliente], encargo)

    })
    
    if (search) {
      rows = this.repository.applyAdvancedSearch(rows, search[0].value);
    }

    if (Object.keys(params).length > 0) {
      rows = this.repository.applyFilters(rows, params);
    }

    return rows;
    
  }

  getById( id ) {
    if (!id) throw new Error('ID é obrigatório');
    
    const fatura = this.repository.getById(id)
    if (!fatura) throw new Error('Registro não encontrado')
    
    const clientes = this.boots.clientes()
    const cobrancas = this.boots.cobrancas()

    if(cobrancas[fatura.documento]?.length) fatura.cobrado = true
    
    const { taxaJuros, taxaMulta } = this._getEncargos()

    const encargo = fatura.diasAtraso > 0 && fatura.possuiEncargos
      ? fatura.calcularEncargos({
        taxaJuros,
        taxaMulta
      })
      : null

    return new FaturasListDTO(fatura, clientes[fatura.codCliente], encargo)
  }

  create(data) {

    const props = Object.assign({}, schemaDomainFatura(), data);

    const fatura = Fatura.criar(props)
    
    if (this.repository.validateDuplicate(
      fatura.documento
    )){
      throw new Error(`Já existe uma fatura para o documento n. ${fatura.documento}`);
    }

    // Set o id após todas verificações
    fatura.id = Utilities.getUuid()

    return this.repository.insert(fatura);
  }

  update(id, data) {

    if (!id) throw new Error('ID é obrigatório');

    const existente = this.repository.getById(id);
    if (!existente) throw new Error('Registro não encontrado')

    const fatura = existente.upDates(data)
    
    if (this.repository.validateDuplicate(
      fatura.documento,
      id
    )){
      throw new Error(`Já existe uma fatura para o documento n. ${fatura.documento}`);
    }

    return this.repository.update(fatura);
  }

  delete(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.repository.delete(id);
  }

  _getEncargos(){

    const enuns = getEnunsEncargos().recorrencia
    const encargos = this.boots.encargos()

    const taxaJuros = encargos[enuns.DIARIA]?._taxaJuros || 0 //0.00033,
    const taxaMulta = encargos[enuns.UNICA]?._taxaJuros || 0 //0.02

    return {
      taxaJuros,
      taxaMulta
    }

  }
}