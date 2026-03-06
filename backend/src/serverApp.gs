function TesteApp() {
  
  const dados = {
    id: null,
    vendedor: 'Julio',
    email: 'email@teste.com',
  }

  const request ={
    method: 'DELETE',
    url: 'vendedor/3e84d938-3a01-4d8f-9eaa-05f177ef1651',
    //body: dados
  }

  console.log(request)

  console.log(app(request))
}

const RouterRegistry = {
  encargos: EncargosRouters,
  regua: ReguaRouters,
  vendedor: VendedorRouters
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

  const params = {};
  if (!queryString) return params;

  const operatorRegex = /(>=|<=|!=|=|>|<)/;

  queryString.split('&').forEach(pair => {

    const match = pair.match(operatorRegex);
    if (!match) return;

    const op = match[0];
    const [key, rawValue] = pair.split(op);

    const value = decodeURIComponent(
      (rawValue ?? '').replace(/\+/g, ' ')
    );

    params[key] = {
      op,
      value: coerceValue(value)
    };

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
