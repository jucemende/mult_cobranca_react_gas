/**
 * Interface conceitual do repositório de Encargos.
 * Implementações concretas (Sheets, Firestore, etc.)
 * devem seguir este contrato.
 */
class EncargosRepository {

  findAll() {
    throw new Error('Método findAll() não implementado');
  }

  findById(id) {
    throw new Error('Método findById() não implementado');
  }

  save(encargo) {
    throw new Error('Método save() não implementado');
  }

  delete(id) {
    throw new Error('Método delete() não implementado');
  }

  validateDuplicate(tipoCobranca, aplicacao, ignoreId = null) {
    throw new Error('Método existsByTipoAndAplicacao() não implementado');
  }
}