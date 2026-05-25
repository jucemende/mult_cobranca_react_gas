function cobrancasPresentation() {

  const { tipoDocumento } = getEnunsFatura()
  const { canais, acoes, status } = getEnunsCobranca()
  const { faseRegua } = getEnunsRegua()
  const { clientes } = BootstrapIndex()

  const enuns = {
    clientes: Object.values(clientes()).map(i => ({key: i.cliente, value: i.cliente})),
    canais: Object.entries(canais).map(([k, v]) => ({key: k, value: v})),
    acoes: Object.entries(acoes).map(([k, v]) => ({key: k, value: v})),
    status: Object.entries(status).map(([k, v]) => ({key: k, value: v})),
    faseRegua: Object.entries(faseRegua).map(([key, value]) => ({key: key, value: value})),
  }

  const styles = {
    
    tipoDocumento: [
      {value: tipoDocumento.MENSALIDADE, className: 'color-green'},
      {value: tipoDocumento.REEMBOLSO, className: 'color-yellow'}
    ],

    statusCobranca: [
      {value: status.PENDENTE, className: 'color-yellow'},
      {value: status.FINALIZADO, className: 'color-green'},
      {value: status.FALHA, className: 'color-red'}
    ]
  }

  /** Configurações para tabela do form gerar cobrança */
  const viewCobranca = {

    tableHeaders: [
      {key: 'documento', label: 'Mov.'},
      {key: 'tipoDocumento', label: 'Tipo', style: styles.tipoDocumento },
      {key: 'vencimento', label: 'Vencimento', date: true},
      {key: 'vlrLiquido', label: 'Valor Líquido'},
      {key: 'total', label: 'Total Débito'},
    ],

    canais: enuns.canais,
    acoes: enuns.acoes,
    status: enuns.status

  }

  /** Configurações para a tabela de cobranças pendentes */
  const tableCobrancas = {
    
    tableHeaders: [
      {key: 'codCliente', label: 'Cód.'},
      {key: 'cliente', label: 'Cliente'},
      {key: 'documento', label: 'Mov.'},
      {key: 'qtdCobrancas', label: 'Qtd. Cobranças'},
      {key: 'dataContato', label: 'Últ. Contato', date: true},
      {key: 'fase', label: 'Fase Atual'},
      {key: 'canal', label: 'Últ. Canal'},
      {key: 'acao', label: 'Últ. Ação'},
      {key: 'status', label: 'Result. Contato', style: styles.statusCobranca},
    ],

    actions: [
      { type: 'history', title: "Histórico Cobranças", icon: 'clipboard-clock' },
      { type: 'cobrar', title: "Cobrar", icon: 'hand-coins' },
    ],

    filtersLayout: [
      {
        type: 'row',
        columns: 1,
        children: [
          { type: 'field', name: 'cliente' }
        ]
      },
      {
        type: 'row',
        columns: 2,
        children: [
          { type: 'field', name: 'fase' },
          { type: 'field', name: 'canal' },
          { type: 'field', name: 'acao' },
          { type: 'field', name: 'status' },
          { type: 'field', name: 'dateMin' },
          { type: 'field', name: 'dateMax' },
          { type: 'field', name: 'qtdMin' },
          { type: 'field', name: 'qtdMax' },

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
      fase: {
        element: 'select',
        name: 'fase',
        label: 'Fase',
        options: enuns.faseRegua,
        op: '='
      },
      canal: {
        element: 'select',
        name: 'canal',
        label: 'Canais',
        options: enuns.canais,
        op: '='
      },
      acao: {
        element: 'select',
        name: 'acao',
        label: 'Acoes',
        options: enuns.acoes,
        op: '='
      },
      status: {
        element: 'select',
        name: 'status',
        label: 'Status',
        options: enuns.status,
        op: '='
      },
      qtdMin: {
        element: 'input',
        type: 'number',
        field: 'qtdCobrancas',
        label: 'Qtd. Cobranças de',
        op: '>='
      },
      qtdMax: {
        element: 'input',
        type: 'number',
        field: 'qtdCobrancas',
        label: 'Qtd. Cobranças até',
        op: '<='
      },
      dateMin: {
        element: 'input',
        type: 'date',
        field: 'dataContato',
        label: 'Contatos de',
        op: '>='
      },
      dateMax: {
        element: 'input',
        type: 'date',
        field: 'dataContato',
        label: 'Contatos ate',
        op: '<='
      }
    }
  }

  const tableHistorico = {
    tableHeaders: [
      {key: 'dataContato', label: 'Últ. Contato', date: true},
      {key: 'diasAtraso', label: 'Atraso'},
      {key: 'fase', label: 'Fase Atual'},
      {key: 'canal', label: 'Últ. Canal'},
      {key: 'acao', label: 'Últ. Ação'},
      {key: 'status', label: 'Result. Contato', style: styles.statusCobranca},
    ]
  }

  return {
    viewCobranca,
    tableCobrancas,
    tableHistorico
  }
}