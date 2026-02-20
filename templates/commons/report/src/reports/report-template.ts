// Template simples de relatório - apenas HTML/CSS
export interface ReportTemplate {
  title: string;
  header?: string;
  footer?: string;
  styles?: string;
}

// Template padrão
export const defaultTemplate: ReportTemplate = {
  title: 'Relatório',
  header: `
    <div style="text-align: center; padding: 20px; border-bottom: 2px solid #00A76F;">
      <h1 style="color: #00A76F; margin: 0;">{{title}}</h1>
      <p style="color: #666; margin: 5px 0;">{{period}}</p>
    </div>
  `,
  footer: `
    <div style="text-align: center; padding: 10px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
      <p>Gerado em {{date}}</p>
    </div>
  `,
  styles: `
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
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .summary-card {
      background: #00A76F;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 20px;
    }
    .summary-card h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .summary-card p {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; padding: 20px; }
    }
  `
};

// Função simples para substituir variáveis no template
export function compileTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
}
