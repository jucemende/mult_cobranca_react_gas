function testFaturasRouters(){
  //Post: body {codCliente}
}

function CobrancasRouters(request) {

  const { method, path, body, params } = request;

  const segments = path.split('/').filter(Boolean);
  const [domain,id] = segments;
  const controller = CobrancasController;
  
  switch (`${method.toUpperCase()}/${domain}`) {
    
    case 'GET/cobrancas-list':
      return controller.getAll({ id, params })
    
    case 'GET/cobrancas-view':
      return controller.getView({ id, params })
    
    case 'POST/cobrancas':
      return controller.post({ data: body })

    case 'cobrancas-sendEmail':
      return controller.sendEmail({ id })
    
    default:
      throw new Error(`Método '${method}' não suportado`);
  }
}