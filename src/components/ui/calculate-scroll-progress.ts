export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): number {
  const maxScrollTop = scrollHeight - clientHeight;

  if (maxScrollTop <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (scrollTop / maxScrollTop) * 100));
}