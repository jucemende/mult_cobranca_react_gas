function TestClienteRepository() {
  
  const boot = bootstrapCliente().vendedores()
  //const vendedor = bootstrapRepoCliente().vendedor
  const clientes = new SheetsClienteRepository().getById('424a')
  
  console.log(clientes)

}

class SheetsClienteRepository extends ClienteRepository {

  constructor() {
    super();
    this.db = new SQSheets({
      tableName: 'bdClientes',
      idField: 'id'
    });
  }

  getAll() {
    
    const rows = this.db.select()
    return rows.map(row => this._toEntity(row));

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
      'cod',
      'cliente',
      'vendedor',
      'tipo',
      'cnpjCpf',
      'telefone',
      'email',
    ];

    const normalized = String(value).toUpperCase();

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

      cod: row => row.cod,
      cliente: row => row.cliente,
      vendedor: row => row.vendedor,
      tipo: row => row.tipo,
      cnpjCpf: row => row.cnpjCpf,
      telefone: row => row.telefone,
      email: row => row.email,
      status: row => row.status,
      permiteNotificacao: row => row.permiteNotificacao,
      obs: row => row.obs

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

  insert(cliente) {
    
    this.db.insert(this._toPersistence(cliente));
    return cliente;

  }

  update(cliente) {
    
    this.db.update(
      cliente.id,
      this._toPersistence(cliente)
    );
    return cliente;

  }

  validateDuplicate(ignoreId = null) {

    // Valida a dupliccidade do codigo
    const existsCod = (codigo) => {
      return this.db.select().some(row =>
        String(row.cod) == String(codigo) &&
        String(row.id) !== String(ignoreId)
      );
    }

    const existsCpfCnpj = (cnpjCpf) => {
      return this.db.select().some(row => 
        String(row.cnpj_cpf) === String(cnpjCpf) &&
        String(row.id) !== String(ignoreId)
      )
    }

    return {
      existsCod,
      existsCpfCnpj
    }
  }

  _toEntity(row) {
    
    return Cliente.criar({
      id: row.id,
      cod: row.cod,
      idVendedor: row.id_vendedor,
      cliente: row.cliente,
      tipo: row.tipo,
      cnpjCpf: row.cnpj_cpf,
      telefone: row.telefone,
      email: row.email,
      status: row.status,
      permiteNotificacao: row.permite_notificacao,
      obs: row.obs,
      criadoEm: row.criado_em
    })
    
  }

  _toPersistence(cliente) {
    return {
      id: cliente.id,
      cod: cliente.cod,
      id_vendedor: cliente.idVendedor,
      cliente: cliente.cliente,
      tipo: cliente.tipo,
      cnpj_cpf: cliente.cnpjCpf,
      telefone: cliente.telefone,
      email: cliente.email,
      status: cliente.status,
      permite_notificacao: cliente.permiteNotificacao,
      obs: cliente.obs,
      criado_em: cliente.criadoEm,
    };
  }

}