function TestClienteService() {

  const dadosCriacao = {
    cod: '12345',
    idVendedor: 4567,
    cliente: 'JULIO CESAR',
    tipo: 'CNPJ',
    cnpjCpf: '41535140000804',
    telefone: '62 99240-9051',
    email: 'email@teste.com',
    status: 'ATIVO',
    permiteNotificacao: false,
    obs: 'Obs teste',
  }

  const service = new ClienteService({
    clienteRepository: new SheetsClienteRepository()
  })

  const cliente = service.getAll()//getById('424a')

  console.log(cliente)

}

class ClienteService {

  constructor({ clienteRepository }) {
    this.repository = clienteRepository
    this.boots = BootstrapIndex()
  }

  getAll( params = {} ) {
    
    const search = params.search
  
    const clientes = this.repository.getAll()
    const vendores = this.boots.vendedores()

    let rows = clientes.map(c => new ClienteListDTO(c, vendores[c.idVendedor]?.vendedor))

    if (search) {
      rows = this.repository.applyAdvancedSearch(rows, search[0].value);
    }

    if (Object.keys(params).length > 0) {
      rows = this.repository.applyFilters(rows, params);
    }

    return rows;
    
  }

  getById( id ) {
    if (!id) throw new Error('ID é obrigatório');
    const cliente = this.repository.getById(id)
    
    if (!cliente) throw new Error('Registro não encontrado')
    
    const vendedores = this.boots.vendedores()
    return new ClienteListDTO(cliente, vendedores[cliente.idVendedor]?.vendedor)
  }

  create(data) {

    const props = Object.assign({}, schemaDomainCliente(), data, {
      idVendedor: data.idVendedor ?? data.vendedorId
    });

    const cliente = Cliente.criar(props)
    
    // Valida as duplicidades
    this._validaDuplicidade(cliente)

    // Set o id após todas verificações
    cliente.id = Utilities.getUuid()

    return this.repository.insert(cliente);
  }

  update(id, data) {
    if (data.vendedorId && !data.idVendedor) {
      data.idVendedor = data.vendedorId;
    }

    if (!id) throw new Error('ID é obrigatório');

    const existente = this.repository.getById(id);
    if (!existente) throw new Error('Registro não encontrado')
   
    const cliente = existente.upDates(data)

    // Valida as duplicidades
    this._validaDuplicidade(cliente, id)

    return this.repository.update(cliente);
  }

  _validaDuplicidade(cliente, id = null) {

    const { existsCod, existsCpfCnpj } = this.repository.validateDuplicate(id)

    // Valida duplicidade de código do cliente
    if (existsCod(cliente.cod)){
      throw new Error(`Código de cliente n. ${cliente.cod} já cadastrado`);
    }

    // Valida duplicidade de CPF ou CNPJ
    if (existsCpfCnpj(cliente.cnpjCpf)){
      throw new Error(`${cliente.tipo} n. ${cliente.cnpjCpf} já cadastrado`);
    }

  }
}