import React from "react";
import {
  JsxReportHeaderFilter,
  type JsxReportHeaderFilterProps,
} from "./jsx-report-header-filter";

// ----------------------------------------------------------------------

type JsxReportHeaderFiltersProps = {
  filters: JsxReportHeaderFilterProps[];
};

// ----------------------------------------------------------------------

export const JsxReportHeaderFilters = (props: JsxReportHeaderFiltersProps) => {
  const { filters } = props;

  if (!filters || filters.length === 0) return null;

  return (
    <ul className="report-filters">
      {filters.map((filter, index) => (
        <JsxReportHeaderFilter key={index} {...filter} />
      ))}
    </ul>
  );
};
