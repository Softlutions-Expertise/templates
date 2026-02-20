export const ENABLE_SYNC_FERIADOS_TICK = true;

export const DIAS_NAO_UTEIS_NACIONAIS = false;

const LOG_DEBUG = false;

export const logDebug = (...msgs: any[]) => {
  if (!LOG_DEBUG) return;

  console.debug(...msgs);
};
