function clientesPresentation() {
  const { statusCliente, tipoPessoa } = getEnunsClientes()
  const { vendedores, clientes } = BootstrapIndex()

  const styles = {
    status: [
      { value: statusCliente.ATIVO, className: 'color-green' },
      { value: statusCliente.CANCELADO, className: 'color-red' },
      { value: statusCliente.SUSPENSO, className: 'color-yellow' },
      { value: statusCliente.INATIVO, className: 'color-gray' }
    ]
  }

  const enuns = {
    status: Object.entries(statusCliente).map(([key, value]) => ({ key: key, value: value })),
    tipo: Object.entries(tipoPessoa).map(([key, value]) => ({ key: key, value: value })),
    vendedores: Object.values(vendedores()).map(i => ({ key: i._id, value: i.vendedor })),
    clientes: Object.values(clientes()).map(i => ({ key: i.cliente, value: i.cliente }))
  }

  const tableHeaders = [
    { key: 'cod', label: 'Cód.' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'vendedor', label: 'Vendedor' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'cnpjCpf', label: 'CPF/CNPJ' },
    { key: 'status', label: 'Status', style: styles.status }
  ];

  const actions = [
    { type: 'edit-clientes', title: 'Editar', icon: 'square-pen' }
  ];

  const filtersLayout = [
    {
      type: 'row',
      columns: 1,
      children: [
        { type: 'field', name: 'tipo' },
        { type: 'field', name: 'cnpjCpf' },
        { type: 'field', name: 'status' },
        { type: 'field', name: 'cliente' },
        { type: 'field', name: 'vendedor' }
      ]
    }
  ];

  const fields = {
    status: {
      element: 'select',
      name: 'status',
      label: 'Status',
      options: enuns.status,
      op: '='
    },
    tipo: {
      element: 'checkbox',
      name: 'tipo',
      label: 'Tipo',
      options: [
        { id: 'tipo_cpf', label: 'CPF', value: 'CPF' },
        { id: 'tipo_cnpj', label: 'CNPJ', value: 'CNPJ' }
      ],
      op: '='
    },
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
    cnpjCpf: {
      element: 'input',
      type: 'text',
      name: 'cnpjCpf',
      label: 'CPF/CNPJ',
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
