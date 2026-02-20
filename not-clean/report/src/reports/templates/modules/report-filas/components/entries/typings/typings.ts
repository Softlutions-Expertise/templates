import type { IReportFilasAdapterOutput } from "../../../data/report-filas-typings";

export type IYearEntry = IReportFilasAdapterOutput["data"]["data"][0];

export type IYearSecretariaEntry = IYearEntry["secretarias"][number];

export type IYearSecretariaEscolaEntry =
  IYearSecretariaEntry["escolas"][number];

export type IYearSecretariaEscolaEtapaEntry =
  IYearSecretariaEscolaEntry["etapas"][number];

export type IYearSecretariaEscolaEtapaTurnoEntry =
  IYearSecretariaEscolaEtapaEntry["turnos"][number];
