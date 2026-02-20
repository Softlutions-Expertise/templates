import type { IAutoTableOptions } from "./typings";

export const resolveEnabledColumns = <Row, Context = undefined | never>(
  options: IAutoTableOptions<Row, Context>,
  context: Context | undefined,
) => {
  return options.columns.filter((column) => {
    const retrieverIsEnabled = column.isEnabled;

    if (typeof retrieverIsEnabled === "boolean") {
      return column;
    }

    if (typeof retrieverIsEnabled === "undefined") {
      return true;
    }

    return retrieverIsEnabled(context);
  });
};
