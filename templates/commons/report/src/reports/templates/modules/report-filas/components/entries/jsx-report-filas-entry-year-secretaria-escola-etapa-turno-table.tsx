import type { IAutoTableOptions } from "@/reports/templates/components/jsx/report-table/utils/typings";
import { Fragment } from "react/jsx-runtime";
import {
  PLACEHOLDER_DASHES_LONG,
  fmtDisplayDate,
  fmtMaskCpf,
  fmtPersonName,
  fmtSuffixPluralDays,
} from "../../../../../../utils";
import { sortChronological } from "../../../../../../utils/sort";
import { columnGruposPreferenciaisValue } from "../../../../base/auto-table-column-grupos-preferenciais";
import { JsxReportAutoTable } from "../../../../components/jsx/report-table/jsx-report-auto-table";
import type { ReportFilasSchemaDataDataYearSecretariaEscolaEtapaTurnoEntryFilaPosicao } from "../../data/input/data/schema-data-data-year-secretaria-escola-etapa-turno-entry-fila-posicao";
import type { IYearSecretariaEntry } from "./typings/typings";

export type FilaPosicao = {
  entry: ReportFilasSchemaDataDataYearSecretariaEscolaEtapaTurnoEntryFilaPosicao;
};

type Context = {
  anonymize: boolean;
  viewPrefferedGroups: boolean;
  yearSecretaria: IYearSecretariaEntry;
};

const options: IAutoTableOptions<FilaPosicao, Context> = {
  columns: [
    {
      key: "posicao",
      label: "Posição",
      value: (row) => {
        return `${row.entry.posicao_geral}º`;
      },
    },
    {
      key: "crianca.nome",
      label: "Nome da Criança",
      value: (row, context) => {
        return fmtPersonName(row.entry.crianca.nome, context?.anonymize);
      },
    },
    {
      key: "crianca.cpf",
      label: "CPF",

      value: (row, context) => {
        return fmtMaskCpf(row.entry.crianca.cpf, context?.anonymize);
      },

      shrink: "never",
    },
    {
      key: "crianca.nascimento",
      label: "Nascimento",
      value: (row) => {
        return fmtDisplayDate(row.entry.crianca.data_nascimento);
      },
    },
    {
      key: "responsavel.nome",
      label: "Responsável",
      value: (row, context) => {
        return fmtPersonName(row.entry.responsavel.nome, context?.anonymize);
      },
    },
    {
      key: "contatos",
      label: "Contatos",
      shrink: "never",
      value: (row) => {
        const ordered = row.entry.registros_contato.sort((a, b) => {
          return sortChronological("asc", a.data_contato, b.data_contato);
        });

        if (ordered.length === 0) {
          return PLACEHOLDER_DASHES_LONG;
        }

        return (
          <>
            {ordered.map((registroContato, index) => {
              const order = `${index + 1}`;
              const data = fmtDisplayDate(registroContato.data_contato);

              return (
                <Fragment key={index}>
                  {index > 0 && <br />}
                  {order}º {data}
                </Fragment>
              );
            })}
          </>
        );
      },
    },

    {
      key: "entrada-espera",
      label: "Entrada e Espera",

      value: (row) => {
        const date = fmtDisplayDate(row.entry.data_entrevista);
        const wait = fmtSuffixPluralDays(row.entry.dias_permanencia);
        return `${date} - ${wait}`;
      },

      shrink: "never",
    },

    {
      key: "gruposPreferenciais",
      label: "Grupos Preferenciais",

      shrink: "never",

      isEnabled: (context) => {
        return context?.viewPrefferedGroups === true;
      },

      value: (row, context) => {
        return columnGruposPreferenciaisValue(
          context?.yearSecretaria?.grupos_preferenciais,
          row.entry.criterios
        );
      },
    },
  ],
};

type Props = {
  entries: FilaPosicao[];
  context: Context;
};

export const JsxReportFilasEntryYearSecretariaEscolaEtapaTurnoTable = (
  props: Props
) => {
  const { context, entries } = props;

  return (
    <>
      <JsxReportAutoTable
        rows={entries}
        context={context}
        options={options}
        totalCount={{ label: "Total de Entrevistas" }}
      />
    </>
  );
};
