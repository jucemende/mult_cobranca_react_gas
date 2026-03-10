function TestClienteRepository() {
  
  const boot = bootstrapCliente().vendedores()
  //const vendedor = bootstrapRepoCliente().vendedor
  const clientes = new SheetsClienteRepository().getAll()// getById('424a')

  console.log(clientes)

}

function bootstrapCliente() {

  const vendedores = () => {
    let listVendores = new SheetsVendedorRepository().getAll()

    return Object.fromEntries(
      listVendores.map(v => [v.id, v])
    )  
  }

  return {
    vendedores
  }

}

class SheetsClienteRepository extends ClienteRepository {

  constructor() {
    super();
    this.db = new SQSheets({
      tableName: 'bdClientes',
      idField: 'id'
    });
    this._vendedores = bootstrapCliente().vendedores
  }

  getAll() {
    
    const vendedores = this._vendedores()

    return this.db.select()
      .map(row => {
        const cliente = this._toEntity(row)
        cliente.vendedor = vendedores[cliente.idVendedor]?.vendedor ?? null
        return cliente
      });

  }

  getById(id) {
    const row = this.db.select(id)
      .find(r =>
      String(r.id) === String(id)
    ) || null;

    const cliente = row ? this._toEntity(row) : null;
    
    const vendedores = this._vendedores()
    cliente.vendedor = vendedores[cliente.idVendedor]?.vendedor ?? null

    return cliente

  }

  applyAdvancedSearch(rows = [], value = '') {
    const searchableFields = [
      'cod',
      'cliente',
      '_vendedor',
      '_tipo',
      '_cnpjCpf',
      'telefone',
      'email',
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

      cod: row => row.cod,
      cliente: row => row.cliente,
      vendedor: row => row._vendedor,
      tipo: row => row._tipo,
      cnpjCpf: row => row._cnpjCpf,
      telefone: row => row.telefone,
      email: row => row.email,
      status: row => row._status,
      permiteNotificacao: row => row._permiteNotificacao,
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