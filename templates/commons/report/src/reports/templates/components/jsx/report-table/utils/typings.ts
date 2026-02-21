import { ReactNode } from "react";

export type IAutoTableOptionsColumn<Row, Context> = {
  key: string;
  label: string | ReactNode;
  isEnabled?: boolean | ((context: Context | undefined) => boolean);
  value?: (
    row: Row,
    context: Context | undefined,
    index: number
  ) => string | ReactNode | any;
  shrink?: "never" | "always";
};

export type IAutoTableOptions<Row = any, Context = undefined | never> = {
  columns: IAutoTableOptionsColumn<Row, Context>[];
};
