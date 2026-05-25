// backend/src/models/regua/presentation/reguaPresentation.gs

function reguaPresentation() {

  const { faseRegua } = getEnunsRegua()

  const styles = {
    faseRegua: [
      { value: faseRegua.PREVENTIVA, className: 'color-green' },
      { value: faseRegua.LEVE, className: 'color-yellow' },
      { value: faseRegua.MEDIA, className: 'color-yellow' },
      { value: faseRegua.ALTA, className: 'color-red' },
      { value: faseRegua.CRITICA, className: 'color-red' },
    ]
  }

  const enuns = {
    faseRegua: Object.entries(faseRegua).map(([k, v]) => ({ key: k, value: v })),
  }

  const tableHeaders = [
    { key: 'faseRegua', label: 'Fase', style: styles.faseRegua },
    { key: 'titulo', label: 'Título' },
    { key: 'atrasoDe', label: 'Atraso De' },
    { key: 'atrasoAte', label: 'Atraso Até' },
    { key: 'acoesRegua', label: 'Canal' },
    { key: 'permiteBloqueio', label: 'Bloqueio', icon: true },
  ]

  const actions = [
    { type: 'edit-regua', title: 'Editar', icon: 'square-pen' },
    { type: 'delete-regua', title: 'Deletar', icon: 'trash-2' },
  ]

  const filtersLayout = [
    {
      type: 'row',
      columns: 1,
      children: [
        { type: 'field', name: 'permiteBloqueio' },
        { type: 'field', name: 'faseRegua' },
        { type: 'field', name: 'acoesRegua' },
      ]
    },
    {
      type: 'row',
      columns: 2,
      children: [
        { type: 'field', name: 'atrasoDe' },
        { type: 'field', name: 'atrasoAte' },
      ]
    }
  ]

  const fields = {
    faseRegua: {
      element: 'select',
      name: 'faseRegua',
      label: 'Fase da Régua',
      options: enuns.faseRegua,
      op: '='
    },
    acoesRegua: {
      element: 'input',
      name: 'acoesRegua',
      label: 'Ações',
      op: '='
    },
    atrasoDe: {
      element: 'input',
      type: 'number',
      field: 'atrasoDe',
      name: 'atrasoDe',
      label: 'Atraso de',
      op: '>='
    },
    atrasoAte: {
      element: 'input',
      type: 'number',
      field: 'atrasoAte',
      name: 'atrasoAte',
      label: 'Atraso até',
      op: '<='
    },
    permiteBloqueio: {
      element: 'checkbox',
      name: 'permiteBloqueio',
      label: 'Permite Bloqueio',
      options: [
        { id: 'block_true', label: 'Sim', value: 'true' },
        { id: 'block_false', label: 'Não', value: 'false' }
      ],
      op: '='
    },
  }

  // Opções reutilizadas nos formulários de criação/edição
  const formFields = {
    faseRegua: enuns.faseRegua,
    acoesRegua: enuns.acoesRegua,
  }

  return { tableHeaders, actions, filtersLayout, fields, formFields }
}