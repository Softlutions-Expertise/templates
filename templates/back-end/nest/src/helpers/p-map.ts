import PMapModule from 'p-map';

export const getPMap = async () => {
  const inclusion = await import('inclusion');
  const { default: PMap } = await inclusion('p-map');
  return PMap as typeof PMapModule;
};
