import styled from "styled-components";
import { getRowId } from "./utils/get-row-id";
import { resolveColumnValue } from "./utils/resolve-column-value";
import { resolveEnabledColumns } from "./utils/resolve-enabled-columns";
import { STYLE_NO_WRAP, STYLE_WRAP } from "./utils/styles";
import type { IAutoTableOptions } from "./utils/typings";

type StyledTableProps = {
  $fontSize?: string;
};

const StyledTable = styled.table<StyledTableProps>`
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  page-break-inside: auto;

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  table,
  td,
  th {
    border: 1px solid #000;
    text-align: center;
  }

  th {
    font-weight: bold;
  }

  td,
  th {
    padding: 0.5em ${({ $fontSize }) => `${$fontSize ?? "0.75em"}`};
    vertical-align: middle;
    font-size: ${({ $fontSize }) => `${$fontSize ?? "0.75em"}`};
  }

  thead th {
    background-color: RGB(228, 228, 228);
  }
`;

type Props<Row, Context = never> = {
  rows: Row[];
  options: IAutoTableOptions<Row, Context>;
  context?: Context;
  totalCount: false | { label: string; quantity?: number };

  children?: any;
} & Pick<StyledTableProps, "$fontSize">;

export const JsxReportAutoTable = <Row, Context = undefined | never>(
  props: Props<Row, Context>,
) => {
  const { rows, context, options, $fontSize } = props;

  const enabledColumns = resolveEnabledColumns<Row, Context>(options, context);

  return (
    <StyledTable $fontSize={$fontSize}>
      <thead>
        <tr>
          {enabledColumns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => (
          <tr key={getRowId(row, index)}>
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
                    ...(column.shrink === "never" ? STYLE_NO_WRAP : STYLE_WRAP),
                  }}
                >
                  {value}
                </td>
              );
            })}
          </tr>
        ))}

        {props.totalCount && (
          <tr>
            <td colSpan={enabledColumns.length - 2} />
            <th style={{ ...STYLE_NO_WRAP }}>{props.totalCount.label}</th>
            <td>{props.totalCount.quantity ?? rows.length}</td>
          </tr>
        )}

        {props.children}
      </tbody>
    </StyledTable>
  );
};
