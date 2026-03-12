const Operators = {

  '=':  (a, b) => a === b,
  '!=': (a, b) => a !== b,
  '>':  (a, b) => a > b,
  '<':  (a, b) => a < b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,

  'LIKE': (a, b) =>
    String(a ?? '')
      .toUpperCase()
      .includes(String(b ?? '').toUpperCase()),

  'IN': (a, b) =>
    Array.isArray(b) && b.includes(a)

};

function getOperator(op) {
  const fn = Operators[op];
  if (!fn) throw new Error(`Operador inválido: ${op}`);
  return fn;
}

function buildFilters(params = {}, fieldMap = {}) {
  return Object.entries(params)
    .flatMap(([key, configs]) => { // Usamos flatMap para "achatar" múltiplos filtros do mesmo campo
      const accessor = fieldMap[key];
      if (!accessor) return [];

      // Se não for array (caso de valor único), transforma em array para padronizar
      const conditions = Array.isArray(configs) ? configs : [configs];

      return conditions.map(config => {
        if (typeof config !== 'object') {
          return {
            accessor,
            op: '=',
            value: config
          };
        }

        return {
          accessor,
          op: config.op || '=',
          value: config.value
        };
      });
    })
    .filter(Boolean);
}
