
// excelExport.js
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * @typedef {Object} ColumnDef
 * @property {string} key                - Propiedad en cada row (p. ej. "dni", "nombre").
 * @property {string=} header            - Texto a mostrar en cabecera (por defecto: key).
 * @property {number=} width             - Ancho fijo (si no, se autoajusta si autoFit=true).
 * @property {string=} numFmt            - Formato Excel (p. ej. '#,##0.00', 'dd/mm/yyyy').
 * @property {(value:any, row:any)=>any=} map - Formatter: transforma el valor antes de escribirlo.
 * @property {'sum'|'count'|'avg'|'min'|'max'|null=} total - Agrega a la fila de totales de la tabla.
 */

/**
 * @typedef {Object} ExportOptions
 * @property {string} fileName               - Nombre base del archivo sin extensión.
 * @property {string=} sheetName             - Nombre de la hoja (por defecto: 'Datos').
 * @property {string=} tableName             - Nombre de la tabla (por defecto: 'Tabla').
 * @property {'TableStyleMedium2'|'TableStyleMedium4'|'TableStyleMedium9'|'TableStyleLight1'|string=} tableStyle
 * @property {boolean=} showRowStripes       - Bandas en filas (por defecto: true).
 * @property {boolean=} freezeHeader         - Congelar la primera fila (por defecto: true).
 * @property {boolean=} autoFit              - Autoajustar columnas (por defecto: true).
 * @property {boolean=} boldHeader           - Cabecera en negrita + relleno (por defecto: true).
 * @property {boolean=} totalsRow            - Añadir fila de totales (por defecto: false).
 * @property {Record<string,string>=} columnNumFmts - numFmt por key (si no usas ColumnDef.numFmt).
 * @property {Record<string,(v:any,row:any)=>any>=} columnMappers - map por key (si no usas ColumnDef.map).
 */

/**
 * Exporta una única hoja a Excel con formato de tabla.
 * @param {Object[]} rows                   - Array de objetos con los datos.
 * @param {ColumnDef[]=} columns            - Definición de columnas (orden, header, formatos).
 * @param {ExportOptions} options
 */
export async function exportToExcel(rows, columns = undefined, options) {
  const {
    fileName,
    sheetName = 'Datos',
    tableName = 'Tabla',
    tableStyle = 'TableStyleMedium9',
    showRowStripes = true,
    freezeHeader = true,
    autoFit = true,
    boldHeader = true,
    totalsRow = false,
    columnNumFmts = {},
    columnMappers = {},
  } = options || {};

  if (!Array.isArray(rows)) {
    throw new Error('rows debe ser un array');
  }

  // Derivar columnas si no se especifican
  const keys = columns?.length
    ? columns.map(c => c.key)
    : (rows[0] ? Object.keys(rows[0]) : []);

  const headers = (columns?.length
    ? columns.map(c => c.header || c.key)
    : keys);

  // Preparar datos (aplicando map si procede)
  const rowsMatrix = rows.map(row => {
    return keys.map(k => {
      const colDef = columns?.find(c => c.key === k);
      const mapper = colDef?.map || columnMappers[k];
      const value = mapper ? mapper(row[k], row) : row[k];
      return value;
    });
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Definimos la tabla nativa de Excel
  const excelColumns = keys.map((k, idx) => {
    /** Totals (si procede) */
    const total = columns?.find(c => c.key === k)?.total ?? null;
    return {
      name: headers[idx],
      totalsRowFunction: totalsRow && total ? mapTotalKeyword(total) : undefined,
    };
  });

  worksheet.addTable({
    name: sanitizeTableName(tableName),
    ref: 'A1',
    headerRow: true,
    totalsRow: !!totalsRow,
    style: {
      theme: tableStyle,
      showRowStripes,
    },
    columns: excelColumns,
    rows: rowsMatrix,
  });

  const table = worksheet.getTable(sanitizeTableName(tableName));
  if (table?.commit) table.commit();

  // Congelar cabecera
  if (freezeHeader) {
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];
  }

  // Estilo extra de cabecera
  if (boldHeader) {
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF305496' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  }

  // Formatos por columna (numFmt) y anchos
  keys.forEach((k, i) => {
    const col = worksheet.getColumn(i + 1);

    // numFmt (prioridad: ColumnDef.numFmt > columnNumFmts[k])
    const colDef = columns?.find(c => c.key === k);
    const fmt = colDef?.numFmt || columnNumFmts[k];
    if (fmt) col.numFmt = fmt;

    // Ancho
    const explicitWidth = colDef?.width;
    if (typeof explicitWidth === 'number') {
      col.width = explicitWidth;
    } else if (autoFit) {
      const headerLen = String(headers[i] || k).length;
      let maxLen = headerLen;
      rows.forEach(r => {
        const raw = r?.[k];
        const mapped = (colDef?.map || columnMappers[k]) ? (colDef?.map || columnMappers[k])(raw, r) : raw;
        const str = mapped == null ? '' : String(mapped);
        maxLen = Math.max(maxLen, str.length);
      });
      col.width = clamp(maxLen + 2, 10, 60);
    }
  });

  // Generar y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const data = new Blob([buffer], { type: EXCEL_TYPE });
  saveAs(data, `${fileName || 'export'}_${Date.now()}.xlsx`);
}

/**
 * Exporta varias hojas en un mismo archivo.
 * @param {Array<{rows:Object[], columns?:ColumnDef[], options: Omit<ExportOptions,'fileName'> & {sheetName:string, tableName?:string}}>} sheets
 * @param {{fileName:string}} file
 */
export async function exportMultipleSheets(sheets, file) {
  const workbook = new ExcelJS.Workbook();

  for (const sheet of sheets) {
    const {
      rows,
      columns = undefined,
      options
    } = sheet;

    const {
      sheetName,
      tableName = 'Tabla',
      tableStyle = 'TableStyleMedium9',
      showRowStripes = true,
      freezeHeader = true,
      autoFit = true,
      boldHeader = true,
      totalsRow = false,
      columnNumFmts = {},
      columnMappers = {},
    } = options || {};

    const keys = columns?.length ? columns.map(c => c.key) : (rows[0] ? Object.keys(rows[0]) : []);
    const headers = (columns?.length ? columns.map(c => c.header || c.key) : keys);

    const rowsMatrix = rows.map(row =>
      keys.map(k => {
        const colDef = columns?.find(c => c.key === k);
        const mapper = colDef?.map || columnMappers[k];
        const value = mapper ? mapper(row[k], row) : row[k];
        return value;
      })
    );

    const worksheet = workbook.addWorksheet(sheetName || 'Datos');

    worksheet.addTable({
      name: sanitizeTableName(tableName),
      ref: 'A1',
      headerRow: true,
      totalsRow: !!totalsRow,
      style: { theme: tableStyle, showRowStripes },
      columns: keys.map((k, idx) => {
        const total = columns?.find(c => c.key === k)?.total ?? null;
        return {
          name: headers[idx],
          totalsRowFunction: totalsRow && total ? mapTotalKeyword(total) : undefined,
        };
      }),
      rows: rowsMatrix,
    });

    worksheet.getTable(sanitizeTableName(tableName))?.commit?.();

    if (freezeHeader) worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    if (boldHeader) {
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF305496' } };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    }

    keys.forEach((k, i) => {
      const col = worksheet.getColumn(i + 1);
      const colDef = columns?.find(c => c.key === k);
      const fmt = colDef?.numFmt || columnNumFmts[k];
      if (fmt) col.numFmt = fmt;

      const explicitWidth = colDef?.width;
      if (typeof explicitWidth === 'number') {
        col.width = explicitWidth;
      } else if (autoFit) {
        const headerLen = String(headers[i] || k).length;
        let maxLen = headerLen;
        rows.forEach(r => {
          const raw = r?.[k];
          const mapped = (colDef?.map || columnMappers[k]) ? (colDef?.map || columnMappers[k])(raw, r) : raw;
          const str = mapped == null ? '' : String(mapped);
          maxLen = Math.max(maxLen, str.length);
        });
        col.width = clamp(maxLen + 2, 10, 60);
      }
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const data = new Blob([buffer], { type: EXCEL_TYPE });
  saveAs(data, `${file.fileName || 'export'}_${Date.now()}.xlsx`);
}

// Helpers
function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }
function sanitizeTableName(name) {
  // Excel: máx 255 chars, sin espacios ni caracteres especiales en nombres de tabla
  return String(name || 'Tabla').replace(/[^A-Za-z0-9_]/g, '_').slice(0, 254);
}
function mapTotalKeyword(total) {
  switch (total) {
    case 'sum': return 'sum';
    case 'count': return 'count';
    case 'avg': return 'average';
    case 'min': return 'min';
    case 'max': return 'max';
    default: return undefined;
  }
}
