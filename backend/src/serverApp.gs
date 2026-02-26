const RouterRegistry = {
  encargos: EncargosRouters
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

  queryString
    .split('&')
    .forEach(pair => {
      const [key, value] = pair.split('=');

      params[key] = decodeURIComponent(
        (value ?? '').replace(/\+/g, ' ')
      );
    });

  return params;
}
