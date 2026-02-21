import { JsxReportGenericPrefferedGroups } from "../../../../base/year-secretaria-preferred-groups";
import { JsxReportSectionBlocks } from "../../../../components/jsx/section/jsx-report-section-blocks";
import type { IJsxReportFilasProps } from "../jsx-report-filas";
import { JsxReportFilasEntryYearSecretariaEscola } from "./jsx-report-filas-entry-year-secretaria-escola";
import type { IYearEntry, IYearSecretariaEntry } from "./typings/typings";

type Props = Pick<IJsxReportFilasProps, "payload"> & {
  yearEntry: IYearEntry;
  secretariaEntry: IYearSecretariaEntry;
};

export const JsxReportFilasEntryYearSecretaria = (props: Props) => {
  const { payload, yearEntry, secretariaEntry } = props;

  return (
    <>
      <div>
        <JsxReportSectionBlocks
          size="medium"
          blocks={[
            {
              value: `${yearEntry.year} — ${secretariaEntry.secretaria}`,
              expand: true,
            },
          ]}
        />

        <JsxReportGenericPrefferedGroups
          viewPreferredGroups={payload.metadata.filters.viewPreferredGroups}
          grupos_preferenciais={secretariaEntry.grupos_preferenciais}
        />

        {secretariaEntry.escolas?.map((escolaEntry) => (
          <JsxReportFilasEntryYearSecretariaEscola
            key={escolaEntry.escola}
            {...props}
            escolaEntry={escolaEntry}
          />
        ))}
      </div>
    </>
  );
};
