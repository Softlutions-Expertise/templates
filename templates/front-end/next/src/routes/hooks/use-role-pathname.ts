// utils/find-roles-by-pathname.ts
// Observações:
// - Lê seu objeto `pages` (como o que você colou).
// - Suporta path string e path como função (ex.: (id) => `/.../${id}/edit`).
// - Faz um "score" por similaridade de segmentos e chaves de query.
// - Retorna as roles do melhor match (ou undefined).

import { pages } from "../pages";

type AnyObj = Record<string, any>;

/** Escapa regex de forma segura */
const escapeRegex = (s: string) =>
    s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Converte path (string ou função) em um "padrão" com marcadores e um regex */
function normalizeToPattern(nodePath: string | ((...args: any[]) => string)) {
    if (typeof nodePath === "string") {
        const pattern = nodePath;
        return {
            pattern,
            // regex de match total
            regex: new RegExp("^" + escapeRegex(pattern) + "$"),
            // regex parcial (para similaridade por segmentos)
            partial: pattern,
            isDynamic: false,
        };
    }

    // path é função: chamamos com placeholders para gerar um "exemplo" de padrão
    const arity = nodePath.length; // nº de parâmetros declarados
    const placeholders = Array.from({ length: arity }, (_, i) => `__SEG${i + 1}__`);
    const pattern = nodePath(...placeholders);
    // converte placeholders em curingas de regex (path: [^/]+, query: [^&?#/]+)
    let escaped = escapeRegex(pattern);
    escaped = escaped
        .replace(/__SEG\d+__/g, (m) => m); // volta placeholders antes de trocar por regex
    // path (entre /) -> [^/]+ ; em query -> [^&?#/]+ (tratamos igual pra simplificar)
    escaped = escaped.replace(/__SEG\d+__/g, "[^/&?#]+");

    return {
        pattern,
        regex: new RegExp("^" + escaped + "$"),
        partial: pattern,
        isDynamic: true,
    };
}

/** Separa path e query em {pathParts, queryKeys} para pontuar similaridade */
function splitPathAndQuery(url: string) {
    const [path, qs] = url.split("?");
    const pathParts = path.replace(/\/+$/, "").split("/").filter(Boolean);
    const queryKeys = new Set<string>();
    if (qs) {
        for (const pair of qs.split("&")) {
            const [k] = pair.split("=");
            if (k) queryKeys.add(decodeURIComponent(k));
        }
    }
    return { pathParts, queryKeys };
}

/** Extrai as chaves de query do padrão (ignorando valores) */
function extractPatternQueryKeys(pattern: string) {
    const [, qs] = pattern.split("?");
    const keys = new Set<string>();
    if (!qs) return keys;
    for (const pair of qs.split("&")) {
        const [k] = pair.split("=");
        if (k) keys.add(k);
    }
    return keys;
}

/** Pontua similaridade entre url e padrão por segmentos (com wildcard) + chaves de query */
function scoreSimilarity(url: string, pattern: string) {
    const { pathParts: uParts, queryKeys: uQ } = splitPathAndQuery(url);
    const { pathParts: pParts } = splitPathAndQuery(pattern);

    // path score (wildcard = placeholder gerado p/ função: "__SEGn__" ou valores ':')
    let matches = 0;
    const maxLen = Math.max(uParts.length, pParts.length);
    for (let i = 0; i < Math.min(uParts.length, pParts.length); i++) {
        const seg = pParts[i];
        if (
            seg === uParts[i] ||
            /__SEG\d+__/.test(seg) ||
            seg.startsWith(":") // se você quiser usar :param manualmente em algum path
        ) {
            matches++;
        }
    }
    const pathScore = maxLen === 0 ? 0 : matches / maxLen;

    // query score (considera apenas presença de chaves do padrão)
    const pQ = extractPatternQueryKeys(pattern);
    const totalKeys = pQ.size || 1;
    let qMatches = 0;
    pQ.forEach((k) => {
        if (uQ.has(k)) qMatches++;
    });
    const queryScore = qMatches / totalKeys;

    // peso leve para query
    return pathScore + queryScore * 0.1;
}

/** Varre recursivamente o objeto pages e coleta todos os nós com {path, roles} */
function collectRoutes(node: AnyObj, chain: string[] = []) {
    const out: Array<{
        keyChain: string[];
        node: AnyObj;
        pathValue: string | ((...args: any[]) => string);
        roles: any | undefined;
    }> = [];

    const hasPath = typeof node?.path === "string" || typeof node?.path === "function";
    if (hasPath) {
        out.push({
            keyChain: chain,
            node,
            pathValue: node.path,
            roles: node.roles,
        });
    }

    // percorre filhos
    for (const key of Object.keys(node)) {
        if (key === "path" || key === "roles") continue;
        const child = node[key];
        if (child && typeof child === "object") {
            out.push(...collectRoutes(child, [...chain, key]));
        }
    }

    return out;
}

export function useRolePathname(
    pathname: string,
): { roles: any | undefined; keyChain: string[]; matchedPath: string; isExact: boolean } | undefined {
    const all = collectRoutes(pages);

    let best:
        | {
            roles: any | undefined;
            keyChain: string[];
            matchedPath: string;
            isExact: boolean;
            score: number;
        }
        | undefined;

    for (const item of all) {
        const { pattern, regex, partial } = normalizeToPattern(item.pathValue);
        const isExact = regex.test(pathname);
        const score = isExact ? Number.POSITIVE_INFINITY : scoreSimilarity(pathname, partial);

        if (!best || score > best.score) {
            best = {
                roles: item.roles,
                keyChain: item.keyChain,
                matchedPath: pattern,
                isExact,
                score,
            };
        }
    }

    if (!best) return undefined;
    return {
        roles: best.roles,
        keyChain: best.keyChain,
        matchedPath: best.matchedPath,
        isExact: best.isExact,
    };
}
