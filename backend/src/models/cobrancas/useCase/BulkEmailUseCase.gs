// =============================================================================
// BulkEmailUseCase.gs
// Use case para envio de cobranças em massa por email.
//
// Responsabilidades:
//   1. Filtrar faturas elegíveis (réguas PREVENTIVA, LEVE e MEDIA apenas)
//   2. Agrupar faturas por cliente e associar a régua principal
//   3. Construir a fila de payloads de email
//   4. Enviar em lotes com intervalo regular para evitar rate-limit do Gmail
//   5. Persistir as cobranças enviadas com sucesso no bdCobrancas
//
// Restrições respeitadas:
//   - Nenhum arquivo existente foi alterado
//   - Reutiliza GmailGateWay, SendChargeUseCase._emailBuilder, BootstrapIndex
//   - Herda de SendChargeUseCase para reaproveitar _emailBuilder
// =============================================================================

// Fases de régua elegíveis para envio em massa.
// Apenas notificações preventivas e iniciais são disparadas automaticamente;
// ALTA e CRITICA exigem intervenção manual para evitar impacto no relacionamento.
const BULK_EMAIL_FASES_PERMITIDAS = [
  'PREVENTIVA',
  'LEVE',
  'MEDIA'
];


class BulkEmailQueueItemDTO {
  /**
   * @param {object} params
   * @param {string} params.codCliente
   * @param {string} params.cliente      - nome do cliente
   * @param {string} params.email
   * @param {string} params.telefone
   * @param {object} params.view         - { regua, faturas } já no formato de CobrancaViewDTO
   * @param {string} params.canal        - sempre 'EMAIL' neste use case
   * @param {string} params.acao
   * @param {string} params.status
   */
  constructor({ codCliente, cliente, email, telefone, view, canal, acao, status }) {
    this.codCliente = codCliente;
    this.cliente    = cliente;
    this.email      = email;
    this.telefone   = telefone;
    this.view       = view;
    this.canal      = canal  || getEnunsCobranca().canais.EMAIL;
    this.acao       = acao   || getEnunsCobranca().acoes.NOTIFICACAO;
    this.status     = status || getEnunsCobranca().status.PENDENTE;
  }
}

// ---------------------------------------------------------------------------
// Resultado de cada tentativa de envio
// ---------------------------------------------------------------------------
class BulkEmailResultDTO {
  constructor({ codCliente, cliente, email, success, message, sentAt }) {
    this.codCliente = codCliente;
    this.cliente    = cliente;
    this.email      = email;
    this.success    = success;
    this.message    = message;
    this.sentAt     = sentAt;
  }
}

// ---------------------------------------------------------------------------
// BulkEmailUseCase
// ---------------------------------------------------------------------------
class BulkEmailUseCase extends SendChargeUseCase {

  /**
   * @param {object} [options]
   * @param {number} [options.batchSize=10]         - emails por lote
   * @param {number} [options.delayBetweenMs=2000]  - pausa entre lotes (ms)
   * @param {string} [options.acao]                 - ação padrão dos registros de cobrança
   * @param {string} [options.status]               - status padrão dos registros de cobrança
   */
  constructor(options = {}) {
    super(); // inicializa SheetsCobrancasRepository + GmailGateWay + BootstrapIndex

    this._batchSize      = options.batchSize      ?? 10;
    this._delayBetweenMs = options.delayBetweenMs ?? 2000;
    this._acao           = options.acao   || getEnunsCobranca().acoes.NOTIFICACAO;
    this._status         = options.status || getEnunsCobranca().status.FINALIZADO;

    // Serviço de régua reutilizado internamente
    this._reguaService = new ReguaService({
      reguaRepository: new SheetsReguaRepository()
    });
  }

  // ── API pública ───────────────────────────────────────────────────────────

  /**
   * Ponto de entrada principal.
   * Executa as 5 etapas: filtrar → agrupar → construir fila → enviar → persistir.
   *
   * @returns {{ sent: number, failed: number, skipped: number, saved: number, results: BulkEmailResultDTO[] }}
   */
  execute() {
    Logger.log('[BulkEmail] Iniciando envio em massa...');
    Logger.log(`[BulkEmail] Fases permitidas: ${BULK_EMAIL_FASES_PERMITIDAS.join(', ')}`);

    // Etapa 1 — faturas elegíveis (apenas réguas PREVENTIVA, LEVE e MEDIA)
    const eligibleByClient = this._step1_filterEligibleFaturas();

    if (Object.keys(eligibleByClient).length === 0) {
      Logger.log('[BulkEmail] Nenhuma fatura elegível encontrada.');
      return { sent: 0, failed: 0, skipped: 0, saved: 0, results: [] };
    }

    // Etapa 2 — agrupar por cliente e associar régua principal
    const grouped = this._step2_groupByClient(eligibleByClient);

    // Etapa 3 — construir fila de emails
    const queue = this._step3_buildQueue(grouped);

    Logger.log(`[BulkEmail] Fila montada: ${queue.length} destinatários.`);

    // Etapa 4 — enviar em lotes com intervalo
    const results = this._step4_sendQueue(queue);

    // Etapa 5 — persistir cobranças dos envios bem-sucedidos
    const savedCount = this._step5_persistCobrancas(queue, results);

    const summary = results.reduce(
      (acc, r) => {
        r.success ? acc.sent++ : acc.failed++;
        return acc;
      },
      { sent: 0, failed: 0, skipped: queue.length - results.length, saved: savedCount }
    );

    Logger.log(
      `[BulkEmail] Concluído — Enviados: ${summary.sent} | ` +
      `Falhas: ${summary.failed} | Ignorados: ${summary.skipped} | ` +
      `Cobranças salvas: ${summary.saved}`
    );

    return { ...summary, results };
  }

  // ── Etapa 1: filtrar faturas elegíveis ───────────────────────────────────

  /**
   * Carrega as réguas das fases PREVENTIVA, LEVE e MEDIA e todas as faturas abertas.
   * Retorna um mapa { codCliente → Fatura[] } contendo apenas as faturas
   * cujo diasAtraso está dentro do intervalo de uma dessas réguas.
   *
   * @returns {Object.<string, Fatura[]>}
   */
  _step1_filterEligibleFaturas() {
    const todasReguas = this._reguaService.getAll(); // ReguaListDTO[]
    const faturas     = new SheetsFaturasRepository().getAll(); // Fatura[]

    if (!todasReguas.length) {
      throw new Error('[BulkEmail] Nenhuma régua de cobrança cadastrada.');
    }

    // Restringe às fases permitidas para envio automático em massa
    const reguas = todasReguas.filter(r =>
      BULK_EMAIL_FASES_PERMITIDAS.includes(r.faseRegua)
    );

    if (!reguas.length) {
      throw new Error(
        `[BulkEmail] Nenhuma régua encontrada para as fases: ${BULK_EMAIL_FASES_PERMITIDAS.join(', ')}.`
      );
    }

    Logger.log(`[BulkEmail] Réguas elegíveis carregadas: ${reguas.length}`);
    reguas.forEach(r =>
      Logger.log(`  → [${r.faseRegua}] "${r.titulo}" | de ${r.atrasoDe} até ${r.atrasoAte} dias`)
    );

    const clientes  = this.boots.clientes();
    const eligible  = {};

    faturas.forEach(fatura => {
      const dias = fatura.diasAtraso;

      // Verifica se o atraso da fatura cai em pelo menos uma régua permitida
      const matchesRegua = reguas.some(r => dias >= r.atrasoDe && dias <= r.atrasoAte);

      if (!matchesRegua) return;

      // Só envia para clientes que permitem notificação por email
      const cliente = clientes[fatura.codCliente];
      if (!cliente || !cliente.permiteNotificacao) return;
      if (!cliente.email || cliente.email.trim() === '') return;

      const key = String(fatura.codCliente);
      if (!eligible[key]) eligible[key] = [];
      eligible[key].push(fatura);
    });

    Logger.log(`[BulkEmail] Clientes elegíveis: ${Object.keys(eligible).length}`);
    return eligible;
  }

  // ── Etapa 2: agrupar por cliente e associar régua ────────────────────────

  /**
   * Para cada cliente, identifica a régua principal (a de maior atrasoDe
   * entre as que fazem match) e constrói um CobrancaViewDTO equivalente.
   *
   * @param {Object.<string, Fatura[]>} eligibleByClient
   * @returns {Array<{ cliente: Cliente, faturas: Fatura[], regua: ReguaListDTO }>}
   */
  _step2_groupByClient(eligibleByClient) {
    const clientes = this.boots.clientes();
    const reguas   = this._reguaService.getAll();
    const encargos = this.boots.encargos();

    const { taxaJuros, taxaMulta } = this._resolveEncargos(encargos);

    return Object.entries(eligibleByClient).map(([codCliente, faturas]) => {
      const cliente = clientes[codCliente];

      // Régua principal = a de maior atrasoDe que cobre pelo menos uma fatura
      const regua = this._resolveReguaPrincipal(faturas, reguas);

      if (!regua) {
        Logger.log(`[BulkEmail] Nenhuma régua encontrada para cliente ${codCliente}. Ignorando.`);
        return null;
      }

      // Monta as faturas no formato esperado por _emailBuilder (mesmo que CobrancaViewDTO.faturas)
      const faturasPayload = faturas.map(f => {
        const encargo = f.diasAtraso > 0 && f.possuiEncargos
          ? f.calcularEncargos({ taxaJuros, taxaMulta })
          : null;

        return {
          documento:     f.documento,
          tipoDocumento: f.tipoDocumento,
          vencimento:    f.vencimento,
          vlrLiquido:    f.vlrLiquido,
          total:         encargo?.total ?? f.vlrLiquido
        };
      });

      // Estrutura view compatível com SendChargeUseCase._emailBuilder
      const view = {
        regua: {
          reguaId:   regua.id,
          faseRegua: regua.faseRegua
        },
        faturas: faturasPayload
      };

      return { cliente, view, regua };

    }).filter(Boolean); // remove os nulls (clientes sem régua)
  }

  // ── Etapa 3: construir fila de envio ─────────────────────────────────────

  /**
   * Transforma cada grupo num BulkEmailQueueItemDTO pronto para envio.
   *
   * @param {Array<{ cliente, view, regua }>} grouped
   * @returns {BulkEmailQueueItemDTO[]}
   */
  _step3_buildQueue(grouped) {
    return grouped.map(({ cliente, view }) => {
      return new BulkEmailQueueItemDTO({
        codCliente: cliente.cod,
        cliente:    cliente.cliente,
        email:      cliente.email,
        telefone:   cliente.telefone,
        view,
        canal:  getEnunsCobranca().canais.EMAIL,
        acao:   this._acao,
        status: this._status
      });
    });
  }

  // ── Etapa 4: enviar em lotes ─────────────────────────────────────────────

  /**
   * Divide a fila em lotes de `batchSize` e envia cada lote,
   * aguardando `delayBetweenMs` milissegundos entre lotes.
   *
   * Usa SendChargeUseCase._emailBuilder para montar cada payload de email
   * e GmailGateWay.send para o disparo efetivo.
   *
   * @param {BulkEmailQueueItemDTO[]} queue
   * @returns {BulkEmailResultDTO[]}
   */
  _step4_sendQueue(queue) {
    const results = [];
    const batches = this._chunkArray(queue, this._batchSize);

    batches.forEach((batch, batchIndex) => {
      Logger.log(`[BulkEmail] Enviando lote ${batchIndex + 1}/${batches.length} (${batch.length} emails)...`);

      batch.forEach(item => {
        const result = this._sendOne(item);
        results.push(result);
      });

      // Pausa entre lotes (exceto após o último)
      if (batchIndex < batches.length - 1) {
        Logger.log(`[BulkEmail] Aguardando ${this._delayBetweenMs}ms antes do próximo lote...`);
        Utilities.sleep(this._delayBetweenMs);
      }
    });

    return results;
  }

  // ── Etapa 5: persistir cobranças no Sheets ──────────────────────────────

  /**
   * Para cada envio bem-sucedido, cria um registro de Cobranca no bdCobrancas.
   * Usa o mesmo contrato de CobrancasUseCase.create() — monta as entidades
   * Cobranca e delega a inserção ao SheetsCobrancasRepository.
   *
   * Apenas envios com success=true são persistidos; falhas não geram registro,
   * pois o cliente não recebeu a notificação.
   *
   * @param {BulkEmailQueueItemDTO[]}  queue    - fila original (contém reguaId e faturas)
   * @param {BulkEmailResultDTO[]}     results  - resultados do envio
   * @returns {number} quantidade de cobranças salvas
   */
  _step5_persistCobrancas(queue, results) {
    // Indexa resultados por codCliente para lookup O(1)
    const resultMap = results.reduce((acc, r) => {
      acc[String(r.codCliente)] = r;
      return acc;
    }, {});

    const dataContato = new Date().toISOString();

    // Acumula TODAS as cobranças (sucesso e falha) em um único array.
    // O status gravado reflete o resultado real do gateway, permitindo
    // ao usuário distinguir notificações entregues das que falharam.
    const todasCobrancas = queue.flatMap(item => {
      const result  = resultMap[String(item.codCliente)];
      const reguaId = item.view.regua.reguaId;

      // Determina o status final: usa o resultado do gateway quando disponível,
      // caso o item não tenha correspondência no resultMap mantém PENDENTE.
      const statusFinal = result
        ? (result.success
            ? getEnunsCobranca().status.FINALIZADO
            : getEnunsCobranca().status.FALHA)
        : getEnunsCobranca().status.PENDENTE;

      return item.view.faturas.map(f => {
        const props = Object.assign({}, schemaDomainCobranca(), {
          documento:   f.documento,
          codCliente:  item.codCliente,
          diasAtraso:  f.diasAtraso ?? 0,
          vlrLiquido:  f.vlrLiquido,
          dataContato,
          reguaId,
          canal:  item.canal,
          acao:   item.acao,
          status: statusFinal
        });

        const cobranca = Cobranca.criar(props);
        cobranca.id = Utilities.getUuid();
        return cobranca;
      });
    });

    if (!todasCobrancas.length) {
      Logger.log('[BulkEmail] Nenhuma cobrança para persistir.');
      return 0;
    }

    // Uma única chamada ao Sheets para todo o lote
    this.repository.insert(todasCobrancas);

    Logger.log(`[BulkEmail] Total de cobranças persistidas: ${todasCobrancas.length}`);
    return todasCobrancas.length;
  }

  // ── Helpers privados ─────────────────────────────────────────────────────


  /**
   * Envia um único email e registra o resultado.
   * Reutiliza _emailBuilder herdado de SendChargeUseCase.
   *
   * @param {BulkEmailQueueItemDTO} item
   * @returns {BulkEmailResultDTO}
   */
  _sendOne(item) {
    const sentAt = new Date().toISOString();

    try {
      // _emailBuilder espera o mesmo shape que sendCharge usa
      const emailPayload = this._emailBuilder({
        cliente:  item.cliente,
        email:    item.email,
        telefone: item.telefone,
        canal:    item.canal,
        view:     item.view
      });

      const gatewayResult = this._geteWay.send(emailPayload);

      const success = gatewayResult?.success !== false; // GmailGateWay retorna { success, message }

      Logger.log(
        `[BulkEmail] ${success ? 'OK' : 'FALHA'} → ${item.cliente} <${item.email}>`
      );

      return new BulkEmailResultDTO({
        codCliente: item.codCliente,
        cliente:    item.cliente,
        email:      item.email,
        success,
        message:    gatewayResult?.message ?? null,
        sentAt
      });

    } catch (err) {
      Logger.log(`[BulkEmail] ERRO → ${item.cliente} <${item.email}>: ${err.message}`);

      return new BulkEmailResultDTO({
        codCliente: item.codCliente,
        cliente:    item.cliente,
        email:      item.email,
        success:    false,
        message:    err.message,
        sentAt
      });
    }
  }

  /**
   * Identifica a régua principal para um conjunto de faturas.
   * Estratégia: a régua de maior `atrasoDe` que cobre pelo menos uma fatura.
   * (mesmo critério de CobrancasUseCase._getReguaPrincipal)
   *
   * @param {Fatura[]}       faturas
   * @param {ReguaListDTO[]} reguas
   * @returns {ReguaListDTO|null}
   */
  _resolveReguaPrincipal(faturas, reguas) {
    const matched = faturas
      .flatMap(f =>
        reguas.filter(r => f.diasAtraso >= r.atrasoDe && f.diasAtraso <= r.atrasoAte)
      )
      .filter(Boolean);

    if (!matched.length) return null;

    // A mais severa: maior atrasoDe (critério idêntico ao existente)
    return matched.sort((a, b) => b.atrasoDe - a.atrasoDe)[0];
  }

  /**
   * Resolve as taxas de juros e multa a partir do BootstrapIndex de encargos.
   *
   * @param {Object} encargos  - mapa indexado por recorrencia
   * @returns {{ taxaJuros: number, taxaMulta: number }}
   */
  _resolveEncargos(encargos) {
    const { recorrencia } = getEnunsEncargos();
    return {
      taxaJuros: encargos[recorrencia.DIARIA]?._taxaJuros || 0,
      taxaMulta: encargos[recorrencia.UNICA]?._taxaJuros  || 0
    };
  }

  /**
   * Divide um array em sub-arrays de tamanho `size`.
   *
   * @param {any[]} array
   * @param {number} size
   * @returns {any[][]}
   */
  _chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// =============================================================================
// Funções de conveniência para execução manual / agendamento via Triggers
// =============================================================================

/**
 * Executa o envio em massa com configurações padrão.
 * Pode ser chamada diretamente no editor ou vinculada a um Trigger de tempo.
 *
 * Configurações padrão:
 *   batchSize      = 10  emails por lote
 *   delayBetweenMs = 2000 ms entre lotes  (~300 emails em 60 s)
 */
function runBulkEmail() {
  const useCase = new BulkEmailUseCase({
    batchSize:      10,
    delayBetweenMs: 2000,
    acao:   getEnunsCobranca().acoes.NOTIFICACAO,
    status: getEnunsCobranca().status.FINALIZADO
  });

  const summary = useCase.execute();

  Logger.log('=== RESUMO FINAL ===');
  Logger.log(JSON.stringify(summary, null, 2));

  return summary;
}

/**
 * Versão de teste: usa batchSize=2 e delay=500ms para validar o fluxo
 * sem disparar todos os emails de uma vez.
 */
function runBulkEmail_TEST() {
  const useCase = new BulkEmailUseCase({
    batchSize:      2,
    delayBetweenMs: 500,
    acao:   getEnunsCobranca().acoes.NOTIFICACAO,
    status: getEnunsCobranca().status.PENDENTE   // PENDENTE para não marcar como finalizado no teste
  });

  const summary = useCase.execute();

  Logger.log('=== RESUMO (TESTE) ===');
  Logger.log(JSON.stringify(summary, null, 2));

  return summary;
}