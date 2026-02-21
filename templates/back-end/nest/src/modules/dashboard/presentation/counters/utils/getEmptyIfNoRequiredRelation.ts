export const getEmptyIfNoRequiredRelation = (
  secretariasIds: string[] | null,
  escolasIds: string[] | null,
) => {
  if (secretariasIds && secretariasIds.length === 0) return true;
  if (escolasIds && escolasIds.length === 0) return true;

  return false;
};
