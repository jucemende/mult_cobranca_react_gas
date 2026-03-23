function cobrancasPresentation() {

  const { tipoDocumento } = getEnunsFatura()
  const { canais, acoes, status } = getEnunsCobranca()

  const enuns = {
    canais: Object.entries(canais).map(([k, v]) => ({key: k, value: v})),
    acoes: Object.entries(acoes).map(([k, v]) => ({key: k, value: v})),
    status: Object.entries(status).map(([k, v]) => ({key: k, value: v}))
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
      {key: 'vencimento', label: 'Vencimento'},
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
      {key: 'dataContato', label: 'Últ. Contato'},
      {key: 'fase', label: 'Fase Atual'},
      {key: 'canal', label: 'Últ. Canal'},
      {key: 'acao', label: 'Últ. Ação'},
      {key: 'status', label: 'Result. Contato', style: styles.statusCobranca},
    ],

    actions: [
      { type: 'cobrar', title: "Reabrir Cobrança", icon: 'hand-coins' },
      { type: 'history', title: "Histórico Cobranças", icon: 'clipboard-clock' }
    ]
  }

  return {
    viewCobranca,
    tableCobrancas
  }
}