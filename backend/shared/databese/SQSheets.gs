class SQSheets {

  constructor({ tableName, idField }) {
    this.tableName = tableName;
    this.idField = idField;
  }

  static getSpreadsheet() {
    if (!SQSheets._ss) {
      const env = PropertiesService
        .getScriptProperties()
        .getProperty('ENV');

      const DEV_ID = '1CtxP0LOipQvtx8bdX40_F3I1yoLsojDmb3R3tK4YaP8';
      const PROD_ID = '1QqJKN_eXNXNdbDwOu0e7F-aqdCTMlcUjZvbLvdfheew';

      SQSheets._ss = SpreadsheetApp.openById(
        env === 'PROD' ? PROD_ID : DEV_ID
      );
    }
    return SQSheets._ss;
  }

  getSheet() {
    const ss = SQSheets.getSpreadsheet();
    let sh = ss.getSheetByName(this.tableName);

    if (!sh) {
      sh = ss.insertSheet(this.tableName);
    }

    return sh;
  }

  load() {
    const cache = CacheService.getScriptCache();
    const cached = cache.get(this.tableName);

    if (cached) {
      return JSON.parse(cached);
    }

    const sh = this.getSheet();
    const values = sh.getDataRange().getValues();

    if (values.length < 2) return [];

    const [headers, ...rows] = values;

    const data = rows.map((row, index) => {
      const obj = {};
      headers.forEach((h, i) => {
        let value = row[i];
        if (value === "") value = null;
        if (value instanceof Date) value = value.toISOString();
        obj[h] = value;
      });

      obj.__rowNumber = index + 2;
      return obj;
    });

    cache.put(this.tableName, JSON.stringify(data), 300);

    return data;
  }

  select() {

    return this.load()

  }

  insert(row) {
    const rows = Array.isArray(row) ? row : [row];

    const sh = this.getSheet();

    if (sh.getLastRow() === 0) {
      const headers = Object.keys(rows[0]);
      sh.getRange(1, 1, 1, headers.length)
        .setValues([headers]);
    }

    const headers = Object.keys(rows[0]);
    const matrix = rows.map(r =>
      headers.map(h => r[h] ?? "")
    );

    sh.getRange(
      sh.getLastRow() + 1,
      1,
      matrix.length,
      headers.length
    ).setValues(matrix);

    CacheService.getScriptCache().remove(this.tableName);
  }

  update(id, newData) {

    const data = this.load();
    const row = data.find(r =>
      String(r[this.idField]) === String(id)
    );

    if (!row) throw new Error('Registro não encontrado');

    const sh = this.getSheet();
    const headers = sh
      .getRange(1, 1, 1, sh.getLastColumn())
      .getValues()[0];

    const updated = { ...row, ...newData };

    const rowValues = headers.map(h => updated[h] ?? "");

    sh.getRange(row.__rowNumber, 1, 1, headers.length)
    .setValues([rowValues]);

    CacheService.getScriptCache().remove(this.tableName);

  }

  delete(id) {
    const data = this.load();
    const row = data.find(r =>
      String(r[this.idField]) === String(id)
    );

    if (!row) throw new Error('Registro não encontrado');

    this.getSheet().deleteRow(row.__rowNumber);

    CacheService.getScriptCache().remove(this.tableName);
  }
}