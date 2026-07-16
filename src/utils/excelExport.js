const clean = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const readValue = (row, column) => {
  if (typeof column.exportValue === 'function') return column.exportValue(row)
  if (typeof column.value === 'function') return column.value(row)
  return row?.[column.field]
}

export const isFilledValue = (value) => value !== null && value !== undefined && String(value).trim() !== ''
export const filterColumnsForExport = (columns = []) => columns.filter((column) => column?.field && column.exportable !== false)

export const buildExcelHtml = ({ title = 'Exportacion', columns = [], rows = [] } = {}) => {
  const visibleColumns = filterColumnsForExport(columns)
  const headerCells = visibleColumns.map((column) => '<th>' + clean(column.exportLabel || column.label || column.header || column.field) + '</th>').join('')
  const bodyRows = rows.map((row) => {
    const cells = visibleColumns.map((column) => '<td>' + clean(readValue(row, column)) + '</td>').join('')
    return '<tr>' + cells + '</tr>'
  }).join('')

  return '<html><head><meta charset="UTF-8"></head><body><h3>' + clean(title) + '</h3><table border="1"><thead><tr>' + headerCells + '</tr></thead><tbody>' + bodyRows + '</tbody></table></body></html>'
}

export const downloadExcel = ({ filename = 'exportacion.xls', title = 'Exportacion', columns = [], rows = [] } = {}) => {
  const html = buildExcelHtml({ title, columns, rows })
  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.xls') ? filename : filename + '.xls'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default downloadExcel
