export async function extractReference(errorMessage: string): Promise<string> {
  const match = errorMessage.match(/table "([^"]+)"/);
  if (match && match[1]) {
    return match[1];
  }
  return 'outra tabela';
}
