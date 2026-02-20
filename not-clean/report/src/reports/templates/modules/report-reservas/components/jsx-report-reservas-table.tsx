import { InjectGrupoPreferencialCronologico, IReportSchemaGenericGrupoPreferencial } from "@/reports/templates/base/schema-generic-grupos-preferenciais";
import type { IAutoTableOptions } from "@/reports/templates/components/jsx/report-table/utils/typings";
import {
  fmtDate,
  fmtEnumerable,
  fmtMaskCpf,
  fmtPersonName,
  PLACEHOLDER_DASHES_LONG,
  sortGrupoPreferencial
} from "../../../../../utils";
import { JsxReportAutoTable } from "../../../components/jsx/report-table/jsx-report-auto-table";
import { type IReportReservasTableRow } from "../data/report-reservas-typings";
import type { IJsxReportReservasProps } from "./jsx-report-reservas";
import { fmtDisplayPriorityOrder } from "./utils/preffered-groups";

export type Context = {
    grupos_preferenciais:
      | IReportSchemaGenericGrupoPreferencial[]
      | null
      | undefined;
  anonymizeData?: boolean | null | undefined;
};

const optionsBase: IAutoTableOptions<IReportReservasTableRow, Context> = {
  columns: [
    {
      key: "codigo",
      label: "Código",
      shrink: "never",
      value: (row, context) =>
        context?.anonymizeData ? "***" : row.codigo_reserva_vaga,
    },
    {
      key: "data_registro",
      label: "Data de Registro",
      shrink: "never",
      value: (row) => fmtDate(row.data_reserva_vaga, "date-time"),
    },
    {
      key: "data_referencia",
      label: "Data de Atualização",
      shrink: "never",
      value: (row) => fmtDate(row.data_referencia, "date"),
    },
    {
      key: "nome",
      label: "Nome",
      value: (row, context) =>
        fmtPersonName(row.criancaNome, context?.anonymizeData),
    },
    {
      key: "cpf",
      label: "CPF",
      shrink: "never",
      value: (row, context) =>
        fmtMaskCpf(row.criancaCpf, context?.anonymizeData),
    },
    {
      key: "escola",
      label: "Unidade Escolar",
      value: (row) => row.escola,
    },
    {
      key: "etapa",
      label: "Etapa",
      shrink: "never",
      value: (row) => row.etapa,
    },
    {
      key: "turno",
      label: "Turno",
      shrink: "never",
      value: (row) => row.turno,
    },
    {
      key: "turma",
      label: "Turma",
      value: (row) => row.turma,
    },
    {
      key: "status",
      label: "Status",
      value: (row) => row.status,
    },
    {
      key: "matricula",
      label: "Matrícula",
      value: (row, context) =>
        context?.anonymizeData ? "***" : row.matricula,
    },
   {
      key: "grupo_preferencial",
      label: "Grupo Preferencial",
      value: (row, context) => {
        const entryCriterios = row.criterios ?? [];

        let criterios = [...entryCriterios];

        criterios = criterios.sort((a, b) =>
          sortGrupoPreferencial("asc", a, b)
        );

        const grupos_preferenciais = context?.grupos_preferenciais ?? [];
    

        if (criterios.length === 0 || !grupos_preferenciais) {
          return PLACEHOLDER_DASHES_LONG;
        }

        return (
          <>
            {fmtEnumerable(
              criterios.map((criterio) =>
                fmtDisplayPriorityOrder(grupos_preferenciais, {
                  posicao: criterio.posicao,
                  subPosicao: criterio.subPosicao,
                })
              )
            )}
          </>
        );
      },
    },
  ],
};

const options: IAutoTableOptions<IReportReservasTableRow, Context> = {
  columns: [...optionsBase.columns],
};

type Props = Pick<IJsxReportReservasProps, "payload"> & {
  context: Context;
};

export const JsxReportReservasTable = (props: Props) => {
  const {  payload } = props;

  const rows = payload.data.data.flatMap((item: any) =>
    item.secretarias.flatMap((secretaria: any) =>
      secretaria.escolas.flatMap((escola: any) =>
        escola.etapas.flatMap((etapa: any) =>
          etapa.turnos.flatMap((turno: any) =>
            turno.entries.map((entry: any) => {
                const criterioTime = InjectGrupoPreferencialCronologico((payload?.data?.data[0] as any)?.secretarias?.[0]?.grupos_preferenciais)?.slice(-1)

              return {
                codigo_reserva_vaga: entry.codigo_reserva_vaga,
                data_reserva_vaga: entry.data_reserva_vaga,
                data_referencia: entry.data_referencia,
                criancaNome: entry.crianca.nome,
                criancaCpf: entry.crianca.cpf,
                escola: escola.escola,
                etapa: etapa.apelido ?? etapa.etapa,
                turno: turno.turno,
                turma: entry.turma.nome,
                status: entry.status,
                matricula: entry.matricula,
                criterios: [...entry?.criterios, ...criterioTime as any]
              };
            })
          )
        )
      )
    )
  );



  const context = {
    ...props.context,
    grupos_preferenciais: InjectGrupoPreferencialCronologico((payload?.data?.data[0] as any)?.secretarias[0]?.grupos_preferenciais)
  };

  return (
    <>
      <JsxReportAutoTable
        $fontSize="0.6em"
        options={options}
        context={context}
        rows={rows}
        totalCount={{ label: "Total" }}
      />
     
    </>
  );
};
