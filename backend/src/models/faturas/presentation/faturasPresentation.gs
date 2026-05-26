function testFaturasPresentation() {
    const teste = getEnunsFatura().tipoDocumento
    const lista = Object.entries(teste).map(([key, value]) => ({
      key: key,
      value: value
    }));
    console.log(lista)
}

function faturasPresentations() {

  const { tipoDocumento } = getEnunsFatura()
  const {clientes, vendedores} = BootstrapIndex()

  const styles = {
    tipoDocumento: [
      {value: tipoDocumento.MENSALIDADE, className: 'color-green'},
      {value: tipoDocumento.REEMBOLSO, className: 'color-yellow'}
    ]
  }

  const enuns = {
    clientes: Object.values(clientes()).map(i => ({key: i.cliente, value: i.cliente})),
    vendedores: Object.values(vendedores()).map(i => ({key: i.vendedor, value: i.vendedor})),
    tipoDocumento: Object.entries(tipoDocumento).map(([key, value]) => ({key: key, value: value}))
  }

  /** Configurações para tabela de faturas */
  const tableFaturas = {
    tableHeaders: [
      { key: 'documento', label: 'Mov.'},
      { key: 'cliente', label: 'Cliente'},
      { key: 'tipoDocumento', label: 'Tipo', style: styles.tipoDocumento},
      { key: 'vencimento', label: 'Vencimento', date: true}, 
      { key: 'vlrLiquido', label: 'Valor Líquido'},
      { key: 'diasAtraso', label: 'Dias em Atraso'}, 
      { key: 'multa', label: 'Multa'},
      { key: 'juros', label: 'Juros'},
      { key: 'total', label: 'Total Débito'},
      { key: 'cobrado', label: 'Cobrado', icon: true},
    ],

    actions: [
      { type: 'edit-fatura', title: "Editar", icon: 'square-pen' },
      //{ type: 'delete', title: "Deletar", icon: 'trash-2' },
      { type: 'cobrar', title: "Cobrar", icon: 'hand-coins' },
    ],

    filtersLayout: [
      {
        type: 'row',
        columns: 2,
        children: [
          { type: 'field', name: 'cobrado' }
        ]
      },
      {
        type: 'row',
        columns: 1,
        children: [
          { type: 'field', name: 'cliente' },
          { type: 'field', name: 'tipoDocumento' }
        ]
      },
      {
        type: 'row',
        columns: 2,
        children: [
          { type: 'field', name: 'dateMin' },
          { type: 'field', name: 'dateMax' },
          { type: 'field', name: 'diasAtrasoMin' },
          { type: 'field', name: 'diasAtrasoMax' }
        ]
      }
    ],

    fields: {
      cliente: {
        element: 'select',
        name: 'cliente',
        label: 'Cliente',
        options: enuns.clientes,
        op: '='
      },
      tipoDocumento: {
        element: 'select',
        name: 'tipoDocumento',
        label: 'Tipo',
        options: enuns.tipoDocumento,
        op: '='
      },
      diasAtrasoMin: {
        element: 'input',
        type: 'number',
        field: 'diasAtraso',
        label: 'Atrado de',
        op: '>='
      },
      diasAtrasoMax: {
        element: 'input',
        type: 'number',
        field: 'diasAtraso',
        label: 'Atrado até',
        op: '<='
      },
      cobrado: {
        element: 'radio',
        field: 'cobrado',
        label: 'Status',
        options: [
          { id: 'cobrado' ,label: 'Cobrados', value: 'true' },
          { id: 'naoCobrado',label: 'Não Cobrados', value: 'false' }
        ],
        op: '='
      },
      dateMin: {
        element: 'input',
        type: 'date',
        field: 'vencimento',
        label: 'Vencimento de',
        op: '>='
      },
      dateMax: {
        element: 'input',
        type: 'date',
        field: 'vencimento',
        label: 'Vencimento ate',
        op: '<='
      }
    }
  }
  

  /** Configurações para tabelas de faturas agrupadas por clientes */
  const tableAgruapadas = {
    tableHeaders: [
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
      { type: 'edit-clientes', title: "Editar", icon: 'square-pen' },
      { type: 'cobrar', title: "Cobrar", icon: 'hand-coins' },
    ],

    filtersLayout: [
      {
        type: 'row',
        columns: 2,
        children: [
          { type: 'field', name: 'cobrado' }
        ]
      },
      {
        type: 'row',
        columns: 1,
        children: [
          { type: 'field', name: 'cliente' },
          { type: 'field', name: 'vendedor' }
        ]
      },
      {
        type: 'row',
        columns: 2,
        children: [
          { type: 'field', name: 'diasAtrasoMin' },
          { type: 'field', name: 'diasAtrasoMax' }
        ]
      }
    ],

    fields: {
      cliente: {
        element: 'select',
        name: 'cliente',
        label: 'Cliente',
        options: enuns.clientes,
        op: '='
      },
      vendedor: {
        element: 'select',
        name: 'vendedor',
        label: 'Vendedor',
        options: enuns.vendedores,
        op: '='
      },
      diasAtrasoMin: {
        element: 'input',
        type: 'number',
        field: 'ultVencimento',
        label: 'Atrado de',
        op: '>='
      },
      diasAtrasoMax: {
        element: 'input',
        type: 'number',
        field: 'ultVencimento',
        label: 'Atrado até',
        op: '<='
      },
      cobrado: {
        element: 'radio',
        field: 'cobrado',
        label: 'Status',
        options: [
          { id: 'cobrado' ,label: 'Cobrados', value: 'true' },
          { id: 'naoCobrado',label: 'Não Cobrados', value: 'false' }
        ],
        op: '='
      }
    }
  }

  return {
    tableFaturas,
    tableAgruapadas
  }
}
