import styled from "styled-components";
import { AppAsset, appStaticUrl } from "../../../../../static/app-static";

const StyledHeader = styled.header`
  .report-brand {
    padding: 0 1em;

    gap: 1em;

    display: flex;
    align-items: center;

    .logo {
      width: 42px;
      height: 26px;
    }

    .nome-sistema {
      color: #00306e;
      font-weight: bold;

      margin-bottom: 0.25em;
    }
  }
`;

export const JsxReportBrandHeader = () => {
  return (
    <>
      <StyledHeader>
        <div className="report-brand">
          <img
            className="logo"
            alt="Bandeira do Estado de Rondônia"
            src={appStaticUrl(AppAsset.IMAGES_BANDEIRA_RO)}
          />

          <div>
            <p className="nome-sistema">
              Sistema de Gerenciamento de Vagas em Creches
            </p>
            <p className="poder-publico">Secretaria de Educação</p>
          </div>
        </div>
      </StyledHeader>
    </>
  );
};
