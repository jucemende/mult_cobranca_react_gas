class BaseDTO {
  
  constructor(data = {}) {
    Object.assign(this, data)
  }

  static fromRaw(raw) {
    return new this(raw);
  }

  static toRaw(dto) {
    return JSON.parse(JSON.stringify(dto));
  }

  static fromRawList(list = []) {
    return list.map(r => this.fromRaw(r));
  }

  static toRawList(list = []) {
    return list.map(d => this.toRaw(d));
  }

  // Tipagens
  _isNumber(value, field) {
    if (isNaN(value) || value === null || value === undefined || value === '') {
      throw new Error(`Campo ${field} deve ser um número válido`);
    } else {
      return Number(value)
    }
  }

  _isFloat(value, field) {
    if (value === null || value === undefined || value === '') {
      throw new Error(`Campo ${field} é obrigatório ${value}`);
    }

    const normalized = String(value)
      .trim()
      .replace(',', '.');

    if (!/^\d*\.?\d+$/.test(normalized)) {
      throw new Error(`Campo ${field} deve ser um número válido`);
    }

    const number = Number(normalized);

    if (!Number.isFinite(number)) {
      throw new Error(`Campo ${field} deve ser um número válido`);
    }

    return number;
  }

  _isString(value, field, required = true) {
    if (value == null || value === '' || value === undefined) {
      if (required) {
        throw new Error(`Campo ${field} é obrigatório`);
      }
      return null;
    }
    
    if (typeof value !== 'string') {
      throw new Error(`Campo ${field} deve ser uma texto`);
    } 
    
    return String(value)

  }

  _isISODate(value, field, required = true) {
    if (value == null || value === '') {
      if (required) {
        throw new Error(`Campo ${field} é obrigatório`);
      }
      return null;
    }

    const date = new Date(value);

    if (isNaN(date)) {
      throw new Error(`Campo ${field} deve ser uma data válida`);
    }

    return date.toISOString();
  }

}
