import styled from "styled-components";
import {
  JsxReportHeaderFilter,
  type JsxReportHeaderFilterProps,
} from "./jsx-report-header-filter";

const StyledUl = styled.ul`
  margin: 1.25em 0;

  list-style: none;

  display: flex;
  flex-wrap: wrap;

  gap: 1em;
`;

type JsxReportHeaderFiltersProps = {
  filters: JsxReportHeaderFilterProps[];
};

export const JsxReportHeaderFilters = (props: JsxReportHeaderFiltersProps) => {
  const { filters } = props;

  return (
    <>
      <StyledUl>
        {filters.map((filter) => (
          <JsxReportHeaderFilter key={filter.label} {...filter} />
        ))}
      </StyledUl>
    </>
  );
};
