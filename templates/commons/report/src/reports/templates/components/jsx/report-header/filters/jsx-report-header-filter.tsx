import styled from "styled-components";
import { PLACEHOLDER_DASHES_LONG } from "../../../../../../utils";

const StyledLi = styled.li<{ $size?: "full" | "auto" }>`
  flex-shrink: 0;

  display: flex;

  width: ${({ $size }) => ($size === "full" ? "100%" : "max-content")};

  dt {
    font-weight: bold;
    margin-right: 0.25em;
  }
`;

export type JsxReportHeaderFilterProps = {
  label: string;
  value: any;

  size?: "full" | "auto";

  mode?: "hide-on-empty" | "show-on-empty";
};

export const JsxReportHeaderFilter = (props: JsxReportHeaderFilterProps) => {
  const { label, value, mode = "hide-on-empty", size = "auto" } = props;

  if (mode === "hide-on-empty" && !value) {
    return null;
  }

  return (
    <>
      <StyledLi $size={size}>
        <dt>{label}:</dt>
        <dd>{value ?? PLACEHOLDER_DASHES_LONG}</dd>
      </StyledLi>
    </>
  );
};
