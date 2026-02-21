import styled from "styled-components";
import { JsxReportSectionSubBlock } from "./jsx-report-section-sub-block";

const StyledHeading = styled.h1`
  font-weight: bold;
  font-size: 0.9em;
`;

export const JsxReportSectionSubTitle = (props: { title: string }) => {
  return (
    <>
      <JsxReportSectionSubBlock $size="large" $expand style={{ margin: "1rem 0" }}>
        <StyledHeading>{props.title?.toUpperCase()}</StyledHeading>
      </JsxReportSectionSubBlock>
    </>
  );
};
