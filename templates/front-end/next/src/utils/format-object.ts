export function getCodFromObject(item: any): number {
  if (typeof item === 'object' && item !== null && 'cod' in item) {
    return item.cod;
  }
  return item;
}
