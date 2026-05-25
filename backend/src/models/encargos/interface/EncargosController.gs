// backend/src/models/encargos/interface/EncargosController.gs

function testEncargosController() {

  const id = ''
  const params = {}

  const controller = EncargosController

  const data = controller.get({ id, params })

  console.log(data)
}


class EncargosController {

  static service() {
    return new EncargosService({
      encargosRepository: new SheetsEncargosRepository()
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
      presentation: encargosPresentation()
    };

  }

  static post({ data }) {
    const dto = new EncargosDTO(data);
    return this.service().create(dto);
  }

  static put({ id, data }) {
    const dto = new EncargosDTO(data);
    return this.service().update(id, dto);
  }

  static delete({ id }) {
    return this.service().delete(id);
  }

}