// ── DashboardRouters.gs ───────────────────────────────────────────────────────

function DashboardRouters(request) {

  const { method, path } = request;
  const [domain] = path.split('/').filter(Boolean);

  switch (`${method.toUpperCase()}/${domain}`) {

    case 'GET/dashboard':
      return DashboardController.get({});

    default:
      throw new Error(`Método '${method}' não suportado em dashboard`);
  }
}