import React from "react";

// ----------------------------------------------------------------------

type JsxReportBrandHeaderProps = {
  systemName?: string;
  organizationName?: string;
  showLogo?: boolean;
};

// ----------------------------------------------------------------------

export const JsxReportBrandHeader = ({
  systemName = "Expense Tracker",
  organizationName = "Sistema de Gestão",
  showLogo = true,
}: JsxReportBrandHeaderProps) => {
  return (
    <header className="report-header">
      {showLogo && <div className="logo" />}
      <div>
        <p className="nome-sistema">{systemName}</p>
        <p className="poder-publico">{organizationName}</p>
      </div>
    </header>
  );
};
