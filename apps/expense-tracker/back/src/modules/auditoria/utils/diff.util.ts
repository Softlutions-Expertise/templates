/**
 * Calcula a diferença entre dois objetos (before vs after)
 * Retorna apenas os campos que mudaram
 */
export interface ChangeDiff {
  field: string;
  from: any;
  to: any;
}

export interface DiffResult {
  /** Lista de campos alterados */
  changedFields: string[];
  /** Detalhes das alterações */
  changes: ChangeDiff[];
  /** Se houve alteração */
  hasChanges: boolean;
}

/**
 * Calcula diff entre dois objetos
 */
export function calcularDiff(before: Record<string, any>, after: Record<string, any>): DiffResult {
  const changes: ChangeDiff[] = [];
  const changedFields: string[] = [];

  // Pega todas as chaves únicas
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    const from = before[key];
    const to = after[key];

    // Compara valores (tratando null/undefined)
    if (!isEqual(from, to)) {
      changes.push({ field: key, from, to });
      changedFields.push(key);
    }
  }

  return {
    changedFields,
    changes,
    hasChanges: changes.length > 0,
  };
}

/**
 * Compara dois valores (suporta objetos aninhados simples)
 */
function isEqual(a: any, b: any): boolean {
  // Trata null/undefined como equivalentes
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;

  // Tipos diferentes
  if (typeof a !== typeof b) return false;

  // Objetos/Arrays
  if (typeof a === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  // Primitivos
  return a === b;
}

/**
 * Mascara campos sensíveis (ex: senhas)
 */
export function mascararSensiveis(
  obj: Record<string, any>, 
  camposSensiveis: string[]
): Record<string, any> {
  if (!obj || !camposSensiveis?.length) return obj;

  const result = { ...obj };
  for (const campo of camposSensiveis) {
    if (result[campo] !== undefined) {
      result[campo] = '***';
    }
  }
  return result;
}

/**
 * Extrai dados relevantes para auditoria
 * Remove campos internos/metadados
 */
export function sanitizarDados(obj: Record<string, any>): Record<string, any> {
  if (!obj) return obj;
  
  const camposRemover = [
    'password',
    'senha',
    'token',
    'refreshToken',
    '__v',
    '_version',
    'deletedAt',
  ];

  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (camposRemover.includes(key)) continue;
    if (key.startsWith('_')) continue;
    
    // Trata datas
    if (value instanceof Date) {
      result[key] = value.toISOString();
    } else if (typeof value === 'object' && value !== null) {
      // Evita circularidade e objetos muito grandes
      try {
        JSON.stringify(value);
        result[key] = value;
      } catch {
        // Ignora objetos não serializáveis
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}
