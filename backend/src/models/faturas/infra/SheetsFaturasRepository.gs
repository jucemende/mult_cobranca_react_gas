function TestFaturasRepository() {
  
  const boot = bootstrapCliente().vendedores()
  //const vendedor = bootstrapRepoCliente().vendedor
  const clientes = new SheetsClienteRepository().getById('424a')
  
  console.log(clientes)

}

class SheetsFaturasRepository extends FaturasRepository {

  constructor() {
    super();
    this.db = new SQSheets({
      tableName: 'bdFaturasAbertas',
      idField: 'id'
    });
  }

  getAll() {
    
    const rows = this.db.select()
    return rows.map(row => this._toEntity(row) );

  }

  getById(id) {
    const row = this.db.select(id)
      .find(r =>
      String(r.id) === String(id)
    ) || null;

    return row ? this._toEntity(row) : null;
    
  }

  applyAdvancedSearch(rows = [], value = '') {
    
    const searchableFields = [
      
      'documento',
      'codCliente',
      'cliente',
      'vendedor',
      'vencimento',
      'diasAtraso',
      'status',
      'ultVencimento',
      'vlrLiquido',
      'tipoDocumento',
      'multa',
      'juros',
      'total'
      
    ];

    const normalized = value.toUpperCase();

    return rows.filter(row =>
      searchableFields.some(field =>
        String(row[field] || '')
          .toUpperCase()
          .includes(normalized)
      )
    );

  }

  applyFilters(rows = [], params = {}) {

    const fieldMap = {

      documento: row => row.documento,
      codCliente: row => row.codCliente,
      cliente: row => row.cliente,
      vendedor: row => row.vendedor,
      vencimento: row => row.vencimento,
      ultVencimento: row => row.ultVencimento,
      diasAtraso: row => row.diasAtraso,
      status: row => row.status,
      vlrLiquido: row => row.vlrLiquido,
      tipoDocumento: row => row.tipoDocumento

    };

    const filters = buildFilters(params, fieldMap);

    if (!filters) {
      return rows
    }

    return rows.filter(row =>
      filters.every(({ accessor, op, value }) => {
        const operatorFn = getOperator(op);
        return operatorFn(accessor(row), value);
      })
    )
    
  }

  insert(fatura) {
    
    this.db.insert(this._toPersistence(fatura));
    return fatura;

  }

  update(fatura) {
    
    this.db.update(
      fatura.id,
      this._toPersistence(fatura)
    );
    return fatura;

  }

  delete(id) {
    this.db.delete(id);
  }

  validateDuplicate(documento, ignoreId = null) {
    return this.db.select().some(row =>
      String(row.documento) == String(documento) &&
      String(row.id) !== String(ignoreId)
    )
  }

  _toEntity(row) {
    
    return Fatura.criar({
      id: row.id,
      documento: row.documento,
      codCliente: row.cod_cliente,
      vencimento: row.vencimento,
      vlrLiquido: row.vlr_liquido,
      possuiEncargos: row.possui_encargos,
      criadoEm: row.criado_em
    })
    
  }

  _toPersistence(fatura) {
    return {
      id: fatura.id,
      documento: fatura.documento,
      cod: fatura.codCliente,
      vencimento: fatura.vencimento,
      vlr_liquido: fatura.vlrLiquido,
      possui_encargos: fatura.possuiEncargos,
      criado_em: fatura.criadoEm
    };
  }

}