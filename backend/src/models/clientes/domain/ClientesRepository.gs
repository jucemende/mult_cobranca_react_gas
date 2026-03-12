/**
 * Interface conceitual do repositório de Cliente.
 * Implementações concretas (Sheets, Firestore, etc.)
 * devem seguir este contrato.
 */
class ClienteRepository {

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

  insert(cliente) {
    throw new Error('Método insert() não implementado');
  }

  update(cliente) {
    throw new Error('Método update() não implementado');
  }

  validateDuplicate(codigo, cnpjCpf, ignoreId = null) {
    throw new Error('Método validateDuplicate() não implementado');
  }
}