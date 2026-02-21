'use client';

export function useOrientation(orientation: 'vertical' | 'horizontal'): boolean {
  if (orientation === 'vertical') {
    return window.innerHeight > window.innerWidth;
  }
  return window.innerHeight < window.innerWidth;
}
