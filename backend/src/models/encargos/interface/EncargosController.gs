function teste(){
  console.log('Testado')
}

class EncargosController {

  static service() {
    return new EncargosService({
      encargosRepository: new SheetsEncargosRepository()
    });
  }

  static getAll({ params }) {
    return this.service().select( params );
  }

  static get({ id, params }) {
    return this.service().selectById(id, params);
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