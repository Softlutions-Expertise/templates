import React from "react";

// ----------------------------------------------------------------------

export type JsxReportHeaderFilterProps = {
  label: string;
  value: string | React.ReactNode;
};

// ----------------------------------------------------------------------

export const JsxReportHeaderFilter = (props: JsxReportHeaderFilterProps) => {
  const { label, value } = props;

  return (
    <li className="report-filter">
      <span className="report-filter-label">{label}:</span>{" "}
      <span>{value}</span>
    </li>
  );
};
