import { JsxReportHeaderToggles } from "../../../components/jsx/report-header/toggles/jsx-report-header-toggles";
import { IJsxReportEntrevistasProps } from "./jsx-report-entrevistas";

type Props = Pick<IJsxReportEntrevistasProps, "payload">;

const TOGGLE_LABELS = {
  ANONYMIZE_DATA: "Informações pessoais anonimizadas.",
};

export const JsxReportEntrevistasToggles = (props: Props) => {
  const { payload } = props;

  const criterios = payload.metadata.filters.criterios ?? [];
  const filterPreferredGroups = payload.metadata.filters.filterPreferredGroups;
  return (
    <>
      {filterPreferredGroups && criterios.length > 0 && (
        <div>
          <p
            style={{
              marginBottom: "-0.75em",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              Filtragem de Critérios:{" "}
            </span>

            <span>{filterPreferredGroups ?? "?"}</span>
          </p>
          <div>
            <JsxReportHeaderToggles
              toggles={[
                ...criterios.map((criterio) => ({
                  activeLabel: criterio.nome,
                  value: true,
                })),
              ]}
            />
          </div>
        </div>
      )}
      <JsxReportHeaderToggles
        toggles={[
          {
            activeLabel: TOGGLE_LABELS.ANONYMIZE_DATA,
            value: payload.metadata.filters.anonymizeData,
          },
        ]}
      />
    </>
  );
};
