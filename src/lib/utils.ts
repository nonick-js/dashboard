/** 指定の長さを超える文字列を「...」で省略する */
export function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) return `${str.substring(0, maxLength)}...`;
  return str;
}

/** 任意の間待機する */
export async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/** オブジェクト内のnumber型の値をstring型に変換する */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function convertNumbersToStrings(obj: { [x: string]: any }) {
  for (const key in obj) {
    if (typeof obj[key] === 'number') {
      obj[key] = obj[key].toString();
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map((item) => (typeof item === 'number' ? item.toString() : item));
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      convertNumbersToStrings(obj[key]);
    }
  }
  return obj;
}
