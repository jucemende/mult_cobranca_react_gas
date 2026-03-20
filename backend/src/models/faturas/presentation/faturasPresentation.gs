function getConfigFaturasAgrupadas() {
  
  const tableConfig ={

    tableId: 'tblFaturasAgrupadas',
    url: 'faturas-agrupadas',

    headers: [
      { key: 'codCliente', label: 'Cód.'},
      { key: 'cliente', label: 'Cliente'},
      { key: 'vendedor', label: 'Responsável'},
      { key: 'vlrLiquido', label: 'Valor Líquido'},
      { key: 'ultVencimento', label: 'Últ. Venc. (dias)'},
      { key: 'multa', label: 'Multa'},
      { key: 'juros', label: 'Juros'},
      { key: 'total', label: 'Total Débito'},
      { key: 'cobrado', label: 'Cobrado', icon: true},
    ],

    actions: [
      { type: 'edit', title: "Editar", icon: 'square-pen' },
      { type: 'cobrar', title: "Cobrar", icon: 'hand-coins' }
    ],

    recordPage: 10,
    totais: true
  }

  return {
    tableConfig
  }
}

function getConfigFaturas() {
  
  const { tipoDocumento } = getEnunsFatura()
  const enuns = {
    tipo: [
      {value: tipoDocumento.MENSALIDADE, className: 'color-green'},
      {value: tipoDocumento.REEMBOLSO, className: 'color-yellow'}
    ]
  }

  const tableConfig ={

    tableId: 'tblFaturas',
    url: 'faturas-list',

    headers: [
      { key: 'documento', label: 'Mov.'},
      { key: 'cliente', label: 'Cliente'},
      { key: 'tipoDocumento', label: 'Tipo', style: enuns.tipo},
      { key: 'vencimento', label: 'Vencimento'}, 
      { key: 'vlrLiquido', label: 'Valor Líquido'},
      { key: 'diasAtraso', label: 'Dias em Atraso'}, 
      { key: 'multa', label: 'Multa'},
      { key: 'juros', label: 'Juros'},
      { key: 'total', label: 'Total Débito'},
      { key: 'cobrado', label: 'Cobrado', icon: true},
    ],

    actions: [
      { type: 'edit', title: "Editar", icon: 'square-pen' },
      { type: 'cobrar', title: "Cobrar", icon: 'hand-coins' },
      { type: 'delete', title: "Deletar", icon: 'trash-2' },
    ],

    recordPage: 10,
    totais: true
  }

  return {
    tableConfig
  }
}
