class ClienteController {

  static service() {
    return new ClienteService({
      clienteRepository: new SheetsClienteRepository()
    });
  }

  static get({ id = null, params = {} }) {
    
    const data = () => {

      if(id) {
        return this.service().getById(id)
      }
    
      return this.service().getAll(params);

    }

    return {
      data: data(),
    }

  }

  static post({ data }) {
    const dto = new ClienteCreatDTO(data);
    return this.service().create(dto);
  }

  static put({ id, data }) {
    const dto = new ClienteCreatDTO(data);
    return this.service().update(id, dto);
  }

}