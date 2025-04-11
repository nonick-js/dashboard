import pc from 'picocolors';

export function logTimestamp() {
  return pc.gray(
    `[${new Date().toLocaleString('ja-JP', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}]`,
  );
}
