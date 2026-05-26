function TestFaturasUseCase() {

  const faturas = new FaturasUseCase({faturasRepository: new SheetsFaturasRepository()}).getById('9a5f8a30-e492-437e-a899-565d7df80657')
  console.log(faturas)

}

class FaturasUseCase {

  constructor({ faturasRepository }) {
    this.repository = faturasRepository
    this.boots = BootstrapIndex()
  }

  getAll(params = {}) {
    const search = params.search;
    const faturas = this.repository.getAll();
    const clientes = this.boots.clientes();
    const cobrancas = this.boots.cobrancas();
    const { taxaJuros, taxaMulta } = this._getEncargos();

    let rows = faturas.map(f => {
      if (cobrancas[f.documento]?.length) f.cobrado = true;

      const encargo = f.diasAtraso > 0 && f.possuiEncargos
        ? f.calcularEncargos({ taxaJuros, taxaMulta })
        : null;

      return new FaturasListDTO(f, clientes[f.codCliente], encargo);
    });

    if (search) {
      rows = this.repository.applyAdvancedSearch(rows, search[0].value);
    }

    if (Object.keys(params).length > 0) {
      rows = this.repository.applyFilters(rows, params);
    }

    // Função para converter "R$ 1.250,50" em 1250.50
    const parseCurrency = (val) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const cleanValue = val.toString()
        .replace(/[R$\s.]/g, '') // Remove R$, espaços e pontos de milhar
        .replace(',', '.');       // Troca vírgula decimal por ponto
      return parseFloat(cleanValue) || 0;
    }

    const totais = rows.reduce((acc, row) => ({
      vlrLiquido: acc.vlrLiquido + parseCurrency(row.vlrLiquido),
      multa: acc.multa + parseCurrency(row.multa),
      juros: acc.juros + parseCurrency(row.juros),
      total: acc.total + parseCurrency(row.total)
    }), { vlrLiquido: 0, multa: 0, juros: 0, total: 0 });

    return { data: rows, totais };
  }


  getById( id ) {
    if (!id) throw new Error('ID é obrigatório');
    
    const fatura = this.repository.getById(id)
    if (!fatura) throw new Error('Registro não encontrado')
    
    const clientes = this.boots.clientes()
    const cobrancas = this.boots.cobrancas()

    if(cobrancas[fatura.documento]?.length) fatura.cobrado = true
    
    const { taxaJuros, taxaMulta } = this._getEncargos()

    const encargo = fatura.diasAtraso > 0 && fatura.possuiEncargos
      ? fatura.calcularEncargos({
        taxaJuros,
        taxaMulta
      })
      : null

    return new FaturasListDTO(fatura, clientes[fatura.codCliente], encargo)
  }

  create(data) {

    const props = Object.assign({}, schemaDomainFatura(), data);

    const fatura = Fatura.criar(props)
    
    if (this.repository.validateDuplicate(
      fatura.documento
    )){
      throw new Error(`Já existe uma fatura para o documento n. ${fatura.documento}`);
    }

    // Set o id após todas verificações
    fatura.id = Utilities.getUuid()

    return this.repository.insert(fatura);
  }

  update(id, data) {

    if (!id) throw new Error('ID é obrigatório');

    const existente = this.repository.getById(id);
    if (!existente) throw new Error('Registro não encontrado')

    const fatura = existente.upDates(data)
    
    if (this.repository.validateDuplicate(
      fatura.documento,
      id
    )){
      throw new Error(`Já existe uma fatura para o documento n. ${fatura.documento}`);
    }

    return this.repository.update(fatura);
  }

  delete(id) {
    if (!id) throw new Error('ID é obrigatório');
    return this.repository.delete(id);
  }

  importCsv({ data }) {

    const rows = this._normalizeImportRows(data)

    if (!rows.length) {
      throw new Error('Não foram encontradas faturas válidas.')
    }

    const uniqueRows = this._removeDuplicatedDocuments(rows)

    this._clearFaturasSheet()

    const faturas = this._createFaturas(uniqueRows)

    this._persistFaturas(faturas)

    const createdClients = this._createMissingClients(uniqueRows)

    return {
      importedFaturas: faturas.length,
      createdClients
    }
  }

  _normalizeImportRows(data) {

    return data
      .map(row => {
        
        const vencimento = this._parseDate(row['Dt. Venc.'])

        if (!vencimento) {
          return null
        }

        const documento = String(row['Cód.'] || '').trim()
        
        if (!documento) {
          return null
        }

        const codCliente = String(row['Cód.Cliente'] || '').trim()

        if (!codCliente) {
          throw new Error(
            `Cód.Cliente não pode ficar em branco para o documento ${documento}`
          )
        }

        const valor = this._parseCurrency(row['Valor'])

        if (valor === null) {
          throw new Error(
            `Valor inválido para o documento ${documento}`
          )
        }

        const historico = String(row['Histórico'] || '').trim()

        return {
          documento,
          codCliente,
          contato: String(row['Contato'] || '').trim(),
          vencimento: vencimento.toISOString(),
          vlrLiquido: valor,
          possuiEncargos: !/REEMBOLSO/i.test(historico)
        }

      })
      .filter(Boolean)
  }

  _removeDuplicatedDocuments(rows) {

    const seen = new Set()

    return rows.filter(row => {

      if (seen.has(row.documento)) {
        return false
      }

      seen.add(row.documento)

      return true
    })
  }

  _createFaturas(rows) {

    return rows.map(row => {

      const fatura = Fatura.criar({
        documento: row.documento,
        codCliente: row.codCliente,
        vencimento: row.vencimento,
        vlrLiquido: row.vlrLiquido,
        possuiEncargos: row.possuiEncargos
      })

      fatura.id = Utilities.getUuid()

      return fatura
    })
  }

  _persistFaturas(faturas) {

    if (!faturas.length) return

    const persistenceRows = faturas.map(f =>
      this.repository._toPersistence(f)
    )

    this.repository.db.insert(persistenceRows)
  }

  _createMissingClients(rows) {

    const existingClients = this.boots.clientes()

    const clientsToInsert = rows.reduce((acc, row) => {

      const cod = String(row.codCliente).trim()

      if (!cod || existingClients[cod]) {
        return acc
      }

      if (!acc[cod]) {
        acc[cod] =
          String(row.contato || `Cliente ${cod}`).trim()
          || `Cliente ${cod}`
      }

      return acc

    }, {})

    if (!Object.keys(clientsToInsert).length) {
      return 0
    }

    const clienteRepository = new SheetsClienteRepository()

    const payload = Object.entries(clientsToInsert).map(([cod, cliente]) => {

      const entity = Cliente.criar({
        id: Utilities.getUuid(),
        cod,
        idVendedor: null,
        cliente,
        tipo: null,
        cnpjCpf: null,
        telefone: null,
        email: null,
        status: 'ATIVO',
        permiteNotificacao: false,
        obs: null,
        criadoEm: new Date().toISOString()
      })

      return clienteRepository._toPersistence(entity)
    })

    clienteRepository.db.insert(payload)

    return payload.length
  }

  // Relpers
  _parseDate(value) {

    if (value == null) return null;

    const raw = String(value).trim();

    if (!raw) return null;

    // ISO
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {

      const isoDate = new Date(raw);

      return isNaN(isoDate) ? null : isoDate;
    }

    // BR => DD/MM/YYYY
    const parts = raw.split(/[\/\-\.]/).map(p => p.trim());

    if (parts.length !== 3) return null;

    let [day, month, year] = parts;

    day = Number(day);
    month = Number(month);
    year = Number(year);

    if (year < 100) {
      year += 2000;
    }

    const parsed = new Date(Date.UTC(year, month - 1, day));

    return isNaN(parsed) ? null : parsed;
  }

  _parseCurrency(value) {
    if (value == null) return null;
    const cleaned = String(value)
      .replace(/[R$\s]/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.');

    if (!cleaned || !/^[-+]?[0-9]*\.?[0-9]+$/.test(cleaned)) {
      return null;
    }

    const number = Number(cleaned);
    return Number.isFinite(number) ? number : null;
  }

  _clearFaturasSheet() {
    const sheet = this.repository.db.getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    CacheService.getScriptCache().remove('bdFaturasAbertas');
  }

  _getEncargos(){

    const enuns = getEnunsEncargos().recorrencia
    const encargos = this.boots.encargos()

    const taxaJuros = encargos[enuns.DIARIA]?._taxaJuros || 0 //0.00033,
    const taxaMulta = encargos[enuns.UNICA]?._taxaJuros || 0 //0.02

    return {
      taxaJuros,
      taxaMulta
    }

  }
}