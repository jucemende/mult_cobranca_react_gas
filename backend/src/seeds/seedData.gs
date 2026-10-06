/**
 * Gerador de Dados Seed para Testes
 * Gera dados genéricos para testes do sistema de múltiplas cobranças
 */

/**
 * Função principal para gerar todos os dados seed
 * Execute esta função para popular o banco de dados com dados de teste
 */
function generateSeedData() {
  const seedData = {
    clientes: generateClientes(),
    vendedores: generateVendedores(),
    faturas: generateFaturas(),
    encargos: generateEncargos(),
    cobrancas: generateCobrancas(),
    reguas: generateReguas(),
    dashboard: generateDashboardData()
  };
  
  console.log('Dados seed gerados com sucesso:', seedData);
  return seedData;
}

/**
 * Gera dados genéricos de clientes
 */
function generateClientes() {
  return [
    {
      id: 1,
      codCliente: 1234,
      nome: 'EMPRESA TESTE LTDA',
      cnpj: '12.345.678/0001-90',
      email: 'contato@empresateste.com.br',
      telefone: '11 3000-0001',
      endereco: 'Rua Principal, 100',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
      ativo: true,
      dataCadastro: new Date('2026-01-15'),
      perfil: 'NORMAL'
    },
    {
      id: 2,
      codCliente: 5678,
      nome: 'COMERCIAL EXPRESS SA',
      cnpj: '98.765.432/0001-10',
      email: 'vendas@comercialexpress.com.br',
      telefone: '21 3000-0002',
      endereco: 'Avenida Secundária, 200',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20040-020',
      ativo: true,
      dataCadastro: new Date('2026-02-01'),
      perfil: 'CRITICA'
    },
    {
      id: 3,
      codCliente: 9101,
      nome: 'INDUSTRIA BRASIL EIRELI',
      cnpj: '11.222.333/0001-44',
      email: 'fiscal@industriabrasil.com.br',
      telefone: '31 3000-0003',
      endereco: 'Rodovia Federal, km 50',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      cep: '30140-071',
      ativo: true,
      dataCadastro: new Date('2026-02-10'),
      perfil: 'NORMAL'
    },
    {
      id: 4,
      codCliente: 1121,
      nome: 'ROTHA FARMS LIVESTOCK MT',
      cnpj: '44.555.666/0001-77',
      email: 'rdalmeida@rothafarms.com.br',
      telefone: '62 99240-9051',
      endereco: 'Fazenda Santa Rita',
      cidade: 'Cuiabá',
      estado: 'MT',
      cep: '78000-000',
      ativo: true,
      dataCadastro: new Date('2026-02-15'),
      perfil: 'CRITICA'
    },
    {
      id: 5,
      codCliente: 3141,
      nome: 'DISTRIBUIDORA CENTRO-OESTE',
      cnpj: '77.888.999/0001-55',
      email: 'cobranca@distribuadora.com.br',
      telefone: '67 3000-0005',
      endereco: 'Zona Industrial, 300',
      cidade: 'Campo Grande',
      estado: 'MS',
      cep: '79114-900',
      ativo: true,
      dataCadastro: new Date('2026-03-01'),
      perfil: 'NORMAL'
    }
  ];
}

/**
 * Gera dados genéricos de vendedores
 */
function generateVendedores() {
  return [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@empresa.com',
      telefone: '11 98765-4321',
      regiao: 'Sul',
      ativo: true,
      dataCadastro: new Date('2026-01-10'),
      comissao: 5.0
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      telefone: '21 98765-4322',
      regiao: 'Sudeste',
      ativo: true,
      dataCadastro: new Date('2026-01-15'),
      comissao: 4.5
    },
    {
      id: 3,
      nome: 'Carlos Oliveira',
      email: 'carlos.oliveira@empresa.com',
      telefone: '31 98765-4323',
      regiao: 'Centro-Oeste',
      ativo: true,
      dataCadastro: new Date('2026-01-20'),
      comissao: 5.5
    },
    {
      id: 4,
      nome: 'Ana Costa',
      email: 'ana.costa@empresa.com',
      telefone: '41 98765-4324',
      regiao: 'Norte',
      ativo: true,
      dataCadastro: new Date('2026-02-01'),
      comissao: 4.0
    },
    {
      id: 5,
      nome: 'Roberto Lima',
      email: 'roberto.lima@empresa.com',
      telefone: '51 98765-4325',
      regiao: 'Nordeste',
      ativo: true,
      dataCadastro: new Date('2026-02-05'),
      comissao: 4.8
    }
  ];
}

/**
 * Gera dados genéricos de faturas
 */
function generateFaturas() {
  return [
    {
      id: 1,
      documento: 141881,
      codCliente: 1234,
      cliente: 'EMPRESA TESTE LTDA',
      dataEmissao: new Date('2026-03-01'),
      dataVencimento: new Date('2026-04-01'),
      valor: 1500.00,
      descricao: 'Fornecimento de Serviços - Março/2026',
      status: 'PENDENTE',
      vendedorId: 1
    },
    {
      id: 2,
      documento: 141882,
      codCliente: 5678,
      cliente: 'COMERCIAL EXPRESS SA',
      dataEmissao: new Date('2026-03-05'),
      dataVencimento: new Date('2026-04-05'),
      valor: 3200.50,
      descricao: 'Produtos Diversos - Março/2026',
      status: 'PENDENTE',
      vendedorId: 2
    },
    {
      id: 3,
      documento: 141883,
      codCliente: 9101,
      cliente: 'INDUSTRIA BRASIL EIRELI',
      dataEmissao: new Date('2026-03-10'),
      dataVencimento: new Date('2026-04-10'),
      valor: 5750.00,
      descricao: 'Material Bruto - Março/2026',
      status: 'PAGO',
      vendedorId: 3
    },
    {
      id: 4,
      documento: 141884,
      codCliente: 1121,
      cliente: 'ROTHA FARMS LIVESTOCK MT',
      dataEmissao: new Date('2026-03-15'),
      dataVencimento: new Date('2026-04-15'),
      valor: 2100.00,
      descricao: 'Suprimentos Agrícolas - Março/2026',
      status: 'PENDENTE',
      vendedorId: 3
    },
    {
      id: 5,
      documento: 141885,
      codCliente: 3141,
      cliente: 'DISTRIBUIDORA CENTRO-OESTE',
      dataEmissao: new Date('2026-03-20'),
      dataVencimento: new Date('2026-04-20'),
      valor: 8900.75,
      descricao: 'Produtos Distribuição - Março/2026',
      status: 'ATRASADO',
      vendedorId: 4
    },
    {
      id: 6,
      documento: 141886,
      codCliente: 1234,
      cliente: 'EMPRESA TESTE LTDA',
      dataEmissao: new Date('2026-02-01'),
      dataVencimento: new Date('2026-03-01'),
      valor: 1200.00,
      descricao: 'Fornecimento de Serviços - Fevereiro/2026',
      status: 'PAGO',
      vendedorId: 1
    }
  ];
}

/**
 * Gera dados genéricos de encargos
 */
function generateEncargos() {
  return [
    {
      id: 1,
      faturasId: 1,
      tipo: 'MULTA',
      percentual: 2.0,
      valor: 30.00,
      descricao: 'Multa por atraso'
    },
    {
      id: 2,
      faturasId: 1,
      tipo: 'JUROS',
      percentual: 1.0,
      valor: 15.00,
      descricao: 'Juros de mora'
    },
    {
      id: 3,
      faturasId: 2,
      tipo: 'MULTA',
      percentual: 2.0,
      valor: 64.01,
      descricao: 'Multa por atraso'
    },
    {
      id: 4,
      faturasId: 4,
      tipo: 'JUROS',
      percentual: 1.0,
      valor: 21.00,
      descricao: 'Juros de mora'
    },
    {
      id: 5,
      faturasId: 5,
      tipo: 'MULTA',
      percentual: 2.0,
      valor: 178.02,
      descricao: 'Multa por atraso'
    },
    {
      id: 6,
      faturasId: 5,
      tipo: 'JUROS',
      percentual: 1.0,
      valor: 89.01,
      descricao: 'Juros de mora'
    }
  ];
}

/**
 * Gera dados genéricos de cobranças
 */
function generateCobrancas() {
  return [
    {
      id: 424,
      faturasId: 1,
      codCliente: 1234,
      perfil: 'NORMAL',
      cliente: 'EMPRESA TESTE LTDA',
      canal: 'EMAIL',
      acao: 'NOTIFICACAO',
      status: 'FINALIZADO',
      email: 'contato@empresateste.com.br',
      telefone: '11 3000-0001',
      dataEnvio: new Date('2026-03-20'),
      dataResposta: new Date('2026-03-22'),
      resultado: 'ACEITO'
    },
    {
      id: 425,
      faturasId: 2,
      codCliente: 5678,
      perfil: 'CRITICA',
      cliente: 'COMERCIAL EXPRESS SA',
      canal: 'WHATSAPP',
      acao: 'NOTIFICACAO',
      status: 'FINALIZADO',
      email: 'vendas@comercialexpress.com.br',
      telefone: '21 3000-0002',
      dataEnvio: new Date('2026-03-21'),
      dataResposta: new Date('2026-03-23'),
      resultado: 'ACEITO'
    },
    {
      id: 426,
      faturasId: 4,
      codCliente: 1121,
      perfil: 'CRITICA',
      cliente: 'ROTHA FARMS LIVESTOCK MT',
      canal: 'WHATSAPP',
      acao: 'NOTIFICACAO',
      status: 'PENDENTE',
      email: 'rdalmeida@rothafarms.com.br',
      telefone: '62 99240-9051',
      dataEnvio: new Date('2026-03-25'),
      dataResposta: null,
      resultado: 'PENDENTE'
    },
    {
      id: 427,
      faturasId: 5,
      codCliente: 3141,
      perfil: 'NORMAL',
      cliente: 'DISTRIBUIDORA CENTRO-OESTE',
      canal: 'EMAIL',
      acao: 'COBRANCA',
      status: 'PENDENTE',
      email: 'cobranca@distribuadora.com.br',
      telefone: '67 3000-0005',
      dataEnvio: new Date('2026-03-26'),
      dataResposta: null,
      resultado: 'PENDENTE'
    },
    {
      id: 428,
      faturasId: 1,
      codCliente: 1234,
      perfil: 'NORMAL',
      cliente: 'EMPRESA TESTE LTDA',
      canal: 'TELEFONE',
      acao: 'CONFIRMACAO',
      status: 'FINALIZADO',
      email: 'contato@empresateste.com.br',
      telefone: '11 3000-0001',
      dataEnvio: new Date('2026-03-22'),
      dataResposta: new Date('2026-03-22'),
      resultado: 'CONFIRMADO'
    }
  ];
}

/**
 * Gera dados genéricos de réguas (estratégias de cobrança)
 */
function generateReguas() {
  return [
    {
      id: 1,
      nome: 'Régua Padrão',
      descricao: 'Régua padrão para clientes normais',
      ativa: true,
      etapas: [
        {
          etapa: 1,
          dias: 5,
          acao: 'NOTIFICACAO',
          canal: 'EMAIL',
          descricao: 'Notificação inicial'
        },
        {
          etapa: 2,
          dias: 10,
          acao: 'NOTIFICACAO',
          canal: 'WHATSAPP',
          descricao: 'Lembrança via WhatsApp'
        },
        {
          etapa: 3,
          dias: 15,
          acao: 'COBRANCA',
          canal: 'TELEFONE',
          descricao: 'Cobrança telefônica'
        }
      ]
    },
    {
      id: 2,
      nome: 'Régua Crítica',
      descricao: 'Régua intensiva para clientes críticos',
      ativa: true,
      etapas: [
        {
          etapa: 1,
          dias: 0,
          acao: 'NOTIFICACAO',
          canal: 'EMAIL',
          descricao: 'Notificação no dia do vencimento'
        },
        {
          etapa: 2,
          dias: 1,
          acao: 'NOTIFICACAO',
          canal: 'WHATSAPP',
          descricao: 'Lembrança no dia seguinte'
        },
        {
          etapa: 3,
          dias: 3,
          acao: 'COBRANCA',
          canal: 'TELEFONE',
          descricao: 'Cobrança telefônica urgente'
        },
        {
          etapa: 4,
          dias: 7,
          acao: 'NOTIFICACAO',
          canal: 'EMAIL',
          descricao: 'Notificação final'
        }
      ]
    },
    {
      id: 3,
      nome: 'Régua Básica',
      descricao: 'Régua simplificada',
      ativa: true,
      etapas: [
        {
          etapa: 1,
          dias: 10,
          acao: 'NOTIFICACAO',
          canal: 'EMAIL',
          descricao: 'Única notificação'
        }
      ]
    }
  ];
}

/**
 * Gera dados genéricos para dashboard
 */
function generateDashboardData() {
  return {
    resumo: {
      totalClientes: 5,
      totalVendedores: 5,
      totalFaturas: 6,
      faturasVencidas: 1,
      faturasVencendo: 2,
      faturasEmDia: 3,
      valorTotalPendente: 23750.75,
      valorTotalEncargos: 397.04,
      taxaRecuperacao: 66.67
    },
    faturasporStatus: [
      { status: 'PAGO', quantidade: 2, valor: 7150.00 },
      { status: 'PENDENTE', quantidade: 3, valor: 15950.75 },
      { status: 'ATRASADO', quantidade: 1, valor: 8900.75 }
    ],
    cobrancasporCanal: [
      { canal: 'EMAIL', quantidade: 3, taxa: 66.67 },
      { canal: 'WHATSAPP', quantidade: 2, taxa: 100.00 },
      { canal: 'TELEFONE', quantidade: 1, taxa: 100.00 }
    ],
    desempenhoVendedor: [
      { vendedor: 'João Silva', faturasRecuperadas: 1, totalFaturas: 1, percentual: 100 },
      { vendedor: 'Maria Santos', faturasRecuperadas: 1, totalFaturas: 1, percentual: 100 },
      { vendedor: 'Carlos Oliveira', faturasRecuperadas: 1, totalFaturas: 2, percentual: 50 },
      { vendedor: 'Ana Costa', faturasRecuperadas: 0, totalFaturas: 1, percentual: 0 },
      { vendedor: 'Roberto Lima', faturasRecuperadas: 0, totalFaturas: 0, percentual: 0 }
    ],
    evolucaoRecuperacao: [
      { mes: 'Janeiro', valor: 0 },
      { mes: 'Fevereiro', valor: 1200.00 },
      { mes: 'Março', valor: 5950.00 }
    ]
  };
}

/**
 * Função utilitária para exportar dados em formato JSON
 */
function exportSeedDataAsJSON() {
  const data = generateSeedData();
  return JSON.stringify(data, null, 2);
}

/**
 * Função para limpar dados seed (útil para testes repetidos)
 * CUIDADO: Use com cautela em produção
 */
function clearSeedData() {
  console.log('Função para limpar dados seed - implemente conforme necessário com seu banco de dados');
  return {
    message: 'Dados seed limpos com sucesso',
    timestamp: new Date()
  };
}
