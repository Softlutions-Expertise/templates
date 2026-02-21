import styled from "styled-components";
import {
  JsxReportHeaderToggle,
  type JsxReportHeaderToggleProps,
} from "./jsx-report-header-toggle";

const StyledUl = styled.ul`
  margin: 1.25em 0;

  list-style: none;

  display: flex;
  flex-direction: column;

  gap: 0.25em;
`;

type JsxReportHeaderTogglesProps = {
  toggles: JsxReportHeaderToggleProps[];
};

export const JsxReportHeaderToggles = (props: JsxReportHeaderTogglesProps) => {
  const { toggles } = props;

  const hasSomeToggle = toggles.some((toggle) => !!toggle.value);

  if (!hasSomeToggle) {
    return null;
  }

  return (
    <>
      <StyledUl>
        {toggles.map((toggle) => (
          <JsxReportHeaderToggle key={toggle.activeLabel} {...toggle} />
        ))}
      </StyledUl>
    </>
  );
};
