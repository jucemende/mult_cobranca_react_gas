function TestReguaService() {
  
  
  const dadosCriacao = {
    //id: '5fb2067c-df7e-4539-8fe0-11d5611ac588',
    faseRegua: 'PREVENTIVA',
    titulo: null,
    atrasoDe: '-15',
    atrasoAte: '-6',
    acoesRegua: 'WhatsApp',
    permiteBloqueio: false,
    mensagemPadrao: 'Mensagem',
  }

  const service = new ReguaService({
    reguaRepository: new SheetsReguaRepository()
  })

  const data = service.create(dadosCriacao)

  console.log(data)

}

class ReguaService {

  constructor({ reguaRepository }) {
    this.repository = reguaRepository;
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

    const props = Object.assign({}, schemaDomainRegua(), data);

    const regua = Regua.criar(props)
    
    if (this.repository.validateDuplicate(
      regua.atrasoDe,
      regua.atrasoAte
    )){
      throw new Error('Régua já existente ou conflitante');
    }

    // Set o id após todas verificações
    regua.id = Utilities.getUuid()

    return this.repository.insert(regua);
  }

  update(id, data) {

    if (!id) throw new Error('ID é obrigatório');

    const existente = this.repository.getById(id);
    if (!existente) throw new Error('Registro não encontrado')

    const regua = existente.upDates(data)
    
    if (this.repository.validateDuplicate(
      regua.atrasoDe,
      regua.atrasoAte,
      id
    )) {
      throw new Error('Régua já existente ou conflitante');
    }

    return this.repository.update(regua);
  }

  delete(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.repository.delete(id);
  }
}