function testFaturasRouters(){
  const req = {
    method: 'GET',
    path: 'faturas-list/14188a',
    body: undefined,
    params: {}
  }
  console.log(FaturasRouters(req))
}

function FaturasRouters(request) {

  const { method, path, body, params } = request;

  const segments = path.split('/').filter(Boolean);
  const [domain,id] = segments;
  const controller = FaturasController;
  
  switch (`${method.toUpperCase()}/${domain}`) {

    case 'GET/faturas-list':
      return controller.getInvoice({ id, params })
    case 'POST/faturas':
      return controller.postInvoice({ data: body });
    case 'POST/faturas-import':
      return controller.importInvoice({ data: body });
    case 'PUT/faturas':
      if (!id) throw new Error('PUT requer ID');
      return controller.putInvoice({ id, data: body });
    case 'DELETE/faturas':
      if (!id) throw new Error('DELETE requer ID');
      return controller.deleteInvoice({ id });

    case 'GET/faturas-agrupadas':
      return controller.getGrouped({ id, params })
        
    default:
      throw new Error(`Método '${method}' não suportado`);
  }
}