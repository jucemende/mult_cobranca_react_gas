/**
 * Interface conceitual do repositório de Vendedor.
 * Implementações concretas (Sheets, Firestore, etc.)
 * devem seguir este contrato.
 */
class VendedorRepository {

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

  insert(encargo) {
    throw new Error('Método insert() não implementado');
  }

  update(encargo) {
    throw new Error('Método update() não implementado');
  }

  delete(id) {
    throw new Error('Método delete() não implementado');
  }

}