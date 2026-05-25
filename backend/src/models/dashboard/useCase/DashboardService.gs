// ── DashboardService.gs ───────────────────────────────────────────────────────
// Responsabilidade: lógica de negócio e agregação de dados brutos do dashboard.
// Não formata valores nem define cores — isso é responsabilidade da presentation.

class DashboardService {

  constructor({ faturasRepository, cobrancasRepository }) {
    this.faturasRepo   = faturasRepository;
    this.cobrancasRepo = cobrancasRepository;
    this.boots         = BootstrapIndex();
  }

  getAll() {
    const faturas    = this.faturasRepo.getAll();
    const cobrancas  = this.cobrancasRepo.getAll();
    const clientes   = this.boots.clientes();
    const vendedores = this.boots.vendedores();
    const encargos   = this.boots.encargos();

    const { taxaJuros, taxaMulta } = this._getEncargos(encargos);
    const hoje = new Date();

    const faturasAbertas = this._buildFaturasAbertas(faturas, clientes, taxaJuros, taxaMulta, hoje);

    return {
      kpis:        this._calcKpis(faturasAbertas, cobrancas, clientes),
      aging:       this._calcAging(faturasAbertas),
      cobStatus:   this._calcCobStatus(cobrancas),
      canais:      this._calcCanais(cobrancas),
      vendedores:  this._calcVendedores(faturasAbertas, vendedores),
      clientes:    this._calcClienteStatus(clientes),
      atualizadoEm: hoje,
    };
  }

  // ── Agregações ──────────────────────────────────────────────────────────────

  _buildFaturasAbertas(faturas, clientes, taxaJuros, taxaMulta, hoje) {
    return faturas.map(f => {
      const diasAtraso = Math.floor((hoje - new Date(f.vencimento)) / 86400000);
      const encargo    = diasAtraso > 0 && f.possuiEncargos
        ? f.calcularEncargos({ taxaJuros, taxaMulta })
        : null;

      return {
        codCliente: f.codCliente,
        idVendedor: clientes[f.codCliente]?.idVendedor ?? null,
        diasAtraso,
        vlrLiquido: f.vlrLiquido,
        total:      encargo?.total ?? f.vlrLiquido,
      };
    });
  }

  _calcKpis(faturasAbertas, cobrancas, clientes) {
    const totalAberto      = faturasAbertas.reduce((s, f) => s + f.vlrLiquido, 0);
    const totalTitulos     = faturasAbertas.length;
    const atrasadas        = faturasAbertas.filter(f => f.diasAtraso > 0);
    const titulosAtrasados = atrasadas.length;
    const diasMedio        = titulosAtrasados > 0
      ? Math.round(atrasadas.reduce((s, f) => s + f.diasAtraso, 0) / titulosAtrasados)
      : 0;

    const totalClientesAtivos = Object.values(clientes).filter(c => c.status === 'ATIVO').length;
    const totalClientes       = Object.keys(clientes).length;
    const totalCobrancas      = cobrancas.length;
    const cobFinalizadas      = cobrancas.filter(c => c.status === 'FINALIZADO').length;
    const taxaSucesso         = totalCobrancas > 0
      ? (cobFinalizadas / totalCobrancas) * 100
      : 0;

    return {
      totalAberto,
      totalTitulos,
      titulosAtrasados,
      diasMedio,
      totalClientesAtivos,
      totalClientes,
      totalCobrancas,
      cobFinalizadas,
      taxaSucesso,
    };
  }

  _calcAging(faturasAbertas) {
    const faixas = [
      { faixa: '1–15 dias',    de: 1,   ate: 15    },
      { faixa: '16–30 dias',   de: 16,  ate: 30    },
      { faixa: '31–60 dias',   de: 31,  ate: 60    },
      { faixa: '61–90 dias',   de: 61,  ate: 90    },
      { faixa: '91–180 dias',  de: 91,  ate: 180   },
      { faixa: '181–365 dias', de: 181, ate: 365   },
      { faixa: '>365 dias',    de: 366, ate: 99999 },
    ];

    return faixas.map(f => {
      const grupo = faturasAbertas.filter(fa => fa.diasAtraso >= f.de && fa.diasAtraso <= f.ate);
      return {
        faixa: f.faixa,
        count: grupo.length,
        valor: grupo.reduce((s, fa) => s + fa.total, 0),
      };
    });
  }

  _calcCobStatus(cobrancas) {
    return Object.entries(
      cobrancas.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {})
    ).map(([status, count]) => ({ status, count }));
  }

  _calcCanais(cobrancas) {
    return Object.entries(
      cobrancas.reduce((acc, c) => {
        acc[c.canal] = (acc[c.canal] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .map(([canal, count]) => ({ canal, count }));
  }

  _calcVendedores(faturasAbertas, vendedores) {
    const vendMap = faturasAbertas.reduce((acc, f) => {
      const vend = vendedores[f.idVendedor];
      if (!vend) return acc;
      acc[vend.vendedor] = (acc[vend.vendedor] || 0) + f.total;
      return acc;
    }, {});

    return Object.entries(vendMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([nome, valor]) => ({ nome, valor }));
  }

  _calcClienteStatus(clientes) {
    return Object.entries(
      Object.values(clientes).reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {})
    ).map(([status, count]) => ({ status, count }));
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  _getEncargos(encargos) {
    const { recorrencia } = getEnunsEncargos();
    return {
      taxaJuros: encargos[recorrencia.DIARIA]?._taxaJuros || 0,
      taxaMulta: encargos[recorrencia.UNICA]?._taxaJuros  || 0,
    };
  }
}