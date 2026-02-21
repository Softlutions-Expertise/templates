import React from "react";

// ----------------------------------------------------------------------

type IStyledHtmlProps = {
  $orientation?: "landscape" | "portrait";
};

// ----------------------------------------------------------------------

const styles = `
  @page {
    size: A4 ${({ $orientation }: IStyledHtmlProps) => $orientation ?? "portrait"};
    margin: 40px 30px 50px 30px;
  }

  * { 
    box-sizing: border-box; 
  }

  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 11px;
    margin: 0;
    padding: 0;
  }

  .report-container {
    max-width: 100%;
  }

  table { 
    width: 100%; 
    border-collapse: collapse;
    overflow: hidden;
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  table, td, th {
    border: 1px solid #000;
    text-align: center;
  }

  th {
    font-weight: bold;
    background-color: rgb(228, 228, 228);
    padding: 0.5em 0.75em;
    vertical-align: middle;
    font-size: 0.75em;
  }

  td {
    padding: 0.5em 0.75em;
    vertical-align: middle;
    font-size: 0.75em;
  }

  .report-header {
    padding: 0 1em;
    gap: 1em;
    display: flex;
    align-items: center;
    margin-bottom: 1.5em;
  }

  .report-header .logo {
    width: 42px;
    height: 26px;
    background: #00306e;
    border-radius: 4px;
  }

  .report-header .nome-sistema {
    color: #00306e;
    font-weight: bold;
    margin: 0 0 0.25em 0;
    font-size: 14px;
  }

  .report-header .poder-publico {
    margin: 0;
    font-size: 12px;
    color: #666;
  }

  .report-title {
    text-align: center;
    margin: 1em 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .report-filters {
    margin: 1.25em 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    padding: 0;
  }

  .report-filter {
    font-size: 10px;
  }

  .report-filter-label {
    font-weight: bold;
  }

  .no-wrap {
    white-space: nowrap;
  }
`;

// ----------------------------------------------------------------------

export const JsxReportLayout = (
  props: { title?: string; children: any } & IStyledHtmlProps,
) => {
  const { title, children, $orientation } = props;
  
  const styleContent = styles.replace(
    '${({ $orientation }: IStyledHtmlProps) => $orientation ?? "portrait"}',
    $orientation ?? "portrait"
  );

  return (
    <html lang="pt-br">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ?? "Relatório"}</title>
        <style dangerouslySetInnerHTML={{ __html: styleContent }} />
      </head>
      <body>
        <div className="report-container">{children}</div>
      </body>
    </html>
  );
};
