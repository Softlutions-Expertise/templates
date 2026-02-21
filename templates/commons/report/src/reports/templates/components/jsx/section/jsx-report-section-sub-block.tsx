import styled from "styled-components";

export type IJsxReportSectionBlockProps = {
  $expand?: boolean;
  $size?: "normal" | "medium" | "large";
};

export const JsxReportSectionSubBlock = styled.div<IJsxReportSectionBlockProps>`
  display: block;
  background-color: #f4f4f4ff;

  text-align: center;

  padding: ${({ $size }) => {
    if ($size === "large") {
      return "0.65em 1em";
    }

    if ($size === "medium") {
      return "0.55em 1em";
    }

    return "0.5em 1em";
  }};

  word-wrap: nowrap;

  flex-shrink: 0;
  flex-grow: ${({ $expand }) => ($expand ? 1 : 0)};
`;
