function testBootstrap(){

  const { taxaJuros, taxaMulta } = _getEncargos()

  console.log([taxaJuros, taxaMulta])

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

  return {
    clientes,
    vendedores,
    encargos
  }

}