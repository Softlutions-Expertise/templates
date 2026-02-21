import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ----------------------------------------------------------------------

export interface ReportColumn {
  header: string;
  key: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any) => string;
}

export interface ReportSummary {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ReportData {
  title: string;
  period: string;
  columns: ReportColumn[];
  rows: Record<string, any>[];
  summary?: ReportSummary[];
}

// ----------------------------------------------------------------------

const defaultStyles = `
  * { box-sizing: border-box; }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
    margin: 0; 
    padding: 40px; 
    background: #f5f5f5; 
  }
  .container { 
    max-width: 800px; 
    margin: 0 auto; 
    background: white; 
    padding: 40px; 
    border-radius: 8px; 
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #00A76F;
  }
  .header h1 { color: #00A76F; margin: 0 0 10px 0; font-size: 28px; }
  .period { color: #666; font-size: 14px; }
  table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 20px;
  }
  th { 
    background: #f8f9fa; 
    padding: 12px; 
    text-align: left; 
    font-weight: 600;
    border-bottom: 2px solid #ddd;
  }
  td { padding: 12px; border-bottom: 1px solid #eee; }
  .summary {
    display: flex;
    gap: 20px;
    margin: 20px 0;
    flex-wrap: wrap;
  }
  .summary-card {
    flex: 1;
    min-width: 150px;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
  .summary-card.highlight {
    background: #00A76F;
    color: white;
  }
  .summary-card h3 { margin: 0 0 8px 0; font-size: 14px; opacity: 0.9; font-weight: 500; }
  .summary-card p { margin: 0; font-size: 24px; font-weight: 600; }
  .footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    text-align: center;
    color: #999;
    font-size: 12px;
  }
  @media print {
    body { background: white; padding: 0; }
    .container { box-shadow: none; padding: 20px; }
  }
`;

// ----------------------------------------------------------------------

export function generateReport(data: ReportData): string {
  const { title, period, columns, rows, summary } = data;

  const headerHtml = `
    <div class="header">
      <h1>${title}</h1>
      <div class="period">${period}</div>
    </div>
  `;

  const footerHtml = `
    <div class="footer">
      <p>Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })} | Expense Tracker</p>
    </div>
  `;

  const summaryHtml = summary ? buildSummary(summary) : '';
  const tableHtml = buildTable(columns, rows);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${defaultStyles}</style>
</head>
<body>
  <div class="container">
    ${headerHtml}
    ${summaryHtml}
    ${tableHtml}
    ${footerHtml}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;
}

function buildSummary(summary: ReportSummary[]): string {
  const cards = summary.map(item => `
    <div class="summary-card ${item.highlight ? 'highlight' : ''}">
      <h3>${item.label}</h3>
      <p>${item.value}</p>
    </div>
  `).join('');

  return `<div class="summary">${cards}</div>`;
}

function buildTable(columns: ReportColumn[], rows: Record<string, any>[]): string {
  const headerCells = columns.map(col => 
    `<th style="text-align: ${col.align || 'left'}">${col.header}</th>`
  ).join('');

  const rowCells = rows.map(row => {
    const cells = columns.map(col => {
      const value = row[col.key];
      const formatted = col.formatter ? col.formatter(value) : value;
      return `<td style="text-align: ${col.align || 'left'}">${formatted}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
    <table>
      <thead><tr>${headerCells}</tr></thead>
      <tbody>
        ${rowCells || `<tr><td colspan="${columns.length}" style="text-align: center; padding: 20px; color: #999;">Nenhum dado encontrado</td></tr>`}
      </tbody>
    </table>
  `;
}
