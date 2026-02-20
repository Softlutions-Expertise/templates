import { has } from "lodash-es";
import { JsxReportSectionTitle } from "../../../components/jsx/section/jsx-report-section-title";
import { ReportVagasType } from "../data/report-vagas-typings";

const getTitleFromCode = (code: string) => {
  const codeMappings = {
    [ReportVagasType.VAGAS_OCUPADAS]: "VAGAS OCUPADAS",
    [ReportVagasType.VAGAS_LIVRES]: "VAGAS LIVRES",
  };

  if (has(codeMappings, code)) {
    return codeMappings[code];
  }

  return code;
};

export const JsxReportVagasTitle = (props: { type: string }) => {
  const asTitle = getTitleFromCode(props.type);

  return (
    <>
      <JsxReportSectionTitle title={`RELATÓRIO DE ${asTitle}`} />
    </>
  );
};
