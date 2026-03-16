function TestCobrancaRepository() {
  const data =[
    {
      documento: "1234",
      clienteId: "5678",
      diasAtraso: "10",
      vlrLiquido: 500.50,
      dataContato: "2026/02/31",
      reguaId: "1234",
      canal: 'WHATSAPP',
      acao: "LEMBRETE",
      status: "PENDENTE",
    }
  ]
  
  const repo = new SheetsCobrancasRepository

  const cobrancas = repo.insert(data)

  console.log(cobrancas)  
}

class SheetsCobrancasRepository extends CobrancasRepository {

  constructor() {
    super();
    this.db = new SQSheets({
      tableName: 'bdCobrancas',
      idField: 'id'
    });
  }

  getAll() {
    
    const rows = this.db.select()
    return rows.map(row => this._toEntity(row) );

  }

  applyAdvancedSearch(rows = [], value = '') {
    
    const searchableFields = [
      
      'documento',
      'cliente',
      'diasAtraso',
      'vlrLiquido',
      'dataContato',
      'regua',
      'canal',
      'acao',
      'status',,
      
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
      cliente: row => row.cliente,
      codCliente: row => row.codCliente,
      dataContato: row => row.dataContato,
      regua: row => row.regua,
      canal: row => row.canal,
      acao: row => row.acao,
      status: row => row.status,
      criadoEm: row => row.criadoEm

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

  insert(cobrancas) {
    
    this.db.insert(this._toPersistence(cobrancas));
    return cobrancas;

  }

  _toEntity(row) {
    
    return Cobranca.criar({
      id: row.id,
      documento: row.documento,
      codCliente: row.cod_cliente,
      diasAtraso: row.dias_atraso,
      vlrLiquido: row.vlr_liquido,
      dataContato: row.data_contato,
      reguaId: row.regua_id,
      canal: row.canal,
      acao: row.acao,
      status: row.status,
      criadoEm: row.criado_em
    })
    
  }

  _toPersistence(cobrancas) {
    
    return cobrancas.map(cobranca => {
      return {
        id: cobranca.id,
        documento: cobranca.documento,
        cliente_id: cobranca.codCliente,
        dias_atraso: cobranca.diasAtraso,
        vlr_liquido: cobranca.vlrLiquido,
        data_contato: cobranca.dataContato,
        regua_id: cobranca.reguaId,
        canal: cobranca.canal,
        acao: cobranca.acao,
        status: cobranca.status,
        criado_em: cobranca.criadoEm
      }
    });
  }

}