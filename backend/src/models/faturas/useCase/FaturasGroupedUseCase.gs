function TestFaturasGroupedUseCase() {
  
  const service = new FaturasGroupedUseCase({
    faturasRepository: new SheetsFaturasRepository()
  })

  const data = service.getAll()
  console.log(data.totais)

}

class FaturasGroupedUseCase extends FaturasUseCase {

  constructor({ faturasRepository }) {
    super({faturasRepository})
  }

  getAll( params = {} ) {
    
    const search = params.search

    const { data } = super.getAll()
    let faturasAgrupadas = this._groupByCliente(data)

    if (search) {
      faturasAgrupadas = this.repository.applyAdvancedSearch(faturasAgrupadas, search[0].value);
    }

    if (Object.keys(params).length > 0) {
      faturasAgrupadas = this.repository.applyFilters(faturasAgrupadas, params);
    }

    const parseCurrency = (val) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const cleanValue = val.toString()
        .replace(/[R$\s.]/g, '')
        .replace(',', '.');
      return parseFloat(cleanValue) || 0;
    }
    
    const totais = faturasAgrupadas.reduce((acc, row) => ({
      vlrLiquido: acc.vlrLiquido + parseCurrency(row.vlrLiquido),
      multa: acc.multa + parseCurrency(row.multa),
      juros: acc.juros + parseCurrency(row.juros),
      total: acc.total + parseCurrency(row.total)
    }), { vlrLiquido: 0, multa: 0, juros: 0, total: 0 });

    return { data: faturasAgrupadas, totais };
  }

  _groupByCliente(faturas) {
    
    const vendedores = this.boots.vendedores()

    const grouped = faturas.reduce((acc, fatura) => {
      const clienteId = fatura.codCliente;
      
      if (!acc[clienteId]) {
        acc[clienteId] = {
          codCliente: fatura.codCliente,
          id: fatura.clienteId,
          cliente: fatura.cliente,
          vendedor: vendedores[fatura?.idVendedor]?.vendedor ?? null,
          vlrLiquido: 0,
          ultVencimento: fatura.diasAtraso ?? 0,
          multa: 0,
          juros: 0,
          total: 0,
          cobrado: false
        };
      }

      const parseCurrency = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        const cleanValue = val.toString()
          .replace(/[R$\s.]/g, '')
          .replace(',', '.');
        return parseFloat(cleanValue) || 0;
      }

      acc[clienteId].vlrLiquido += parseCurrency(fatura.vlrLiquido)
      acc[clienteId].ultVencimento = Math.max(acc[clienteId].ultVencimento, fatura.diasAtraso || 0)
      acc[clienteId].multa += parseCurrency(fatura.multa)
      acc[clienteId].juros += parseCurrency(fatura.juros)
      acc[clienteId].total += parseCurrency(fatura.total)

      acc[clienteId].cobrado = acc[clienteId].cobrado || !!fatura.cobrado

      return acc;

    }, {})

    return Object.values(grouped).map(dados => new FaturasGroupedDTO(dados))
  }

}