import { InjectGrupoPreferencialCronologico } from "@/reports/templates/base/schema-generic-grupos-preferenciais";
import styled from "styled-components";
import { JsxReportAutoTable } from "../../../components/jsx/report-table/jsx-report-auto-table";
import { fmtDisplayPriorityOrder } from "./utils/preffered-groups";
//TODO Criar componente para reserva de reservas

//type Props = Pick<IJsxReportReservasProps, "payload">;

const StyledHeader = styled.header`
  text-align: center;
  margin: 1rem 0;
`;

export const JsxReportFilasEntryYearSecretariaPrefferedGroups = (
  props: any,
) => {
  const { payload } = props;
  const rows: any = InjectGrupoPreferencialCronologico(payload.data.data[0]?.secretarias[0]?.grupos_preferenciais)

  return (
    <>
      {payload.metadata.filters.viewPreferredGroups && (
        <section style={{margin: '1rem 0'}}>
          <StyledHeader>
            <p>Grupos Preferenciais </p>
          </StyledHeader>

          {!rows && "Indisponível no momento."}

          {rows && (
            <JsxReportAutoTable
              rows={rows}
              totalCount={false}
              options={{
                columns: [
                  {
                    key: "posicao",
                    label: "Prioridade",
                    value: (row) => `${fmtDisplayPriorityOrder(rows, row)}`,
                  },
                  {
                    key: "descricao",
                    label: "Grupo Preferencial",

                    value: (row: any) => row.criterio,
                  },
                  {
                    key: "embasamento",
                    label: "Embasamento",
                    value: (row) => {
                      switch (row.posicao) {
                        case 3: {
                          return "Previsto em lei";
                        }

                        case 8: {
                          return (
                            <>
                              Critério pertinente
                              <br />
                              ao município
                            </>
                          );
                        }

                        default: {
                          return (
                            <>
                              Item Obrigatório
                              <br />
                              Nota Técnica
                            </>
                          );
                        }
                      }
                    },
                  },
                ],
              }}
            />
          )}
        </section>
      )}
    </>
  );
};
