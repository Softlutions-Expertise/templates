import React from "react";

// ----------------------------------------------------------------------

export type IAutoTableOptionsColumn<Row, Context> = {
  key: string;
  label: string | React.ReactNode;
  isEnabled?: boolean | ((context: Context | undefined) => boolean);
  value?: (
    row: Row,
    context: Context | undefined,
    index: number,
  ) => string | React.ReactNode | any;
  shrink?: "never" | "always";
  align?: "left" | "center" | "right";
};

// ----------------------------------------------------------------------

export type IAutoTableOptions<Row = any, Context = undefined | never> = {
  columns: IAutoTableOptionsColumn<Row, Context>[];
};
