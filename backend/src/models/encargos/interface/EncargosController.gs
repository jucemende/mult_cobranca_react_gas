function testEncargosController() {

  const id = ''
  const params = {
    //search: { op: '=', value: 'JUR' },
    //taxaJuros: { op: '>=', value: 0.02 }
  }

  const controller = EncargosController

  const data = controller.get({id, params})

  console.log(data)
}


class EncargosController {

  static service() {
    return new EncargosService({
      encargosRepository: new SheetsEncargosRepository()
    });
  }

  static get({ id = null, params = {} }) {
    
    const data = () => {

      if(id) {
        return this.service().getById(id)
      }
    
      return this.service().getAll(params);

    }

    const { tableConfig, filterConfig } = getConfigEncargo()

    return {
      data: data(),
      tableConfig,
      filterConfig
    }

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