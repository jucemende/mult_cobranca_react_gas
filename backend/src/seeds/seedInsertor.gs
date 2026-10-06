/**
 * Insertor de Dados Seed nas Planilhas
 * Insere dados genéricos para teste diretamente nas abas do Google Sheets
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
    
    insertClientesData(seedData.clientes);
    insertVendedoresData(seedData.vendedores);
    insertFaturasData(seedData.faturas);
    insertEncargosData(seedData.encargos);
    insertCobrancasData(seedData.cobrancas);
    insertReguasData(seedData.reguas);
    
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
 * Insere dados de clientes na aba 'bdClientes'
 */
function insertClientesData(clientes) {
  console.log(`📊 Inserindo ${clientes.length} clientes...`);
  
  const rows = clientes.map(cliente => ({
    id: Utilities.getUuid(),
    cod: cliente.codCliente,
    cliente: cliente.nome,
    cnpj_cpf: cliente.cnpj,
    email: cliente.email,
    telefone: cliente.telefone,
    endereco: cliente.endereco,
    cidade: cliente.cidade,
    estado: cliente.estado,
    cep: cliente.cep,
    status: cliente.perfil === 'CRITICA' ? 'ATIVO' : 'ATIVO',
    perfil: cliente.perfil,
    permite_notificacao: true,
    criado_em: cliente.dataCadastro.toISOString()
  }));
  
  const db = new SQSheets({ tableName: 'bdClientes', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${clientes.length} clientes inseridos`);
}

/**
 * Insere dados de vendedores na aba 'bdVendedores'
 */
function insertVendedoresData(vendedores) {
  console.log(`📊 Inserindo ${vendedores.length} vendedores...`);
  
  const rows = vendedores.map(vendedor => ({
    id: Utilities.getUuid(),
    vendedor: vendedor.nome,
    email: vendedor.email,
    telefone: vendedor.telefone,
    regiao: vendedor.regiao,
    comissao: vendedor.comissao,
    ativo: vendedor.ativo ? 'SIM' : 'NÃO',
    criado_em: vendedor.dataCadastro.toISOString()
  }));
  
  const db = new SQSheets({ tableName: 'bdVendedores', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${vendedores.length} vendedores inseridos`);
}

/**
 * Insere dados de faturas na aba 'bdFaturasAbertas'
 */
function insertFaturasData(faturas) {
  console.log(`📊 Inserindo ${faturas.length} faturas...`);
  
  const rows = faturas.map(fatura => ({
    id: Utilities.getUuid(),
    documento: String(fatura.documento),
    cod: String(fatura.codCliente),
    cliente: fatura.cliente,
    data_emissao: fatura.dataEmissao.toISOString().split('T')[0],
    vencimento: fatura.dataVencimento.toISOString().split('T')[0],
    vlr_liquido: fatura.valor,
    descricao: fatura.descricao,
    status: fatura.status,
    possui_encargos: fatura.valor > 5000 ? 'SIM' : 'NÃO',
    criado_em: new Date().toISOString()
  }));
  
  const db = new SQSheets({ tableName: 'bdFaturasAbertas', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${faturas.length} faturas inseridas`);
}

/**
 * Insere dados de encargos na aba 'bdConfigEncargos'
 */
function insertEncargosData(encargos) {
  console.log(`📊 Inserindo ${encargos.length} encargos...`);
  
  const rows = encargos.map(encargo => ({
    id: Utilities.getUuid(),
    fatura_id: Utilities.getUuid(), // referência à fatura
    tipo: encargo.tipo,
    percentual: encargo.percentual,
    valor: encargo.valor,
    descricao: encargo.descricao,
    criado_em: new Date().toISOString()
  }));
  
  const db = new SQSheets({ tableName: 'bdConfigEncargos', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${encargos.length} encargos inseridos`);
}

/**
 * Insere dados de cobranças na aba 'bdCobrancas'
 */
function insertCobrancasData(cobrancas) {
  console.log(`📊 Inserindo ${cobrancas.length} cobranças...`);
  
  const rows = cobrancas.map(cobranca => ({
    id: String(cobranca.id),
    documento: String(cobranca.faturasId),
    cod_cliente: String(cobranca.codCliente),
    cliente: cobranca.cliente,
    perfil: cobranca.perfil,
    canal: cobranca.canal,
    acao: cobranca.acao,
    status: cobranca.status,
    email: cobranca.email,
    telefone: cobranca.telefone,
    data_envio: cobranca.dataEnvio.toISOString().split('T')[0],
    data_resposta: cobranca.dataResposta ? cobranca.dataResposta.toISOString().split('T')[0] : '',
    resultado: cobranca.resultado,
    criado_em: new Date().toISOString()
  }));
  
  const db = new SQSheets({ tableName: 'bdCobrancas', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${cobrancas.length} cobranças inseridas`);
}

/**
 * Insere dados de réguas na aba 'bdConfigRegua'
 */
function insertReguasData(reguas) {
  console.log(`📊 Inserindo ${reguas.length} réguas...`);
  
  const rows = reguas.map(regua => ({
    id: Utilities.getUuid(),
    nome: regua.nome,
    descricao: regua.descricao,
    ativa: regua.ativa ? 'SIM' : 'NÃO',
    etapas_json: JSON.stringify(regua.etapas),
    criado_em: new Date().toISOString()
  }));
  
  const db = new SQSheets({ tableName: 'bdConfigRegua', idField: 'id' });
  db.insert(rows);
  
  console.log(`✅ ${reguas.length} réguas inseridas`);
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
    
    clearTableData('bdClientes');
    clearTableData('bdVendedores');
    clearTableData('bdFaturasAbertas');
    clearTableData('bdConfigEncargos');
    clearTableData('bdCobrancas');
    clearTableData('bdConfigRegua');
    
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
    'bdClientes',
    'bdVendedores',
    'bdFaturasAbertas',
    'bdConfigEncargos',
    'bdCobrancas',
    'bdConfigRegua'
  ];
  
  const stats = {};
  
  tables.forEach(tableName => {
    const db = new SQSheets({ tableName, idField: 'id' });
    const data = db.load();
    stats[tableName] = data.length;
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
