/**
 * Insertor de Dados Seed nas Planilhas
 * Insere dados genéricos para teste diretamente nas abas do Google Sheets
 * Alinhado com a nova estrutura de seedData.gs
 * Uso: Execute insertAllSeedData() no console do Apps Script
 */

/**
 * Função principal: insere todos os dados seed nas planilhas
 * Execute esta função uma única vez para popular o banco de dados
 */
function insertAllSeedData() {
  try {
    const seedData = generateSeedData();
    
    console.log('🚀 Iniciando inserção de dados seed...');
    
    insertVendedoresData(seedData.bdVendedores);
    insertConfigEncargosData(seedData.bdConfigEncargos);
    insertConfigReguaData(seedData.bdConfigRegua);
    insertClientesData(seedData.bdClientes);
    insertFaturasAbertasData(seedData.bdFaturasAbertas);
    insertCobrancasData(seedData.bdCobrancas);
    
    console.log('✅ Todos os dados seed foram inseridos com sucesso!');
    
    return {
      success: true,
      message: 'Dados seed inseridos com sucesso',
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('❌ Erro ao inserir dados seed:', error.message);
    return {
      success: false,
      message: error.message,
      timestamp: new Date()
    };
  }
}

/**
 * Insere dados de vendedores na aba 'bdVendedores'
 * Schema: id, vendedor, email, comissao, criado_em
 */
function insertVendedoresData(vendedores) {
  console.log(`📊 Inserindo ${vendedores.length} vendedores...`);
  
  const rows = vendedores.map(vendedor => ({
    id: vendedor.id,
    vendedor: vendedor.vendedor,
    email: vendedor.email,
    comissao: vendedor.comissao,
    criado_em: vendedor.criado_em instanceof Date ? vendedor.criado_em.toISOString() : vendedor.criado_em
  }));
  
  const db = new SQSheets({ tableName: 'bdVendedores', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${vendedores.length} vendedores inseridos`);
}

/**
 * Insere dados de configuração de encargos na aba 'bdConfigEncargos'
 * Schema: id, taxa_juros, tipo_cobranca, aplicacao, recorrencia, criado_em
 */
function insertConfigEncargosData(configEncargos) {
  console.log(`📊 Inserindo ${configEncargos.length} configurações de encargos...`);
  
  const rows = configEncargos.map(config => ({
    id: config.id,
    taxa_juros: config.taxa_juros,
    tipo_cobranca: config.tipo_cobranca,
    aplicacao: config.aplicacao,
    recorrencia: config.recorrencia,
    criado_em: config.criado_em instanceof Date ? config.criado_em.toISOString() : config.criado_em
  }));
  
  const db = new SQSheets({ tableName: 'bdConfigEncargos', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${configEncargos.length} configurações de encargos inseridas`);
}

/**
 * Insere dados de configuração de régua na aba 'bdConfigRegua'
 * Schema: id, fase_regua, titulo, atraso_de, atraso_ate, acoes_regua, permite_bloqueio, mensagem_padrao, criado_em
 */
function insertConfigReguaData(configRegua) {
  console.log(`📊 Inserindo ${configRegua.length} configurações de régua...`);
  
  const rows = configRegua.map(regua => ({
    id: regua.id,
    fase_regua: regua.fase_regua,
    titulo: regua.titulo,
    atraso_de: regua.atraso_de,
    atraso_ate: regua.atraso_ate,
    acoes_regua: regua.acoes_regua,
    permite_bloqueio: regua.permite_bloqueio ? 'SIM' : 'NÃO',
    mensagem_padrao: regua.mensagem_padrao,
    criado_em: regua.criado_em instanceof Date ? regua.criado_em.toISOString() : regua.criado_em
  }));
  
  const db = new SQSheets({ tableName: 'bdConfigRegua', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${configRegua.length} configurações de régua inseridas`);
}

/**
 * Insere dados de clientes na aba 'bdClientes'
 * Schema: id, cod, id_vendedor, cliente, tipo, cnpj_cpf, telefone, email, status, permite_notificacao, obs, criado_em
 */
function insertClientesData(clientes) {
  console.log(`📊 Inserindo ${clientes.length} clientes...`);
  
  const rows = clientes.map(cliente => ({
    id: cliente.id,
    cod: cliente.cod,
    id_vendedor: cliente.id_vendedor,
    cliente: cliente.cliente,
    tipo: cliente.tipo,
    cnpj_cpf: cliente.cnpj_cpf,
    telefone: cliente.telefone,
    email: cliente.email,
    status: cliente.status,
    permite_notificacao: cliente.permite_notificacao ? 'SIM' : 'NÃO',
    obs: cliente.obs,
    criado_em: cliente.criado_em instanceof Date ? cliente.criado_em.toISOString() : cliente.criado_em
  }));
  
  const db = new SQSheets({ tableName: 'bdClientes', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${clientes.length} clientes inseridos`);
}

/**
 * Insere dados de faturas abertas na aba 'bdFaturasAbertas'
 * Schema: id, documento, cod, vencimento, vlr_liquido, possui_encargos, criado_em
 */
function insertFaturasAbertasData(faturas) {
  console.log(`📊 Inserindo ${faturas.length} faturas...`);
  
  const rows = faturas.map(fatura => ({
    id: fatura.id,
    documento: fatura.documento,
    cod: fatura.cod,
    vencimento: fatura.vencimento instanceof Date ? fatura.vencimento.toISOString().split('T')[0] : fatura.vencimento,
    vlr_liquido: fatura.vlr_liquido,
    possui_encargos: fatura.possui_encargos ? 'SIM' : 'NÃO',
    criado_em: fatura.criado_em instanceof Date ? fatura.criado_em.toISOString() : fatura.criado_em
  }));
  
  const db = new SQSheets({ tableName: 'bdFaturasAbertas', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${faturas.length} faturas inseridas`);
}

/**
 * Insere dados de cobranças na aba 'bdCobrancas'
 * Schema: id, documento, cliente_id, dias_atraso, vlr_liquido, data_contato, regua_id, canal, acao, status, criado_em
 */
function insertCobrancasData(cobrancas) {
  console.log(`📊 Inserindo ${cobrancas.length} cobranças...`);
  
  const rows = cobrancas.map(cobranca => ({
    id: cobranca.id,
    documento: cobranca.documento,
    cliente_id: cobranca.cliente_id,
    dias_atraso: cobranca.dias_atraso,
    vlr_liquido: cobranca.vlr_liquido,
    data_contato: cobranca.data_contato instanceof Date ? cobranca.data_contato.toISOString().split('T')[0] : cobranca.data_contato,
    regua_id: cobranca.regua_id,
    canal: cobranca.canal,
    acao: cobranca.acao,
    status: cobranca.status,
    criado_em: cobranca.criado_em instanceof Date ? cobranca.criado_em.toISOString() : cobranca.criado_em
  }));
  
  const db = new SQSheets({ tableName: 'bdCobrancas', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${cobrancas.length} cobranças inseridas`);
}

/**
 * Função para limpar todos os dados seed (útil para testes repetidos)
 * ⚠️ USE COM CAUTELA - DELETA TODOS OS DADOS DAS ABAS
 */
function clearAllSeedData() {
  if (!confirm('⚠️ AVISO: Isto vai DELETAR TODOS os dados das planilhas!\n\nDeseja continuar?')) {
    console.log('Limpeza cancelada');
    return;
  }
  
  try {
    console.log('🗑️ Limpando dados...');
    
    clearTableData('bdVendedores');
    clearTableData('bdConfigEncargos');
    clearTableData('bdConfigRegua');
    clearTableData('bdClientes');
    clearTableData('bdFaturasAbertas');
    clearTableData('bdCobrancas');
    
    console.log('✅ Todos os dados foram deletados');
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error.message);
  }
}

/**
 * Função auxiliar para limpar os dados de uma tabela específica
 */
function clearTableData(tableName) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(tableName);
    
    if (!sheet) {
      console.log(`⚠️ Aba ${tableName} não encontrada`);
      return;
    }
    
    const lastRow = sheet.getLastRow();
    
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
      console.log(`✅ ${tableName}: ${lastRow - 1} linhas deletadas`);
    } else {
      console.log(`✅ ${tableName}: já estava vazia`);
    }
    
  } catch (error) {
    console.error(`❌ Erro ao limpar ${tableName}:`, error.message);
  }
}

/**
 * Função para verificar quantos registros foram inseridos
 */
function getSeedDataStats() {
  const tables = [
    'bdVendedores',
    'bdConfigEncargos',
    'bdConfigRegua',
    'bdClientes',
    'bdFaturasAbertas',
    'bdCobrancas'
  ];
  
  const stats = {};
  
  tables.forEach(tableName => {
    try {
      const db = new SQSheets({ tableName, idField: 'id' });
      const data = db.load();
      stats[tableName] = data.length;
    } catch (e) {
      stats[tableName] = 'Erro ao carregar';
    }
  });
  
  console.log('📊 Estatísticas de dados:', stats);
  return stats;
}

/**
 * Função para exportar dados seed em JSON
 */
function exportSeedDataToJSON() {
  const seedData = generateSeedData();
  const json = JSON.stringify(seedData, null, 2);
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.insertSheet('SeedDataExport');
  
  sheet.getRange('A1').setValue('Seed Data Export');
  sheet.getRange('A2').setValue(json);
  
  console.log('✅ Dados exportados para a aba SeedDataExport');
  
  return seedData;
}
