import { get, has } from "lodash-es";
import { PLACEHOLDER_DASHES_SHORT } from "../../../../../../utils";
import type { IAutoTableOptionsColumn } from "./typings";

export const resolveColumnValue = <Row, Context>(
  column: IAutoTableOptionsColumn<Row, Context>,
  row: Row,
  context: Context | undefined,
  index: number,
) => {
  const resolverMethod = column.value;

  if (resolverMethod) {
    return resolverMethod(row, context, index) ?? PLACEHOLDER_DASHES_SHORT;
  }
  resolverMethod;
  if (has(row, column.key)) {
    const valueByKey = get(row, column.key);
    return valueByKey ?? PLACEHOLDER_DASHES_SHORT;
  }

  return PLACEHOLDER_DASHES_SHORT;
};
