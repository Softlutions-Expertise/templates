import { usePathname } from 'next/navigation';

// ----------------------------------------------------------------------

type ReturnType = boolean;

export function useActiveLink(path: string): ReturnType {
  const pathname = usePathname();

  if (path === '#disabled') return false;

  function removeLastSlash(str: string) {
    if (str.charAt(str.length - 1) === '/') {
      return str.slice(0, -1);
    }
    return str;
  }

  const checkKeywordsInPathname = removeLastSlash(pathname) === removeLastSlash(path);

  return checkKeywordsInPathname;
}
