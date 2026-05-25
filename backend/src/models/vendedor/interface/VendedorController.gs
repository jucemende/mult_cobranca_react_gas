class VendedorController {

  static service() {
    return new VendedorService({
      vendedorRepository: new SheetsVendedorRepository()
    });
  }

  static get({ id = null, params = {} }) {
    
    const data = () => {

      if(id) {
        return this.service().getById(id)
      }
    
      return this.service().getAll(params);

    }

    if(id) {
      return {
        data: data()
      }
    }

    return {
      data: data(),
      presentation: vendedoresPresentation()
    };

  }

  static post({ data }) {
    const dto = new VendedoresDTO(data);
    return this.service().create(dto);
  }

  static put({ id, data }) {
    const dto = new VendedoresDTO(data);
    return this.service().update(id, dto);
  }

  static delete({ id }) {
    return this.service().delete(id);
  }

}