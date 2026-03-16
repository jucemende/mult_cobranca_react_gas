class CobrancasController {

  static _getFaturas(id) {
    const params = {
      codCliente: [{op: '=', value: Number(id)}],
      //status: [{op: '=', value: 'VENCIDA'}]
    }

    const service = this._usesCases().faturasUseCase

    return service.getAll(params)
  }

  static _usesCases() {
    
    return {
      faturasUseCase: new FaturasUseCase(
        {faturasRepository: new SheetsFaturasRepository()}
      ),
      cobrancasUseCase: new CobrancasUseCase(
        {cobrancasRepository: new SheetsCobrancasRepository()}
      ),
      sendChargeUseCase: new SendChargeUseCase()
    }
  }

  static getAll({ id = null, params = {} }){
    return this._usesCases().cobrancasUseCase.getAll(params)
  }

  static getView({ id = null, params = {} }) {
    const faturas = this._getFaturas(id)
    return this._usesCases().cobrancasUseCase.getView(faturas)
  }

  static post({ data }) {
    const dto = new CobrancasCreateDTO(data);
    const faturas = this._getFaturas(dto.codCliente)
    dto.faturas = faturas
    return this._usesCases().cobrancasUseCase.create(dto);
  }

  static sendCharge({ data }) {
    data.view = this.getView({ id: data.codCliente })
    return this._usesCases().sendChargeUseCase.send({ data })
  }

}