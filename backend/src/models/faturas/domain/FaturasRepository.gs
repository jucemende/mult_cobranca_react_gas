/**
 * Interface conceitual do repositório de Faturas.
 * Implementações concretas (Sheets, Firestore, etc.)
 * devem seguir este contrato.
 */
class FaturasRepository {

  getAll( params ) {
    throw new Error('Método getAll() não implementado');
  }

  getById(id, params) {
    throw new Error('Método getById() não implementado');
  }

  applyAdvancedSearch( rows, search ) {
    throw new Error('Método applyAdvancedSearch() não implementado');
  }

  applyFilters( rows, filters ) {
    throw new Error('Método applyFilters() não implementado');
  }

  insert(fatura) {
    throw new Error('Método insert() não implementado');
  }

  update(fatura) {
    throw new Error('Método update() não implementado');
  }

  delete(id) {
    throw new Error('Método delete() não implementado');
  }

  validateDuplicate(inicio, fim, ignoreId = null) {
    throw new Error('Método validateDuplicate() não implementado');
  }
}