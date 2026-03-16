function testControllerCobrancas() {
  const controller = new CobrancasController()
  const reguas = controller._usesCases().reguaUseCase.getAll()

  const { min, max } = reguas.reduce((acc, r) => ({
    min: Math.min(acc.min, r.atrasoDe),
    max: Math.max(acc.max, r.atrasoAte)
  }), { min: Infinity, max: -Infinity });

  console.log([min,max])

}

class CobrancasController {

  static _getFaturas(id) {
    
    const reguas = this._usesCases().reguaUseCase.getAll()

    const { min, max } = reguas.reduce((acc, r) => ({
      min: Math.min(acc.min, r.atrasoDe),
      max: Math.max(acc.max, r.atrasoAte)
    }), { min: Infinity, max: -Infinity });

    const params = {
      codCliente: [{op: '=', value: Number(id)}],
      diasAtraso: [{op: '>=', value: min}, {op: '<=', value: max}]
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
      sendChargeUseCase: new SendChargeUseCase(),
      reguaUseCase: new ReguaService(
        {reguaRepository: new SheetsReguaRepository()}
      )
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