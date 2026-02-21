import styled from "styled-components";
import { fmtDateTimeISO } from "../../../../../../utils";

const PageNumber = () => <span className="pageNumber" />;
const TotalPages = () => <span className="totalPages" />;

type Props = {
  emissionDate: string;
  userName: string;
};

const StyledDiv = styled.div`
  font-size: 12px;
  font-family: sans-serif;

  width: 100%;
  height: 55px;
  padding: 0 30px;

  position: absolute;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

export const JsxReportLayoutSlotFooter = (props: Props) => {
  const formattedEmissionDate = fmtDateTimeISO(props.emissionDate);

  return (
    <>
      <StyledDiv>
        <span>
          <span>Data de emissão: {formattedEmissionDate}</span>
          <span> — </span>
          <span>Emitido por: {props.userName}</span>
        </span>

        <span>
          Página <PageNumber /> de <TotalPages />.
        </span>
      </StyledDiv>
    </>
  );
};
