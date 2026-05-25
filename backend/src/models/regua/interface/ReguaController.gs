// backend/src/models/regua/interface/ReguaController.gs

class ReguaController {

  static service() {
    return new ReguaService({
      reguaRepository: new SheetsReguaRepository()
    });
  }

  static get({ id = null, params = {} }) {

    if (id) {
      return {
        data: this.service().getById(id)
      }
    }

    return {
      data: this.service().getAll(params),
      presentation: reguaPresentation()
    };

  }

  static post({ data }) {
    const dto = new ReguaCreateDTO(data);
    return this.service().create(dto);
  }

  static put({ id, data }) {
    const dto = new ReguaCreateDTO(data);
    return this.service().update(id, dto);
  }

  static delete({ id }) {
    return this.service().delete(id);
  }

}