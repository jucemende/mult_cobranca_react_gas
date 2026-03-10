function ClienteRouters(request) {

  const { method, path, body, params } = request;

  const segments = path.split('/').filter(Boolean);
  const [domain, id] = segments;

  const controller = ClienteController;

  switch (method.toUpperCase()) {

    case 'GET':
      return controller.get({ id, params })

    case 'POST':
      return controller.post({ data: body });

    case 'PUT':
      if (!id) throw new Error('PUT requer ID');
      return controller.put({ id, data: body });

    default:
      throw new Error(`Método '${method}' não suportado`);
  }
}