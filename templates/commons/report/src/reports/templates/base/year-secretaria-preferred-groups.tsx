import styled from "styled-components";
import { JsxReportAutoTable } from "../components/jsx/report-table/jsx-report-auto-table";
import { IReportSchemaGenericGrupoPreferencial } from "./schema-generic-grupos-preferenciais";
import { fmtDisplayPriorityOrder } from "./utils/preffered-groups";

type Props = {
  grupos_preferenciais?:
    | IReportSchemaGenericGrupoPreferencial[]
    | null
    | undefined;

  viewPreferredGroups?: boolean | null | undefined;
};

const StyledHeader = styled.header`
  text-align: center;
  margin: 1rem 0;
`;

export const JsxReportGenericPrefferedGroups = (props: Props) => {
  const { viewPreferredGroups, grupos_preferenciais } = props;

  const rows = grupos_preferenciais;

  return (
    <>
      {viewPreferredGroups && (
        <section>
          <StyledHeader>
            <p>Grupos Preferenciais</p>
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

                    value: (row) => row.criterio,
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
