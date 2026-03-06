/**
 * Interface conceitual do repositório de Encargos.
 * Implementações concretas (Sheets, Firestore, etc.)
 * devem seguir este contrato.
 */
class EncargosRepository {

  getAll( params ) {
    throw new Error('Método getAll() não implementado');
  }

  getById(id, params) {
    throw new Error('Método findById() não implementado');
  }

  applyAdvancedSearch( rows, search ) {
    throw new Error('Método findByAdvancedSearch() não implementado');
  }

  applyFilters( rows, filters ) {
    throw new Error('Método findByFilters() não implementado');
  }

  insert(encargo) {
    throw new Error('Método insert() não implementado');
  }

  update(encargo) {
    throw new Error('Método update() não implementado');
  }

  delete(id) {
    throw new Error('Método delete() não implementado');
  }

  validateDuplicate(tipoCobranca, aplicacao, ignoreId = null) {
    throw new Error('Método existsByTipoAndAplicacao() não implementado');
  }
}