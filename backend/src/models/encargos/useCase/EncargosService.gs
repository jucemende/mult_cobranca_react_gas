class EncargosService {

  constructor({ encargosRepository }) {
    this.repository = encargosRepository;
  }

  select() {
    return this.repository.select();
  }

  selectById(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.repository.selectById(id);
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

    return this.repository.create(encargo);
  }

  update(id, data) {

    if (!id) throw new Error('ID é obrigatório');

    const existente = this.repository.selectById(id);
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