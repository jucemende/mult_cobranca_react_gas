function TestFaturasGroupedUseCase() {
  
  const service = new FaturasGroupedUseCase({
    faturasRepository: new SheetsFaturasRepository()
  })

  const data = service.getAll()
  console.log(data)

}

class FaturasGroupedUseCase extends FaturasUseCase {

  constructor({ faturasRepository }) {
    super({faturasRepository})
  }

  getAll( params = {} ) {
    
    const search = params.search

    const faturas = super.getAll()
    let faturasAgrupadas = this._groupByCliente(faturas)

    if (search) {
      faturasAgrupadas = this.repository.applyAdvancedSearch(faturasAgrupadas, search[0].value);
    }

    if (Object.keys(params).length > 0) {
      faturasAgrupadas = this.repository.applyFilters(faturasAgrupadas, params);
    }
    
    return faturasAgrupadas
  }

  _groupByCliente(faturas) {
    
    const vendedores = this.boots.vendedores()

    const grouped = faturas.reduce((acc, fatura) => {
      const clienteId = fatura.codCliente;
      
      if (!acc[clienteId]) {
        acc[clienteId] = {
          codCliente: fatura.codCliente,
          cliente: fatura.cliente,
          vendedor: vendedores[fatura?.idVendedor]?.vendedor ?? null,
          vlrLiquido: 0,
          ultVencimento: fatura.diasAtraso ?? 0,
          multa: 0,
          juros: 0,
          total: 0
        };
      }

      acc[clienteId].vlrLiquido += fatura.vlrLiquido || 0
      acc[clienteId].ultVencimento = Math.max(acc[clienteId].ultVencimento, fatura.diasAtraso || 0)
      acc[clienteId].multa += fatura.multa || 0
      acc[clienteId].juros += fatura.juros || 0
      acc[clienteId].total += fatura.total || 0

      return acc;

    }, {})

    return Object.values(grouped)
  }

}