import styled from "styled-components";

const StyledLi = styled.li``;

export type JsxReportHeaderToggleProps = {
  activeLabel: string;
  value?: boolean | null | undefined;
};

export const JsxReportHeaderToggle = (props: JsxReportHeaderToggleProps) => {
  const { activeLabel, value } = props;

  if (!value) {
    return null;
  }

  return (
    <>
      <StyledLi>⇒ {activeLabel}</StyledLi>
    </>
  );
};
