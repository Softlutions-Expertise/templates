import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import puppeteer from 'puppeteer';
import { defaultTemplate, compileTemplate } from './report-template';

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

// Expense Report Data Interface
export interface ExpenseReportData {
  title: string;
  generatedAt: string;
  filters: {
    startDate?: string;
    endDate?: string;
    category?: string;
  };
  summary: {
    total: number;
    count: number;
    average: number;
    byCategory: { name: string; value: number }[];
  };
  expenses: {
    id: string;
    date: string;
    amount: number;
    description: string;
    category: string;
    notes?: string;
  }[];
}

// ----------------------------------------------------------------------

export class ReportGenerator {
  generate(data: ReportData): string {
    return this.buildHtml(data);
  }

  private buildHtml(data: ReportData): string {
    const { title, period, columns, rows, summary } = data;

    const headerHtml = `
      <div class="header">
        <h1>${title}</h1>
        <div class="period">${period}</div>
      </div>
    `;

    const footerHtml = `
      <div class="footer">
        <p>Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
      </div>
    `;

    const summaryHtml = summary ? this.buildSummary(summary) : '';
    const tableHtml = this.buildTable(columns, rows);

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${defaultTemplate.styles}</style>
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

  private buildSummary(summary: ReportSummary[]): string {
    const cards = summary.map(item => `
      <div class="summary-card ${item.highlight ? 'highlight' : ''}">
        <h3>${item.label}</h3>
        <p>${item.value}</p>
      </div>
    `).join('');

    return `<div class="summary">${cards}</div>`;
  }

  private buildTable(columns: ReportColumn[], rows: Record<string, any>[]): string {
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
          ${rowCells || '<tr><td colspan="' + columns.length + '" style="text-align: center; padding: 20px;">Nenhum dado</td></tr>'}
        </tbody>
      </table>
    `;
  }
}

// Função helper
export function generateReport(data: ReportData): string {
  const generator = new ReportGenerator();
  return generator.generate(data);
}

// Expense Report HTML Generator
function generateExpenseReportHtml(data: ExpenseReportData): string {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const periodText = data.filters.startDate && data.filters.endDate
    ? `${formatDate(data.filters.startDate)} - ${formatDate(data.filters.endDate)}`
    : 'Todo o período';

  const categoryFilterText = data.filters.category ? ` • Categoria: ${data.filters.category}` : '';

  const summaryCards = `
    <div class="summary">
      <div class="summary-card highlight">
        <h3>Total</h3>
        <p>${formatCurrency(data.summary.total)}</p>
      </div>
      <div class="summary-card">
        <h3>Quantidade</h3>
        <p>${data.summary.count} despesas</p>
      </div>
      <div class="summary-card">
        <h3>Média</h3>
        <p>${formatCurrency(data.summary.average)}</p>
      </div>
    </div>
  `;

  const categoryBreakdown = data.summary.byCategory.length > 0 ? `
    <div class="category-breakdown">
      <h3>Por Categoria</h3>
      <div class="category-list">
        ${data.summary.byCategory.map(cat => `
          <div class="category-item">
            <span class="category-name">${cat.name}</span>
            <span class="category-value">${formatCurrency(cat.value)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const expensesRows = data.expenses.map(expense => `
    <tr>
      <td>${formatDate(expense.date)}</td>
      <td>${expense.description}</td>
      <td>${expense.category}</td>
      <td style="text-align: right">${formatCurrency(expense.amount)}</td>
    </tr>
  `).join('');

  const expensesTable = `
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Descrição</th>
          <th>Categoria</th>
          <th style="text-align: right">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${expensesRows || '<tr><td colspan="4" style="text-align: center; padding: 20px;">Nenhuma despesa encontrada</td></tr>'}
      </tbody>
    </table>
  `;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #333;
      padding: 20px;
    }
    .container { max-width: 100%; }
    .header {
      border-bottom: 2px solid #1976d2;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #1976d2;
      font-size: 24px;
      margin-bottom: 5px;
    }
    .period {
      color: #666;
      font-size: 12px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .summary-card {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .summary-card.highlight {
      background: #1976d2;
      color: white;
    }
    .summary-card h3 {
      font-size: 11px;
      font-weight: 500;
      margin-bottom: 5px;
      opacity: 0.9;
    }
    .summary-card p {
      font-size: 18px;
      font-weight: 600;
    }
    .category-breakdown {
      background: #fafafa;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .category-breakdown h3 {
      font-size: 14px;
      margin-bottom: 10px;
      color: #333;
    }
    .category-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
    }
    .category-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: white;
      border-radius: 4px;
    }
    .category-name { color: #666; }
    .category-value { font-weight: 500; color: #1976d2; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background: #f5f5f5;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      color: #666;
    }
    tr:hover { background: #fafafa; }
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      color: #999;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${data.title}</h1>
      <div class="period">Período: ${periodText}${categoryFilterText}</div>
    </div>
    ${summaryCards}
    ${categoryBreakdown}
    ${expensesTable}
    <div class="footer">
      <p>Relatório gerado em ${format(parseISO(data.generatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
    </div>
  </div>
</body>
</html>`;
}

// Generate PDF from Expense Report Data
export async function generateExpenseReport(data: ExpenseReportData): Promise<Buffer> {
  const html = generateExpenseReportHtml(data);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });
    
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
