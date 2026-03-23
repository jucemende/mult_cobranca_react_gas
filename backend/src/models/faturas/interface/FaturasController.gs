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

  static getInvoice({ id = null, params = {} }){
    
    const service = this._usesCases().invoicesUseCase
    
    if(id) {
      return {
        data: service.getById(id),
      }
    }
    
    return {
      data: service.getAll(params),
      presentation: faturasPresentations().tableFaturas
    }
    
  }

  static getGrouped({ id = null, params = {} }){
    
    const service = this._usesCases().invoicesGroupedUseCase
    
    if(id) {
      return service.getById(id)
    }

    return {
      data: service.getAll(params),
      presentation: faturasPresentations().tableAgruapadas
    }

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