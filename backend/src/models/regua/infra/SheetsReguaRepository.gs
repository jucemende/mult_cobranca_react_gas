function TestReguaRepository() {
  
  
  const dadosCriacao = {
    id: '2be679c9-3820-4e36-a796-5c22c7153eb9',
    faseRegua: 'LEVE',
    titulo: 'Teste',
    atrasoDe: '-15',
    atrasoAte: '-6',
    acoesRegua: 'WhatsApp',
    permiteBloqueio: false,
    mensagemPadrao: 'Mensagem',
  }

  const repository = new SheetsReguaRepository()

  const data = repository.getAll()

  console.log(data)

}

class SheetsReguaRepository extends ReguaRepository {

  constructor() {
    super();
    this.db = new SQSheets({
      tableName: 'bdConfigRegua',
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
      'faseRegua',
      'titulo',
      'acoesRegua',
      'mensagemPadrao'
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

      faseRegua: row => row.faseRegua,
      titulo: row => row.titulo,
      atrasoDe:row => row.atrasoDe,
      atrasoAte: row => row.atrasoAte,
      acoesRegua: row => row.acoesRegua,
      permiteBloqueio: row => row.permiteBloqueio,
      mensagemPadrao: row => row.mensagemPadrao,

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

  insert(regua) {
    
    this.db.insert(this._toPersistence(regua));
    return regua;

  }

  update(regua) {
    
    this.db.update(
      regua.id,
      this._toPersistence(regua)
    );
    return regua;

  }

  delete(id) {
    this.db.delete(id);
  }

  validateDuplicate(inicio, fim, ignoreId = null) {

    return this.db.select().some(row =>
      
      row._atraso_de <= fim &&
      row._atraso_ate >= inicio &&
      String(row.id) !== String(ignoreId)

    );
  }

  _toEntity(row) {
    
    return Regua.criar({
      id: row.id,
      faseRegua: row.fase_regua,
      titulo: row.titulo,
      atrasoDe:row.atraso_de,
      atrasoAte: row.atraso_ate,
      acoesRegua: row.acoes_regua,
      permiteBloqueio: row.permite_bloqueio,
      mensagemPadrao: row.mensagem_padrao,
      criadoEm: row.criado_em
    })
    
  }

  _toPersistence(regua) {
    return {
      id: regua.id,
      fase_regua: regua.faseRegua,
      titulo: regua.titulo,
      atraso_de:regua.atrasoDe,
      atraso_ate: regua.atrasoAte,
      acoes_regua: regua.acoesRegua,
      permite_bloqueio: regua.permiteBloqueio,
      mensagem_padrao: regua.mensagemPadrao,
      criado_em: regua.criadoEm
    };
  }
}