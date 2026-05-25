function vendedoresPresentation() {

  const { vendedores } = BootstrapIndex()

  const enuns = {
    vendedores: Object.values(vendedores()).map(i => ({ key: i.vendedor, value: i.vendedor }))
  }

  const tableHeaders = [
    { key: 'vendedor', label: 'Vendedor' },
    { key: 'email', label: 'Email' }
  ];

  const actions = [
    { type: 'edit-vendedores', title: 'Editar', icon: 'square-pen' }
  ];

  const filtersLayout = [
    {
      type: 'row',
      columns: 1,
      children: [
        { type: 'field', name: 'vendedor' },
        { type: 'field', name: 'email' }
      ]
    }
  ];

  const fields = {
    vendedor: {
      element: 'select',
      name: 'vendedor',
      label: 'Vendedor',
      options: enuns.vendedores,
      op: '='
    },
    email: {
      element: 'input',
      type: 'email',
      name: 'email',
      label: 'Email',
      op: '='
    }
  };

  return {
    tableHeaders,
    actions,
    filtersLayout,
    fields
  };
}