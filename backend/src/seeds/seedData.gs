/**
 * Gerador de Dados Seed para Testes
 * Gera dados genéricos para testes do sistema de múltiplas cobranças
 * Alinhado com o schema definido em Migrations.gs
 */

/**
 * Função principal para gerar todos os dados seed
 * Execute esta função para popular o banco de dados com dados de teste
 */
function generateSeedData() {
  const seedData = {
    bdVendedores: generateVendedores(),
    bdConfigEncargos: generateConfigEncargos(),
    bdConfigRegua: generateConfigRegua(),
    bdClientes: generateClientes(),
    bdFaturasAbertas: generateFaturasAbertas(),
    bdCobrancas: generateCobrancas()
  };

  console.log('Dados seed gerados com sucesso:', seedData);
  return seedData;
}

/**
 * Gera dados genéricos de vendedores
 * Schema: id, vendedor, email, comissao, criado_em
 */
function generateVendedores() {
  return [
    {
      id: 1,
      vendedor: 'João Silva',
      email: 'joao.silva@empresa.com',
      comissao: 5.0,
      criado_em: new Date('2026-01-10')
    },
    {
      id: 2,
      vendedor: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      comissao: 4.5,
      criado_em: new Date('2026-01-15')
    },
    {
      id: 3,
      vendedor: 'Carlos Oliveira',
      email: 'carlos.oliveira@empresa.com',
      comissao: 5.5,
      criado_em: new Date('2026-01-20')
    },
    {
      id: 4,
      vendedor: 'Ana Costa',
      email: 'ana.costa@empresa.com',
      comissao: 4.0,
      criado_em: new Date('2026-02-01')
    },
    {
      id: 5,
      vendedor: 'Roberto Lima',
      email: 'roberto.lima@empresa.com',
      comissao: 4.8,
      criado_em: new Date('2026-02-05')
    }
  ];
}

/**
 * Gera dados genéricos de configuração de encargos
 * Schema: id, taxa_juros, tipo_cobranca, aplicacao, recorrencia, criado_em
 */
function generateConfigEncargos() {
  return [
    {
      id: 1,
      taxa_juros: 1.0,
      tipo_cobranca: 'JUROS',
      aplicacao: 'DIARIA',
      recorrencia: 'AUTOMATICA',
      criado_em: new Date('2026-01-01')
    },
    {
      id: 2,
      taxa_juros: 2.0,
      tipo_cobranca: 'MULTA',
      aplicacao: 'UNICA',
      recorrencia: 'MANUAL',
      criado_em: new Date('2026-01-01')
    },
    {
      id: 3,
      taxa_juros: 0.5,
      tipo_cobranca: 'TAXA_ADMINISTRATIVO',
      aplicacao: 'DIARIA',
      recorrencia: 'AUTOMATICA',
      criado_em: new Date('2026-01-01')
    }
  ];
}

/**
 * Gera dados genéricos de configuração de régua de cobrança
 * Schema: id, fase_regua, titulo, atraso_de, atraso_ate, acoes_regua, permite_bloqueio, mensagem_padrao, criado_em
 */
function generateConfigRegua() {
  return [
    {
      id: 1,
      fase_regua: 1,
      titulo: 'Notificação Inicial',
      atraso_de: 0,
      atraso_ate: 5,
      acoes_regua: 'EMAIL',
      permite_bloqueio: false,
      mensagem_padrao: 'Sua fatura está vencendo. Por favor, realize o pagamento.',
      criado_em: new Date('2026-01-01')
    },
    {
      id: 2,
      fase_regua: 2,
      titulo: 'Lembrança WhatsApp',
      atraso_de: 5,
      atraso_ate: 10,
      acoes_regua: 'WHATSAPP',
      permite_bloqueio: false,
      mensagem_padrao: 'Lembrança: sua fatura vencida precisa de pagamento urgente.',
      criado_em: new Date('2026-01-01')
    },
    {
      id: 3,
      fase_regua: 3,
      titulo: 'Cobrança Telefônica',
      atraso_de: 10,
      atraso_ate: 15,
      acoes_regua: 'TELEFONE',
      permite_bloqueio: true,
      mensagem_padrao: 'Cobrança: sua fatura está significativamente em atraso.',
      criado_em: new Date('2026-01-01')
    },
    {
      id: 4,
      fase_regua: 4,
      titulo: 'Notificação Final',
      atraso_de: 15,
      atraso_ate: 999,
      acoes_regua: 'EMAIL|TELEFONE',
      permite_bloqueio: true,
      mensagem_padrao: 'Última notificação antes de encaminhamento legal.',
      criado_em: new Date('2026-01-01')
    }
  ];
}

/**
 * Gera dados genéricos de clientes
 * Schema: id, cod, id_vendedor, cliente, tipo, cnpj_cpf, telefone, email, status, permite_notificacao, obs, criado_em
 */
function generateClientes() {
  return [
    {
      id: 1,
      cod: 1234,
      id_vendedor: 1,
      cliente: 'EMPRESA TESTE LTDA',
      tipo: 'JURIDICA',
      cnpj_cpf: '12.345.678/0001-90',
      telefone: '11 3000-0001',
      email: 'contato@empresateste.com.br',
      status: 'ATIVO',
      permite_notificacao: true,
      obs: 'Cliente padrão para testes',
      criado_em: new Date('2026-01-15')
    },
    {
      id: 2,
      cod: 5678,
      id_vendedor: 2,
      cliente: 'COMERCIAL EXPRESS SA',
      tipo: 'JURIDICA',
      cnpj_cpf: '98.765.432/0001-10',
      telefone: '21 3000-0002',
      email: 'vendas@comercialexpress.com.br',
      status: 'ATIVO',
      permite_notificacao: true,
      obs: 'Cliente crítico',
      criado_em: new Date('2026-02-01')
    },
    {
      id: 3,
      cod: 9101,
      id_vendedor: 3,
      cliente: 'INDUSTRIA BRASIL EIRELI',
      tipo: 'JURIDICA',
      cnpj_cpf: '11.222.333/0001-44',
      telefone: '31 3000-0003',
      email: 'fiscal@industriabrasil.com.br',
      status: 'ATIVO',
      permite_notificacao: true,
      obs: '',
      criado_em: new Date('2026-02-10')
    },
    {
      id: 4,
      cod: 1121,
      id_vendedor: 3,
      cliente: 'ROTHA FARMS LIVESTOCK MT',
      tipo: 'JURIDICA',
      cnpj_cpf: '44.555.666/0001-77',
      telefone: '62 99240-9051',
      email: 'rdalmeida@rothafarms.com.br',
      status: 'ATIVO',
      permite_notificacao: true,
      obs: 'Cliente crítico do setor agrícola',
      criado_em: new Date('2026-02-15')
    },
    {
      id: 5,
      cod: 3141,
      id_vendedor: 4,
      cliente: 'DISTRIBUIDORA CENTRO-OESTE',
      tipo: 'JURIDICA',
      cnpj_cpf: '77.888.999/0001-55',
      telefone: '67 3000-0005',
      email: 'cobranca@distribuadora.com.br',
      status: 'ATIVO',
      permite_notificacao: true,
      obs: '',
      criado_em: new Date('2026-03-01')
    }
  ];
}

/**
 * Gera dados genéricos de faturas abertas
 * Schema: id, documento, cod, vencimento, vlr_liquido, possui_encargos, criado_em
 */
function generateFaturasAbertas() {
  return [
    {
      id: 1,
      documento: 141881,
      cod: 1234,
      vencimento: new Date('2026-04-01'),
      vlr_liquido: 1500.00,
      possui_encargos: true,
      criado_em: new Date('2026-03-01')
    },
    {
      id: 2,
      documento: 141882,
      cod: 5678,
      vencimento: new Date('2026-04-05'),
      vlr_liquido: 3200.50,
      possui_encargos: true,
      criado_em: new Date('2026-03-05')
    },
    {
      id: 3,
      documento: 141883,
      cod: 9101,
      vencimento: new Date('2026-04-10'),
      vlr_liquido: 5750.00,
      possui_encargos: false,
      criado_em: new Date('2026-03-10')
    },
    {
      id: 4,
      documento: 141884,
      cod: 1121,
      vencimento: new Date('2026-04-15'),
      vlr_liquido: 2100.00,
      possui_encargos: true,
      criado_em: new Date('2026-03-15')
    },
    {
      id: 5,
      documento: 141885,
      cod: 3141,
      vencimento: new Date('2026-04-20'),
      vlr_liquido: 8900.75,
      possui_encargos: true,
      criado_em: new Date('2026-03-20')
    },
    {
      id: 6,
      documento: 141886,
      cod: 1234,
      vencimento: new Date('2026-03-25'),
      vlr_liquido: 1200.00,
      possui_encargos: false,
      criado_em: new Date('2026-02-01')
    }
  ];
}

/**
 * Gera dados genéricos de cobranças
 * Schema: id, documento, cliente_id, dias_atraso, vlr_liquido, data_contato, regua_id, canal, acao, status, criado_em
 */
function generateCobrancas() {
  return [
    {
      id: 424,
      documento: 141881,
      cliente_id: 1,
      dias_atraso: 2,
      vlr_liquido: 1500.00,
      data_contato: new Date('2026-03-20'),
      regua_id: 1,
      canal: 'EMAIL',
      acao: 'NOTIFICACAO',
      status: 'FINALIZADO',
      criado_em: new Date('2026-03-20')
    },
    {
      id: 425,
      documento: 141882,
      cliente_id: 2,
      dias_atraso: 5,
      vlr_liquido: 3200.50,
      data_contato: new Date('2026-03-21'),
      regua_id: 2,
      canal: 'WHATSAPP',
      acao: 'NOTIFICACAO',
      status: 'FINALIZADO',
      criado_em: new Date('2026-03-21')
    },
    {
      id: 426,
      documento: 141884,
      cliente_id: 4,
      dias_atraso: 8,
      vlr_liquido: 2100.00,
      data_contato: new Date('2026-03-25'),
      regua_id: 2,
      canal: 'WHATSAPP',
      acao: 'NOTIFICACAO',
      status: 'PENDENTE',
      criado_em: new Date('2026-03-25')
    },
    {
      id: 427,
      documento: 141885,
      cliente_id: 5,
      dias_atraso: 12,
      vlr_liquido: 8900.75,
      data_contato: new Date('2026-03-26'),
      regua_id: 3,
      canal: 'EMAIL',
      acao: 'COBRANCA',
      status: 'PENDENTE',
      criado_em: new Date('2026-03-26')
    },
    {
      id: 428,
      documento: 141881,
      cliente_id: 1,
      dias_atraso: 2,
      vlr_liquido: 1500.00,
      data_contato: new Date('2026-03-22'),
      regua_id: 1,
      canal: 'TELEFONE',
      acao: 'CONFIRMACAO',
      status: 'FINALIZADO',
      criado_em: new Date('2026-03-22')
    }
  ];
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
