import React from "react";
import {
  IAutoTableOptions,
  IAutoTableOptionsColumn,
} from "./utils/typings";

// ----------------------------------------------------------------------

type Props<Row, Context = never> = {
  rows: Row[];
  options: IAutoTableOptions<Row, Context>;
  context?: Context;
  totalCount?: false | { label: string; quantity?: number };
  emptyMessage?: string;
};

// ----------------------------------------------------------------------

function resolveEnabledColumns<Row, Context>(
  options: IAutoTableOptions<Row, Context>,
  context: Context | undefined,
): IAutoTableOptionsColumn<Row, Context>[] {
  return options.columns.filter((column) => {
    if (column.isEnabled === undefined) return true;
    if (typeof column.isEnabled === "boolean") return column.isEnabled;
    return column.isEnabled(context);
  });
}

// ----------------------------------------------------------------------

function resolveColumnValue<Row, Context>(
  column: IAutoTableOptionsColumn<Row, Context>,
  row: Row,
  context: Context | undefined,
  index: number,
): string | React.ReactNode {
  if (column.value) {
    return column.value(row, context, index);
  }
  const rawValue = (row as any)[column.key];
  return rawValue !== undefined && rawValue !== null ? String(rawValue) : "-";
}

// ----------------------------------------------------------------------

export const JsxReportAutoTable = <Row, Context = undefined | never>(
  props: Props<Row, Context>,
) => {
  const { rows, context, options, totalCount, emptyMessage = "Nenhum dado encontrado" } = props;

  const enabledColumns = resolveEnabledColumns<Row, Context>(options, context);

  if (rows.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          {enabledColumns.map((column) => (
            <th key={column.key} style={{ textAlign: column.align || "center" }}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {enabledColumns.map((column) => {
              const value = resolveColumnValue<Row, Context>(
                column,
                row,
                context,
                index,
              );

              return (
                <td
                  key={column.key}
                  style={{
                    textAlign: column.align || "center",
                    whiteSpace: column.shrink === "never" ? "nowrap" : "normal",
                  }}
                >
                  {value}
                </td>
              );
            })}
          </tr>
        ))}

        {totalCount && (
          <tr>
            <td colSpan={enabledColumns.length - 1} />
            <th style={{ whiteSpace: "nowrap" }}>{totalCount.label}</th>
            <td>{totalCount.quantity ?? rows.length}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
