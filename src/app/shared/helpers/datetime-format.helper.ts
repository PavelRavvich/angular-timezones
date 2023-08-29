export function applyUtcOffset(date: Date, offset: string): Date {
  const hoursOffset = parseFloat(offset);
  date.setUTCHours(date.getUTCHours() + hoursOffset);
  return date;
}

export function formatTime(date: Date): string {
  const hours = pad(date.getUTCHours(), 2);
  const minutes = pad(date.getUTCMinutes(), 2);
  const seconds = pad(date.getUTCSeconds(), 2);
  return `${hours}:${minutes}:${seconds}`;
}

export function formatDate(date: Date): string {
  const day = pad(date.getUTCDate(), 2);
  const month = pad(date.getUTCMonth() + 1, 2);
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

function pad(num: number, size: number): string {
  let s = String(num);
  while (s.length < size) s = "0" + s;
  return s;
}
