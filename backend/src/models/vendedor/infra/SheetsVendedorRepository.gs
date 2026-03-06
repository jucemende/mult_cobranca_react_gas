function TestVendedorRepository() {
  
  const dados = {
    id: null,
    vendedor: 'Julio',
    email: 'email@teste.com',
  }

  const repository = new SheetsVendedorRepository()

  const data = repository.insert(dados)

  console.log(data)

}

class SheetsVendedorRepository extends VendedorRepository {

  constructor() {
    super();
    this.db = new SQSheets({
      tableName: 'bdVendedores',
      idField: 'id'
    });
  }

  getAll() {
    return this.db.select()
      .map(row => this._toEntity(row));
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
      'vendedor',
      'email'
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

      vendedor: row => row.vendedor,
      email: row => row.email,

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
    );
    
  }

  insert(vendedor) {
    
    this.db.insert(this._toPersistence(vendedor));
    return vendedor;

  }

  update(vendedor) {
    
    this.db.update(
      vendedor.id,
      this._toPersistence(vendedor)
    );
    return vendedor;

  }

  delete(id) {
    this.db.delete(id);
  }

  validateDuplicate(inicio, fim, ignoreId = null) {

    return this.db.select().some(row =>
      
      row.atraso_de <= fim &&
      row.atraso_ate >= inicio &&
      String(row.id) !== String(ignoreId)

    );
  }

  _toEntity(row) {
    
    return Vendedor.criar({
      id: row.id,
      vendedor: row.vendedor,
      email: row.email,
      criadoEm: row.criado_em
    })
    
  }

  _toPersistence(vendedor) {
    return {
      id: vendedor.id,
      vendedor: vendedor.vendedor,
      email: vendedor.email,
      criado_em: vendedor.criadoEm
    };
  }
}