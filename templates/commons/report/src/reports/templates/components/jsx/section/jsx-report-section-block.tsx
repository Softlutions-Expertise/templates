import styled from "styled-components";

export type IJsxReportSectionBlockProps = {
  $expand?: boolean;
  $size?: "normal" | "medium" | "large";
};

export const JsxReportSectionBlock = styled.div<IJsxReportSectionBlockProps>`
  display: block;
  background-color: #ededed;

  text-align: center;

  padding: ${({ $size }) => {
    if ($size === "large") {
      return "0.85em 1em";
    }

    if ($size === "medium") {
      return "0.75em 1em";
    }

    return "0.5em 1em";
  }};

  word-wrap: nowrap;

  flex-shrink: 0;
  flex-grow: ${({ $expand }) => ($expand ? 1 : 0)};
`;
