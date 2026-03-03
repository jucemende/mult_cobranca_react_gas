function getConfigEncargo() {
  
  const { tipoCobranca, aplicacao, recorrencia } = getEnumsEncargos()
  
  const enuns = {
    tipos: [
      {value: tipoCobranca.JUROS, color: 'color-red'},
      {value: tipoCobranca.MULTA, color: 'color-yellow'}
    ],
    aplicacao: [
      {value: aplicacao.ATRASO, className: 'color-red'},
      {value: aplicacao.PARCELAMENTO, className: 'color-green'}
    ],
    recorrencia: [
      {value: recorrencia.DIARIA, color: 'color-red', recorrencia: 1},
      {value: recorrencia.UNICA, color: 'color-green', recorrencia: null},
      {value: recorrencia.MENSAL, color: 'color-yellow', recorrencia: 30}
    ]
  }
  
  const tableConfig = {
    tableId: 'config-encargos',

    domain: 'encargos',

    headers: [
      { key: '_taxaJuros', label: 'Taxa de Juros'},
      { key: '_tipoCobranca', label: 'Tipo de Cobrança' },
      { key: '_recorrencia', label: 'Recorrência' },
      { key: '_aplicacao', label: 'Aplicação', style: enuns.aplicacao }
    ],

    actions: [
      { type: 'edit', title: "Editar", icon: 'square-pen' },
      { type: 'delete', title: "Deletar", icon: 'trash-2' }
    ],

    records: 10,
    totais: false

  }

  const filterConfig = [
    {
      element: 'input',
      type: 'number',
      name: 'taxaJuros',
      label: 'Taxa Juros'
    },
    {
      element: 'input',
      type: 'date',
      name: 'criadoEm',
      label: 'Criado em'
    },
    {
      element: 'select',
      name: 'tipoCobranca',
      label: 'Tipo Cobrança',
      options: enuns.tipos
    },
    {
      element: 'select',
      name: 'aplicacao',
      label: 'Aplicação',
      options: enuns.aplicacao
    },
    {
      element: 'select',
      name: 'recorrencia',
      label: 'Recorrência',
      options: enuns.recorrencia
    }
  ]

  return {
    tableConfig,
    filterConfig
  }
}
