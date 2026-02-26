/**
 * Interface conceitual do repositório de Encargos.
 * Implementações concretas (Sheets, Firestore, etc.)
 * devem seguir este contrato.
 */
class EncargosRepository {

  select( params ) {
    throw new Error('Método findAll() não implementado');
  }

  selectById(id, params) {
    throw new Error('Método findById() não implementado');
  }

  create(encargo) {
    throw new Error('Método save() não implementado');
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