export const nullToUndefined = <T>(value: T | null): T | undefined =>
  value === null ? undefined : value;

export async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function intersect<T, S>(
  a: readonly T[],
  b: readonly S[],
  compareFn: (a: T, b: S) => boolean,
): T[] {
  return a.filter((x) => b.some((y) => compareFn(x, y)));
}

export function zeroPadding(num: number, length: number): string {
  return `${num}`.padStart(length, '0');
}
