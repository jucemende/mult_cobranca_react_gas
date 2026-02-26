class SheetsEncargosRepository extends EncargosRepository {

  constructor() {
    super();
    this.db = new SQSheets({
      tableName: 'bdConfigEncargos',
      idField: 'id'
    });
  }

  select(params) {
    return this.db.getAll(params)
      .map(row => this._toEntity(row));
  }

  selectById(id, params) {
    const row = this.db.getById(id, params);
    return row ? this._toEntity(row) : null;
  }

  create(encargo) {
    
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