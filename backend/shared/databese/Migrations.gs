/**
 * =============================================================================
 * Verifica e cria as planilhas (tabelas) necessárias para cada domínio,
 * caso ainda não existam na spreadsheet configurada pelo ambiente (ENV).
 *
 * Como usar:
 *   1. Abra o Apps Script do projeto.
 *   2. Cole este arquivo como um novo .gs.
 *   3. Execute a função `runMigrations()`.
 *
 * Restrições:
 *   - Não altera tabelas ou colunas já existentes.
 *   - Não remove dados existentes.
 *   - Respeita os nomes de tabelas e colunas definidos nos repositórios.
 * =============================================================================
 */

// ---------------------------------------------------------------------------
// Schema das tabelas — fonte de verdade das migrations
// Cada entrada define: tableName (igual ao SQSheets), idField e columns (em ordem).
// Os nomes de colunas refletem exatamente o que _toPersistence() grava.
// ---------------------------------------------------------------------------

const MIGRATION_SCHEMAS = [

  {
    tableName: 'bdVendedores',
    idField: 'id',
    columns: [
      'id',
      'vendedor',
      'email',
      'comissao',
      'criado_em',
    ],
  },
  
  {
    tableName: 'bdConfigEncargos',
    idField: 'id',
    columns: [
      'id',
      'taxa_juros',
      'tipo_cobranca',
      'aplicacao',
      'recorrencia',
      'criado_em',
    ],
  },
  
  {
    tableName: 'bdConfigRegua',
    idField: 'id',
    columns: [
      'id',
      'fase_regua',
      'titulo',
      'atraso_de',
      'atraso_ate',
      'acoes_regua',
      'permite_bloqueio',
      'mensagem_padrao',
      'criado_em',
    ],
  },

  {
    tableName: 'bdClientes',
    idField: 'id',
    columns: [
      'id',
      'cod',
      'id_vendedor',
      'cliente',
      'tipo',
      'cnpj_cpf',
      'telefone',
      'email',
      'status',
      'permite_notificacao',
      'obs',
      'criado_em',
    ],
  },

  {
    tableName: 'bdFaturasAbertas',
    idField: 'id',
    columns: [
      'id',
      'documento',
      'cod',
      'vencimento',
      'vlr_liquido',
      'possui_encargos',
      'criado_em',
    ],
  },

  {
    tableName: 'bdCobrancas',
    idField: 'id',
    columns: [
      'id',
      'documento',
      'cliente_id',
      'dias_atraso',
      'vlr_liquido',
      'data_contato',
      'regua_id',
      'canal',
      'acao',
      'status',
      'criado_em',
    ],
  },

];

// ---------------------------------------------------------------------------
// Runner principal
// ---------------------------------------------------------------------------

/**
 * Ponto de entrada da migration.
 * Execute esta função manualmente pelo editor do Apps Script.
 */
function runMigrations() {
  const ss = _getMigrationSpreadsheet();
  const results = [];

  Logger.log('========================================');
  Logger.log('Iniciando migrations...');
  Logger.log('Spreadsheet: ' + ss.getName());
  Logger.log('========================================');

  MIGRATION_SCHEMAS.forEach(schema => {
    const result = _migrateTable(ss, schema);
    results.push(result);
  });

  _logSummary(results);
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

/**
 * Retorna a spreadsheet correta de acordo com a variável ENV,
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
 */
function _getMigrationSpreadsheet() {
  return SQSheets.getSpreadsheet()
}

/**
 * Verifica se a tabela (aba) existe; se não existir, cria com o cabeçalho.
 * Se já existir, valida se todas as colunas do schema estão presentes
 * e adiciona as que estiverem faltando ao final (preserva dados existentes).
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @param {{ tableName: string, idField: string, columns: string[] }} schema
 * @returns {{ tableName: string, status: string, detail: string }}
 */
function _migrateTable(ss, schema) {
  const { tableName, columns } = schema;
  let sheet = ss.getSheetByName(tableName);

  // --- Tabela não existe: cria do zero ---
  if (!sheet) {
    sheet = ss.insertSheet(tableName);
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
    _applyHeaderStyle(sheet, columns.length);

    Logger.log('[CRIADA]  ' + tableName + ' (' + columns.length + ' colunas)');
    return { tableName, status: 'CRIADA', detail: columns.length + ' colunas criadas' };
  }

  // --- Tabela existe: valida colunas ---
  const lastCol = sheet.getLastColumn();

  if (lastCol === 0) {
    // Aba existe mas está completamente vazia
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
    _applyHeaderStyle(sheet, columns.length);

    Logger.log('[CORRIGIDA] ' + tableName + ' — aba vazia, cabeçalho inserido');
    return { tableName, status: 'CORRIGIDA', detail: 'Aba existia vazia; cabeçalho inserido' };
  }

  const existingHeaders = sheet
    .getRange(1, 1, 1, lastCol)
    .getValues()[0]
    .map(String);

  const missingColumns = columns.filter(col => !existingHeaders.includes(col));

  if (missingColumns.length === 0) {
    Logger.log('[OK]      ' + tableName + ' — nenhuma alteração necessária');
    return { tableName, status: 'OK', detail: 'Nenhuma alteração necessária' };
  }

  // Adiciona colunas faltantes ao final (não altera dados existentes)
  const nextCol = lastCol + 1;
  sheet
    .getRange(1, nextCol, 1, missingColumns.length)
    .setValues([missingColumns]);
  _applyHeaderStyle(sheet, sheet.getLastColumn());

  const added = missingColumns.join(', ');
  Logger.log('[ATUALIZADA] ' + tableName + ' — colunas adicionadas: ' + added);
  return { tableName, status: 'ATUALIZADA', detail: 'Colunas adicionadas: ' + added };
}

/**
 * Aplica formatação visual ao cabeçalho (linha 1) da aba.
 * Texto em negrito e congelar linha.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {number} totalColumns
 */
function _applyHeaderStyle(sheet, totalColumns) {
  const headerRange = sheet.getRange(1, 1, 1, totalColumns);

  headerRange
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);
}

/**
 * Exibe um resumo consolidado no Logger após rodar todas as migrations.
 *
 * @param {{ tableName: string, status: string, detail: string }[]} results
 */
function _logSummary(results) {
  Logger.log('');
  Logger.log('========================================');
  Logger.log('Resumo das migrations:');
  Logger.log('========================================');

  const counts = { CRIADA: 0, ATUALIZADA: 0, CORRIGIDA: 0, OK: 0 };

  results.forEach(r => {
    counts[r.status] = (counts[r.status] || 0) + 1;
    Logger.log('  [' + r.status + '] ' + r.tableName + ' — ' + r.detail);
  });

  Logger.log('');
  Logger.log('Total de tabelas verificadas : ' + results.length);
  Logger.log('  Criadas     : ' + counts.CRIADA);
  Logger.log('  Atualizadas : ' + counts.ATUALIZADA);
  Logger.log('  Corrigidas  : ' + counts.CORRIGIDA);
  Logger.log('  Sem alteração: ' + counts.OK);
  Logger.log('========================================');
  Logger.log('Migration concluída.');
}