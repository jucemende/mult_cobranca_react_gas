class FaturasController {

  static _usesCases() {
    return {
      invoicesUseCase: new FaturasUseCase(
        {faturasRepository: new SheetsFaturasRepository()}
      ),
      invoicesGroupedUseCase: new FaturasGroupedUseCase(
        {faturasRepository: new SheetsFaturasRepository()}
      )
    }
  }

  static get({ service, id = null, params = {} }) {
    
    const data = () => {

      if(id) {
        return service.getById(id)
      }
    
      return service.getAll(params);

    }

    return {
      data: data(),
    }

  }

  static getInvoice({ id = null, params = {} }){
    const service = this._usesCases().invoicesUseCase
    return this.get({service, id, params})
  }

  static getGrouped({ id = null, params = {} }){
    const service = this._usesCases().invoicesGroupedUseCase
    return this.get({service, id, params})
  }

  static postInvoice({ data }) {
    const service = this._usesCases().invoicesUseCase
    const dto = new FaturasCreateDTO(data);
    return service.create(dto);
  }

  static putInvoice({ id, data }) {
    const service = this._usesCases().invoicesUseCase
    const dto = new FaturasCreateDTO(data);
    return service.update(id, dto);
  }

  static deleteInvoice({ id }) {
    const service = this._usesCases().invoicesUseCase
    return service.delete(id);
  }

}