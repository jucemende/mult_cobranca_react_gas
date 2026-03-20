function testClienteController() {
  const record = ClienteController.get({id: '424a'})

  console.log(record)
}

class ClienteController {

  static service() {
    return new ClienteService({
      clienteRepository: new SheetsClienteRepository()
    });
  }

  static get({ id = null, params = {} }) {
    
    const data = () => {
      
    const enunsStatus = getEnunsClientes().statusCliente
    const status = Object.entries(enunsStatus).map(([k, v]) => ({key: k, value: v}))

    const vendedoresIndex = BootstrapIndex().vendedores()
    const vendedores = Object.values(vendedoresIndex).map(i => ({key: i._id, value: i.vendedor}))

    if(id) {
      return {
        data: this.service().getById(id),
        status,
        vendedores
      }
    }
    
    return this.service().getAll(params);

    }

    return data()

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