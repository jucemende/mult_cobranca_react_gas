// ── DashboardPresentation.gs ─────────────────────────────────────────────────
// Responsabilidade: formatar os dados brutos do DashboardService em um payload
// pronto para o frontend (moeda, ícones, cores, labels).

function dashboardPresentation(raw) {

  const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const { kpis: k } = raw;

  const kpis = [
    {
      label: 'Total em Aberto',
      valor: fmt(k.totalAberto),
      sub:   `${k.totalTitulos} títulos`,
      icon:  'banknote',
      cor:   '#4caf50',
    },
    {
      label: 'Títulos Atrasados',
      valor: k.titulosAtrasados.toLocaleString('pt-BR'),
      sub:   `Média ${k.diasMedio} dias`,
      icon:  'clock-alert',
      cor:   '#ff4560',
    },
    {
      label: 'Clientes Ativos',
      valor: k.totalClientesAtivos.toLocaleString('pt-BR'),
      sub:   `${k.totalClientes} total na base`,
      icon:  'users',
      cor:   '#7c6af7',
    },
    {
      label: 'Cobranças',
      valor: k.totalCobrancas.toLocaleString('pt-BR'),
      sub:   `${k.cobFinalizadas} finalizadas`,
      icon:  'receipt-text',
      cor:   '#ffb347',
    },
    {
      label: 'Taxa de Sucesso',
      valor: k.taxaSucesso.toFixed(1) + '%',
      sub:   `${k.cobFinalizadas} de ${k.totalCobrancas}`,
      icon:  'chart-no-axes-combined',
      cor:   '#00b4d8',
    },
  ];

  // ── Aging ─────────────────────────────────────────────────────────────────
  const agingCores = ['#4caf50', '#7c6af7', '#ffb347', '#ff6b35', '#ff4560', '#c0392b', '#6b1a1a'];

  const aging = raw.aging.map((a, i) => ({
    faixa:    a.faixa,
    count:    a.count,
    valor:    a.valor,
    valorFmt: fmt(a.valor),
    cor:      agingCores[i] || '#888',
  }));

  // ── Status Cobranças ──────────────────────────────────────────────────────
  const statusCores = { FINALIZADO: '#4caf50', FALHA: '#ff4560', PENDENTE: '#ffb347' };

  const cobStatus = raw.cobStatus.map(s => ({
    status: s.status,
    count:  s.count,
    cor:    statusCores[s.status] || '#888',
  }));

  // ── Canais ────────────────────────────────────────────────────────────────
  const canais = raw.canais; // { canal, count } — sem formatação adicional

  // ── Vendedores ────────────────────────────────────────────────────────────
  const vendedores = raw.vendedores.map(v => ({
    nome:     v.nome,
    valor:    v.valor,
    valorFmt: fmt(v.valor),
  }));

  // ── Clientes por status ───────────────────────────────────────────────────
  const clientesCores = { ATIVO: '#4caf50', CANCELADO: '#ff4560', SUSPENSO: '#ffb347', INATIVO: '#888' };

  const clientes = raw.clientes.map(c => ({
    status: c.status,
    count:  c.count,
    cor:    clientesCores[c.status] || '#888',
  }));

  // ── Timestamp ─────────────────────────────────────────────────────────────
  const atualizadoEm = raw.atualizadoEm
    .toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  return {
    kpis,
    aging,
    cobStatus,
    canais,
    vendedores,
    clientes,
    atualizadoEm,
  };
}