function faturasPresentations() {

  const { tipoDocumento } = getEnunsFatura()
  
  const styles = {
    tipoDocumento: [
      {value: tipoDocumento.MENSALIDADE, className: 'color-green'},
      {value: tipoDocumento.REEMBOLSO, className: 'color-yellow'}
    ]
  }

  /** Configurações para tabela de faturas */
  const tableFaturas = {
    tableHeaders: [
      { key: 'documento', label: 'Mov.'},
      { key: 'cliente', label: 'Cliente'},
      { key: 'tipoDocumento', label: 'Tipo', style: styles.tipoDocumento},
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
      { type: 'edit', title: "Editar", icon: 'square-pen' },
      { type: 'cobrar', title: "Cobrar", icon: 'hand-coins' }
    ],
  }

  return {
    tableFaturas,
    tableAgruapadas
  }
}
