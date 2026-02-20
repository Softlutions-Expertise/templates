export async function extractReference(errorMessage: string): Promise<string> {
  const match = errorMessage.match(/table "([^"]+)"/);
  if (match && match[1]) {
    const tableName = match[1];
    return tableName;
  }
  return 'outra tabela';
}
