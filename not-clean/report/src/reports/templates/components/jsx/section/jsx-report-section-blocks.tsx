import styled from "styled-components";
import {
  type IJsxReportSectionBlockProps,
  JsxReportSectionBlock,
} from "./jsx-report-section-block";

const StyledDiv = styled.div`
  display: flex;
  align-items: center;

  gap: 1rem;

  margin: 1rem 0;
`;

type Props = {
  size?: IJsxReportSectionBlockProps["$size"];

  blocks: {
    value: any;
    expand?: IJsxReportSectionBlockProps["$expand"];
  }[];
};

export const JsxReportSectionBlocks = (props: Props) => {
  const { blocks } = props;

  return (
    <StyledDiv>
      {blocks.map((block, index) => (
        <JsxReportSectionBlock
          key={index}
          $size={props.size}
          $expand={block.expand}
        >
          {block.value}
        </JsxReportSectionBlock>
      ))}
    </StyledDiv>
  );
};
