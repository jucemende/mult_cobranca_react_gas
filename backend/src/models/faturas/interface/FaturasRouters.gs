function FaturasRouters(request) {

  const { method, path, body, params } = request;

  const segments = path.split('/').filter(Boolean);
  const [domain,subDomain, id] = segments;

  const controller = FaturasController;

  const SubResources = {
    faturas: 'faturas',
    agrupadas: 'agrupadas',
    cobrancas: 'cobrancas'
  }

  const resource = SubResources[subDomain] ?? SubResources[domain]
  
  switch (`${method.toUpperCase()}/${resource}`) {

    case 'GET/faturas':
      return controller.getInvoice({ id, params })
    case 'GET/agrupadas':
      return controller.getGrouped({ id, params })
    case 'GET/cobrancas':
      return controller.getCharges({ id, params })

    case 'POST/faturas':
      return controller.postInvoice({ data: body });
    case 'POST/agrupadas':
      return controller.postGrouped({ data: body });
    case 'POST/cobrancas':
      return controller.postCharges({ data: body });

    case 'PUT/faturas':
      if (!id) throw new Error('PUT requer ID');
      return controller.putInvoice({ id, data: body });
    case 'PUT/agrupadas':
      if (!id) throw new Error('PUT requer ID');
      return controller.putGrouped({ id, data: body });
    case 'PUT/cobrancas':
      if (!id) throw new Error('PUT requer ID');
      return controller.putCharges({ id, data: body });

    case 'DELETE/faturas':
      if (!id) throw new Error('DELETE requer ID');
      return controller.deleteInvoice({ id });

    default:
      throw new Error(`Método '${method}' não suportado`);
  }
}