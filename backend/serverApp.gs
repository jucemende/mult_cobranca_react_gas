function TesteApp() {
  
  const data = {
    documento: 141881,
    codCliente: 1234,
    vencimento: '2026/02/31',
    vlrLiquido: 1500.00,
    possuiEncargos: true
  }

  /*const request ={
    method: 'POST',
    url: 'cobrancas',
    body: {
      codCliente: '9937',
      perfil: 'CRITICA',
      cliente: 'ROTHA FARMS LIVESTOCK MT',
      canal: 'AUTOMACAO',
      acao: 'NOTIFICACAO',
      status: 'FINALIZADO',
      email: 'rdalmeida@rothafarms.com;josevaldirjorge@hotmail.com',
      telefone: ''
    }
  }*/

  const request = {url: 'cobrancas-sendEmail/9937'}
  
  const res = app(request)

  console.log(res)

}

const RouterRegistry = {
  encargos: EncargosRouters,
  reguas: ReguaRouters,
  vendedors: VendedorRouters,
  clientes: ClienteRouters,
  faturas: FaturasRouters,
  cobrancas: CobrancasRouters
};

function app(request) {

  const { method = 'GET', url, body } = request;

  let [path, queryString] = url.split('?');
  const params = parseQuery(queryString);
  
  const requestParams = { method, path, body, params };

  let domain = path.split('/').filter(Boolean);
  domain = domain[0].split('-')[0];
  const router = RouterRegistry[domain];

  if (!router) {
    throw new Error(`Rota não mapeada ${domain}`);
  }

  return router(requestParams);
}

function parseQuery(queryString = '') {
  const params = {}; // Aqui cada chave será um Array
  if (!queryString) return params;

  const operatorRegex = /(>=|<=|!=|=|>|<)/;

  queryString.split('&').forEach(pair => {
    const match = pair.match(operatorRegex);
    if (!match) return;

    const op = match[0];
    const [key, rawValue] = pair.split(op);

    const value = coerceValue(decodeURIComponent(rawValue.replace(/\+/g, ' ')));

    // Se a chave ainda não existe, cria um array
    if (!params[key]) {
      params[key] = [];
    }

    // Adiciona a nova condição ao array daquela chave
    params[key].push({ op, value });
  });

  return params;
}

function coerceValue(value) {

  if (value === 'true') return true;
  if (value === 'false') return false;

  if (!isNaN(value) && value.trim() !== '') {
    return Number(value);
  }

  return value;
}
