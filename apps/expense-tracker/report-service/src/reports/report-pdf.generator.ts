import puppeteer from 'puppeteer';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Expense {
  id: string;
  date: string;
  amount: number;
  description: string;
  category?: { name: string };
  notes?: string;
}

interface ReportData {
  title: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  expenses: Expense[];
}

export class ReportPdfGenerator {
  async generate(data: ReportData): Promise<Buffer> {
    const html = this.buildHtml(data);
    
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
        margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
      });
      
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private buildHtml(data: ReportData): string {
    const { title, startDate, endDate, expenses } = data;
    
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;

    // Agrupa por categoria
    const byCategory = expenses.reduce((acc, e) => {
      const cat = e.category?.name || 'Sem categoria';
      acc[cat] = (acc[cat] || 0) + Number(e.amount);
      return acc;
    }, {} as Record<string, number>);

    const formatCurrency = (v: number) => 
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    const formatDate = (d?: string) => 
      d ? format(parseISO(d), 'dd/MM/yyyy', { locale: ptBR }) : '-';

    const periodText = startDate && endDate
      ? `${formatDate(startDate)} a ${formatDate(endDate)}`
      : 'Todo o período';

    // Data de geração
    const generatedAt = format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 9pt;
      line-height: 1.4;
      color: #1a1a1a;
      background: #fff;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #2563eb;
    }
    
    .header-left {
      flex: 1;
    }
    
    .header-right {
      text-align: right;
    }
    
    .logo {
      font-size: 18pt;
      font-weight: 700;
      color: #2563eb;
      letter-spacing: -0.5px;
    }
    
    .report-title {
      font-size: 14pt;
      font-weight: 600;
      color: #111;
      margin-top: 4px;
    }
    
    .report-meta {
      font-size: 8pt;
      color: #666;
      margin-top: 8px;
    }
    
    .report-date {
      font-size: 8pt;
      color: #999;
    }
    
    /* Cards de resumo */
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .card {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 8px;
      padding: 12px;
      border: 1px solid #e2e8f0;
    }
    
    .card.primary {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      border: none;
    }
    
    .card-label {
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.8;
      margin-bottom: 4px;
    }
    
    .card-value {
      font-size: 14pt;
      font-weight: 700;
    }
    
    .card.primary .card-value {
      font-size: 16pt;
    }
    
    /* Seção de categorias */
    .section {
      margin-bottom: 20px;
    }
    
    .section-title {
      font-size: 10pt;
      font-weight: 600;
      color: #374151;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .category-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    
    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    
    .category-name {
      font-size: 8pt;
      color: #4b5563;
    }
    
    .category-value {
      font-size: 9pt;
      font-weight: 600;
      color: #2563eb;
    }
    
    /* Tabela */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    
    thead {
      background: #f8fafc;
    }
    
    th {
      padding: 8px 6px;
      text-align: left;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      font-size: 7pt;
      letter-spacing: 0.3px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    td {
      padding: 8px 6px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    
    tr:hover {
      background: #f8fafc;
    }
    
    .date-col { width: 12%; }
    .desc-col { width: 35%; }
    .cat-col { width: 20%; }
    .amount-col { 
      width: 15%; 
      text-align: right;
      font-weight: 600;
      color: #2563eb;
    }
    
    /* Status badges */
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7pt;
      font-weight: 500;
    }
    
    .badge-blue {
      background: #dbeafe;
      color: #1e40af;
    }
    
    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7pt;
      color: #9ca3af;
    }
    
    .footer-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .page-number {
      background: #f3f4f6;
      padding: 4px 10px;
      border-radius: 12px;
      font-weight: 500;
    }
    
    /* Utilitários */
    .text-right { text-align: right; }
    .text-muted { color: #6b7280; }
    .font-medium { font-weight: 500; }
    
    /* Gráfico simples */
    .chart-bar {
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      margin-top: 4px;
      overflow: hidden;
    }
    
    .chart-fill {
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #3b82f6);
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="header-left">
      <div class="logo">Expense Tracker</div>
      <div class="report-title">${title}</div>
      <div class="report-meta">
        Período: ${periodText} • ${count} registros
      </div>
    </div>
    <div class="header-right">
      <div class="report-date">Gerado em</div>
      <div class="report-date">${generatedAt}</div>
    </div>
  </div>

  <!-- Cards de Resumo -->
  <div class="summary-cards">
    <div class="card primary">
      <div class="card-label">Total</div>
      <div class="card-value">${formatCurrency(total)}</div>
    </div>
    <div class="card">
      <div class="card-label">Quantidade</div>
      <div class="card-value">${count}</div>
    </div>
    <div class="card">
      <div class="card-label">Média</div>
      <div class="card-value">${formatCurrency(average)}</div>
    </div>
  </div>

  ${Object.keys(byCategory).length > 0 ? `
  <!-- Resumo por Categoria -->
  <div class="section">
    <div class="section-title">Distribuição por Categoria</div>
    <div class="category-list">
      ${Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([name, value]) => {
        const percentage = total > 0 ? (value / total * 100).toFixed(1) : 0;
        return `
        <div class="category-item">
          <div>
            <div class="category-name">${name}</div>
            <div class="chart-bar">
              <div class="chart-fill" style="width: ${percentage}%"></div>
            </div>
          </div>
          <div class="category-value">${formatCurrency(value)}</div>
        </div>
        `;
      }).join('')}
    </div>
  </div>
  ` : ''}

  <!-- Tabela de Despesas -->
  <div class="section">
    <div class="section-title">Detalhamento</div>
    <table>
      <thead>
        <tr>
          <th class="date-col">Data</th>
          <th class="desc-col">Descrição</th>
          <th class="cat-col">Categoria</th>
          <th class="amount-col">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${expenses.map(e => `
        <tr>
          <td>${formatDate(e.date)}</td>
          <td class="font-medium">${e.description}</td>
          <td>
            <span class="badge badge-blue">${e.category?.name || '-'}</span>
          </td>
          <td class="amount-col">${formatCurrency(Number(e.amount))}</td>
        </tr>
        `).join('')}
        ${expenses.length === 0 ? `
        <tr>
          <td colspan="4" style="text-align: center; padding: 20px; color: #9ca3af;">
            Nenhuma despesa encontrada
          </td>
        </tr>
        ` : ''}
      </tbody>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      <span>Expense Tracker</span>
      <span>•</span>
      <span>Relatório gerado automaticamente</span>
    </div>
    <div class="page-number">1</div>
  </div>
</body>
</html>`;
  }
}
