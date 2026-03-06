function TestVendedorService() {
  
  const dados = {
    id: null,
    vendedor: 'Julio',
    email: 'email@teste.com',
  }

  const service = new VendedorService({
    vendedorRepository: new SheetsVendedorRepository()
  })

  const data = service.delete('07b7786d-7d52-454b-ab52-2cdffac98bde')

  console.log(data)

}

class VendedorService {

  constructor({ vendedorRepository }) {
    this.repository = vendedorRepository;
  }

  getAll( params = {} ) {
    
    const search = params.search

    let rows = this.repository.getAll();
  
    if (search) {
      rows = this.repository.applyAdvancedSearch(rows, search.value);
    }

    if (Object.keys(params).length > 0) {
      rows = this.repository.applyFilters(rows, params);
    }

    return rows;
    
  }

  getById( id ) {
    if (!id) throw new Error('ID é obrigatório');
    return this.repository.getById(id);
  }

  create(data) {

    const props = Object.assign({}, schemaDomainVendedor(), data);

    const vendedor = Vendedor.criar(props)
  
    // Set o id após todas verificações
    vendedor.id = Utilities.getUuid()

    return this.repository.insert(vendedor);
  }

  update(id, data) {

    if (!id) throw new Error('ID é obrigatório');

    const existente = this.repository.getById(id);
    if (!existente) throw new Error('Registro não encontrado')

    const vendedor = existente.upDates(data)
    
    return this.repository.update(vendedor);
  }

  delete(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.repository.delete(id);
  }
}