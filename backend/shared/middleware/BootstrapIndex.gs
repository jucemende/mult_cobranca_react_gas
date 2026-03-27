function testBootstrap(){

  let faturas = BootstrapIndex().faturas()

  //vendedores = Object.values(vendedores).map(i => ({key: i._id, value: i.vendedor}))
  console.log(faturas['14188'])

}

function BootstrapIndex() {

  const clientes = () => {
    let listClientes = new SheetsClienteRepository().getAll()

    return Object.fromEntries(
      listClientes.map(v => [v.cod, v])
    )  
  }

  const faturas = () => {
    let linhasFaturas = new SheetsFaturasRepository().getAll()

    return Object.fromEntries(
      linhasFaturas.map(f => [f.documento, f])
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
    const listCobranca = new SheetsCobrancasRepository().getAll();
    
    return listCobranca.reduce((acc, c) => {
      (acc[c.documento] = acc[c.documento] || []).push(c);
      return acc;
    }, {});
  }

  return {
    clientes,
    vendedores,
    encargos,
    regua,
    cobrancas,
    faturas
  }

}