class ReguaController {

  static service() {
    return new ReguaService({
      reguaRepository: new SheetsReguaRepository()
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
    const dto = new ReguaDTO(data);
    return this.service().create(dto);
  }

  static put({ id, data }) {
    const dto = new ReguaDTO(data);
    return this.service().update(id, dto);
  }

  static delete({ id }) {
    return this.service().delete(id);
  }

}