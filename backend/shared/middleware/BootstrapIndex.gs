function testBootstrap(){

  const cobrancas = BootstrapIndex().cobrancas()

  console.log(cobrancas)

}

function BootstrapIndex() {

  const clientes = () => {
    let listClientes = new SheetsClienteRepository().getAll()

    return Object.fromEntries(
      listClientes.map(v => [v.cod, v])
    )  
  }

  const vendedores = () => {
    let listVendores = new SheetsVendedorRepository().getAll()

    return Object.fromEntries(
      listVendores.map(v => [v.id, v])
    )  
  }

  const encargos = () => {
    const listaEncargos = new SheetsEncargosRepository().getAll()

    //Indexa por recorrencia
    return Object.fromEntries(
      listaEncargos.map(e => [e.recorrencia, e])
    )
  }

  const regua = () => {
    const listRegua = new SheetsReguaRepository().getAll()

    return Object.fromEntries(
      listRegua.map(r => [r.id, r])
    )
  }

  const cobrancas = () => {
    const listCobranca = new SheetsCobrancasRepository().getAll()

    return Object.fromEntries(
      listCobranca.map(c => [c.documento, c])
    )
  }

  return {
    clientes,
    vendedores,
    encargos,
    regua,
    cobrancas
  }

}