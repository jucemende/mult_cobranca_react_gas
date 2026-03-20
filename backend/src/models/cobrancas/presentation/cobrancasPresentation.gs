function getConfigCobrancas() {
  
  const { status } = getEnunsCobranca()
  
  const enuns = {
    status: [
      {value: status.PENDENTE, className: 'color-yellow'},
      {value: status.FINALIZADO, className: 'color-green'},
      {value: status.FALHA, className: 'color-red'}
    ]
  }
  
  const tableConfig = {
    tableId: 'config-cobrancas',

    domain: 'cobrancas-list',
    
    headers: [
      {key: 'codCliente', label: 'Cód.'},
      {key: 'cliente', label: 'Cliente'},
      {key: 'documento', label: 'Mov.'},
      {key: 'qtdCobrancas', label: 'Qtd. Cobranças'},
      {key: 'dataContato', label: 'Últ. Contato'},
      {key: 'fase', label: 'Fase Atual'},
      {key: 'canal', label: 'Últ. Canal'},
      {key: 'acao', label: 'Últ. Ação'},
      {key: 'status', label: 'Result. Contato', style: enuns.status},
    ],

    actions: [
      { type: 'cobrar', title: "Reabrir Cobrança", icon: 'hand-coins' },
      { type: 'history', title: "Histórico Cobranças", icon: 'clipboard-clock' }
    ],

    records: 10,
    totais: false

  }

  return {
    tableConfig
  }
}
