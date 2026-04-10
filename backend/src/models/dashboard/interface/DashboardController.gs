// ── DashboardController.gs ────────────────────────────────────────────────────
// Orquestra o DashboardService (dados brutos) e dashboardPresentation (formatação).

const DashboardController = {

  get({ params } = {}) {
    const service = new DashboardService({
      faturasRepository:   new SheetsFaturasRepository(),
      cobrancasRepository: new SheetsCobrancasRepository(),
    });

    const raw  = service.getAll();
    const data = dashboardPresentation(raw);

    return { data };
  }

};