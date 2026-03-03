function Teste () {

  const repository = new SheetsEncargosRepository()

  const data = repository.select2()

  console.log(data)

}

class SheetsEncargosRepository extends EncargosRepository {

  constructor() {
    super();
    this.db = new SQSheets({
      tableName: 'bdConfigEncargos',
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
      'tipoCobranca',
      'aplicacao',
      'recorrencia'
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
      taxaJuros: row => row.taxaJuros,
      tipoCobranca: row => row.tipoCobranca,
      aplicacao: row => row.aplicacao,
      recorrencia: row => row.recorrencia
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

  insert(encargo) {
    
    this.db.insert(this._toPersistence(encargo));
    return encargo;

  }

  update(encargo) {
    
    this.db.update(
      encargo.id,
      this._toPersistence(encargo)
    );
    return encargo;

  }

  delete(id) {
    this.db.delete(id);
  }

  validateDuplicate(tipoCobranca, aplicacao, recorrencia, ignoreId = null) {

    return this.db.getAll().some(row =>
      row.tipo_cobranca === tipoCobranca &&
      row.aplicacao === aplicacao &&
      row.recorrencia === recorrencia &&
      String(row.id) !== String(ignoreId)
    );
  }

  _toEntity(row) {
    return new Encargo({
      id: row.id,
      taxaJuros: row.taxa_juros,
      tipoCobranca: row.tipo_cobranca,
      aplicacao: row.aplicacao,
      recorrencia: row.recorrencia,
      criadoEm: row.criado_em
    });
  }

  _toPersistence(encargo) {
    return {
      id: encargo._id,
      taxa_juros: encargo._taxaJuros,
      tipo_cobranca: encargo._tipoCobranca,
      aplicacao: encargo._aplicacao,
      recorrencia: encargo._recorrencia,
      criado_em: encargo._criadoEm
    };
  }
}