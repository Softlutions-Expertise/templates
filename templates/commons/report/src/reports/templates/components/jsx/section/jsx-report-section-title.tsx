import styled from "styled-components";
import { JsxReportSectionBlock } from "./jsx-report-section-block";

const StyledHeading = styled.h1`
  font-weight: bold;
  font-size: 1.25em;
`;

export const JsxReportSectionTitle = (props: { title: string }) => {
  return (
    <>
      <JsxReportSectionBlock $size="large" $expand style={{ margin: "1rem 0" }}>
        <StyledHeading>{props.title}</StyledHeading>
      </JsxReportSectionBlock>
    </>
  );
};
