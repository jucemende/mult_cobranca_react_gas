function encargosPresentation() {

  const { tipoCobranca, aplicacao, recorrencia } = getEnunsEncargos()

  const styles = {
    tipoCobranca: [
      { value: tipoCobranca.JUROS, className: 'color-red' },
      { value: tipoCobranca.MULTA, className: 'color-yellow' },
    ],
    aplicacao: [
      { value: aplicacao.ATRASO, className: 'color-red' },
      { value: aplicacao.PARCELAMENTO, className: 'color-green' },
    ],
  }

  const enuns = {
    tipoCobranca: Object.entries(tipoCobranca).map(([k, v]) => ({ key: k, value: v })),
    aplicacao: Object.entries(aplicacao).map(([k, v]) => ({ key: k, value: v })),
    recorrencia: Object.entries(recorrencia).map(([k, v]) => ({ key: k, value: v })),
  }

  const tableHeaders = [
    { key: '_tipoCobranca', label: 'Tipo', style: styles.tipoCobranca },
    { key: '_aplicacao', label: 'Aplicação', style: styles.aplicacao },
    { key: '_recorrencia', label: 'Recorrência' },
    { key: '_taxaJuros', label: 'Taxa de Juros' },
  ]

  const actions = [
    { type: 'edit-encargos', title: 'Editar', icon: 'square-pen' },
    { type: 'delete-encargos', title: 'Deletar', icon: 'trash-2' },
  ]

  const filtersLayout = [
    {
      type: 'row',
      columns: 1,
      children: [
        { type: 'field', name: 'tipoCobranca' },
        { type: 'field', name: 'aplicacao' },
        { type: 'field', name: 'recorrencia' },
        { type: 'field', name: 'taxaJuros' },
      ]
    }
  ]

  const fields = {
    tipoCobranca: {
      element: 'select',
      name: 'tipoCobranca',
      label: 'Tipo de Cobrança',
      options: enuns.tipoCobranca,
      op: '='
    },
    aplicacao: {
      element: 'select',
      name: 'aplicacao',
      label: 'Aplicação',
      options: enuns.aplicacao,
      op: '='
    },
    recorrencia: {
      element: 'select',
      name: 'recorrencia',
      label: 'Recorrência',
      options: enuns.recorrencia,
      op: '='
    },
    taxaJuros: {
      element: 'input',
      name: 'taxaJuros',
      label: 'Taxa Juros',
      op: '='
    },
  }

  // Opções reutilizadas nos formulários de criação/edição
  const formFields = {
    tipoCobranca: enuns.tipoCobranca,
    aplicacao: enuns.aplicacao,
    recorrencia: enuns.recorrencia,
  }

  return { tableHeaders, actions, filtersLayout, fields, formFields }
}
