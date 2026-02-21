export async function extractReference(message: string): Promise<string> {

  const regex = /table "(.*?)"/g;
  const matches = [...message.matchAll(regex)];

  let referencedTable =
    matches && matches[1] && matches[1][1] ? matches[1][1] : 'outro_registro';

  referencedTable = await formatString(referencedTable);

  return referencedTable;
}

async function formatString(input: string): Promise<string> {
  if (input.includes('_')) {
    return input
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } else {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
}
