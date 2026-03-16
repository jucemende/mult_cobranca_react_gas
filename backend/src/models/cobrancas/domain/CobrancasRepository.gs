/**
 * Interface conceitual do repositório de Cobrancas.
 * Implementações concretas (Sheets, Firestore, etc.)
 * devem seguir este contrato.
 */
class CobrancasRepository {

  getAll( params ) {
    throw new Error('Método getAll() não implementado');
  }

  applyAdvancedSearch( rows, search ) {
    throw new Error('Método applyAdvancedSearch() não implementado');
  }

  applyFilters( rows, filters ) {
    throw new Error('Método applyFilters() não implementado');
  }

  insert(cobrancas) {
    throw new Error('Método insert() não implementado');
  }

}