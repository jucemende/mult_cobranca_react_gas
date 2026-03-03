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
    .filter(([_, value]) =>
      value !== undefined &&
      value !== null &&
      value !== ''
    )
    .map(([key, config]) => {

      const accessor = fieldMap[key];
      if (!accessor) return null;

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
    })
    .filter(Boolean);
}