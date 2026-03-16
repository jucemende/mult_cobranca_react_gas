class EncargosService {

  constructor({ encargosRepository }) {
    this.repository = encargosRepository;
  }

  getAll( params = {} ) {
    
    const search = params.search

    let rows = this.repository.getAll();
  
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
    const encargo = this.repository.getById(id);

    if (!encargo) throw new Error('Registro não encontrado')

    return encargo
  }

  create(data) {

    const encargo = new Encargo({
      id: Utilities.getUuid(),
      taxaJuros: data.taxaJuros,
      tipoCobranca: data.tipoCobranca,
      aplicacao: data.aplicacao,
      recorrencia: data.recorrencia,
      criadoEm: new Date().toISOString()
    });

    if (this.repository.validateDuplicate(
      encargo.tipoCobranca,
      encargo.aplicacao,
      encargo.recorrencia
    )) {
      throw new Error('Encargo duplicado');
    }

    return this.repository.insert(encargo);
  }

  update(id, data) {

    if (!id) throw new Error('ID é obrigatório');

    const existente = this.repository.getById(id);
    if (!existente) throw new Error('Registro não encontrado')

    const encargo = new Encargo({
      id,
      taxaJuros: data.taxaJuros,
      tipoCobranca: data.tipoCobranca,
      aplicacao: data.aplicacao,
      recorrencia: data.recorrencia,
      criadoEm: existente.criadoEm
    });

    if (this.repository.validateDuplicate(
      encargo.tipoCobranca,
      encargo.aplicacao,
      encargo.recorrencia,
      id
    )) {
      throw new Error('Encargo duplicado');
    }

    return this.repository.update(encargo);
  }

  delete(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.repository.delete(id);
  }
}