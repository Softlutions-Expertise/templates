import React from "react";

// ----------------------------------------------------------------------

type JsxReportSectionTitleProps = {
  title: string;
  subtitle?: string;
};

// ----------------------------------------------------------------------

export const JsxReportSectionTitle = (props: JsxReportSectionTitleProps) => {
  const { title, subtitle } = props;

  return (
    <section>
      <h1 className="report-title">{title}</h1>
      {subtitle && (
        <p
          style={{
            textAlign: "center",
            margin: "0.5em 0",
            fontSize: "12px",
            color: "#666",
          }}
        >
          {subtitle}
        </p>
      )}
    </section>
  );
};
