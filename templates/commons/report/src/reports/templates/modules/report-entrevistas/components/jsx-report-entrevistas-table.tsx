import type { IAutoTableOptions } from "@/reports/templates/components/jsx/report-table/utils/typings";
import { JsxReportSectionSubTitle } from "@/reports/templates/components/jsx/section/jsx-report-section-sub-title";
import { Fragment } from "react/jsx-runtime";
import styled from "styled-components";
import {
  fmtDisplayDateTimeSplitted,
  fmtMaskCpf,
  fmtPersonName,
} from "../../../../../utils";
import { columnGruposPreferenciaisValue } from "../../../base/auto-table-column-grupos-preferenciais";
import { IReportSchemaGenericGrupoPreferencial } from "../../../base/schema-generic-grupos-preferenciais";
import { JsxReportGenericPrefferedGroups } from "../../../base/year-secretaria-preferred-groups";
import { JsxReportAutoTable } from "../../../components/jsx/report-table/jsx-report-auto-table";
import type { IReportEntrevitasTableRow } from "../report-data/report-entrevistas-typings";
import type { IJsxReportEntrevistasProps } from "./jsx-report-entrevistas";

export type Context = {
  grupos_preferenciais:
  | IReportSchemaGenericGrupoPreferencial[]
  | null
  | undefined;
  anonymizeData?: boolean | null | undefined;
};

const options: IAutoTableOptions<IReportEntrevitasTableRow, Context> = {
  columns: [
    {
      key: "crianca.nome",
      label: "Criança",
      value: (row, context) => {
        return fmtPersonName(row.crianca.nome, context?.anonymizeData);
      },
    },
    {
      key: "crianca.cpf",
      label: "CPF",
      shrink: "never",
      value: (row, context) => {
        return fmtMaskCpf(row.crianca.cpf, context?.anonymizeData);
      },
    },
    {
      key: "responsavel.nome",
      label: "Responsável",
      value: (row, context) => (
        <>
          <span>
            {fmtPersonName(row.responsavel.nome, context?.anonymizeData)}
          </span>
          <br />
          <span>-</span>
          <br />
          <span>{fmtMaskCpf(row.responsavel.cpf, context?.anonymizeData)}</span>
        </>
      ),
    },
    {
      key: "entrevistador.nome",
      label: "Entrevistador",
      value: (row, context) => (
        <>
          <span>
            {fmtPersonName(row.entrevistador.nome, context?.anonymizeData)}
          </span>
        </>
      ),
    },
    {
      key: "ano",
      label: "Ano",
      shrink: "never",
      value: (row) => `${row.ano_letivo}`,
    },
    {
      key: "escola",
      label: "Escola",
      value: (row) => {
        const unidade1 = row.preferencia_unidade;
        const unidade2 = row.preferencia_unidade2;
        return (
          <>
            <span>
              {unidade1.nome_fantasia} {(unidade1.irmao_unidade || !unidade1.elegivel_para_fila) && `(${unidade1.irmao_unidade ? "1" : ""}${!unidade1.elegivel_para_fila ? ",2" : ""})`}
            </span>

            {unidade2?.id && (
              <>
                <br />
                <span>-</span>
                <br />
                <span>
                  {unidade2.nome_fantasia} {(unidade2.irmao_unidade || !unidade2.elegivel_para_fila) && `(${unidade2.irmao_unidade ? "1" : ""}${!unidade2.elegivel_para_fila ? ",2" : ""})`}
                </span>
              </>
            )}
          </>
        );
      },
    },
    {
      key: "etapa",
      label: "Etapa",
      shrink: "never",
      value: (row) => `${row.apelido ?? row.etapa}`,
    },
    {
      key: "turno",
      label: "Turno",
      value: (row) => (
        <>
          <span>{row.preferencia_turno} {!row.preferencia_unidade?.elegivel_para_fila && "(2)"}</span>
          {row.preferencia_turno2 && (
            <>
              <br />
              <span>-</span>
              <br />
              <span>{row.preferencia_turno2} {!row.preferencia_unidade2?.elegivel_para_fila && "(2)"}</span>
            </>
          )}
        </>
      ),
    },
    {
      key: "etapa",
      shrink: "never",
      label: (
        <span style={{ whiteSpace: "nowrap" }}>
          Membros
          <br />
          no Endereço / que Trabalham
        </span>
      ),
      value: (row) => (
        <>
          <span>{row.membros_endereco ?? "---"}</span>
          <span>{" / "}</span>
          <span>{row.membros_contribuintes_renda ?? "---"}</span>
        </>
      ),
    },
    {
      key: "etapa",
      label: "Renda Familiar",
      shrink: "never",
      value: (row) => {
        if (row.valor_renda_familiar) {
          const valor = typeof row.valor_renda_familiar === 'string'
            ? parseFloat(row.valor_renda_familiar)
            : row.valor_renda_familiar;

          return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return '---';
      },
    },
    {
      key: "entrevista.dataHora",
      label: "Data e Hora da Entrevista",
      shrink: "never",
      value: (row) =>
        `${fmtDisplayDateTimeSplitted(
          row.data_entrevista,
          row.horario_entrevista
        )}`,
    },
    {
      key: "entrevista.situacao",
      label: "Situação",
      value: (row) => `${row.situacao}`,
    },
    {
      key: "entrevista.elegibilidade",
      label: "Elegibilidade",
      value: (row) => `${row.elegivelParaFila}`,
    },
    {
      key: "gruposPreferenciais",
      label: "Grupos Preferenciais",

      shrink: "never",

      value: (row, context) => {
        return columnGruposPreferenciaisValue(
          context?.grupos_preferenciais,
          row.criterios
        );
      },
    },
  ],
};

type Props = Pick<IJsxReportEntrevistasProps, "payload">;

const StyledHeader = styled.header`
  text-align: center;
  margin: 1rem 0;
`;

export const JsxReportEntrevistasTable = (props: Props) => {
  const { payload } = props;

  return (
    <>
      {payload.data.data.map((yearEntry) => (
        <Fragment key={`${yearEntry.year}`}>
          {yearEntry.secretarias.map((yearSecretariaEntry) => {
            const context: Context = {
              grupos_preferenciais: yearSecretariaEntry.grupos_preferenciais,
              anonymizeData: payload.metadata.filters.anonymizeData,
            };

            return (
              <Fragment key={`${yearSecretariaEntry.secretaria}`}>
                <JsxReportGenericPrefferedGroups
                  viewPreferredGroups={true}
                  grupos_preferenciais={
                    yearSecretariaEntry.grupos_preferenciais
                  }
                />

                <JsxReportSectionSubTitle title="resultados" />

                <div style={{ margin: "1em 0" }}>
                  <p style={{ fontWeight: "bold" }}>NOTAS:</p>

                  <p>
                    1: Indica que a criança entrevistada possui irmão na
                    unidade escolar desejada.
                  </p>
                  <p>
                    2: Indica que a criança entrevistada NÃO esta concorrendo na fila da unidade escolar/turno especificado.
                  </p>
                </div>

                <JsxReportAutoTable
                  $fontSize="0.75em"
                  options={options}
                  context={context}
                  rows={yearSecretariaEntry.entrevistas}
                  totalCount={{ label: "Total de Entrevistas" }}
                />
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </>
  );
};
