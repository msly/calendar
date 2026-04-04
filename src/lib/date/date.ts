function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function toIsoDateString(date: Date): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function parseIsoDate(isoDate: string): Date {
  const match = ISO_DATE_PATTERN.exec(isoDate);
  if (!match) {
    throw new Error(`Invalid ISO date: ${isoDate}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const maxDay = getDaysInMonth(year, month);

  if (month < 1 || month > 12 || day < 1 || day > maxDay) {
    throw new Error(`Invalid ISO date: ${isoDate}`);
  }

  return new Date(Date.UTC(year, month - 1, day));
}

export function isValidIsoDate(isoDate: string): boolean {
  try {
    parseIsoDate(isoDate);
    return true;
  } catch {
    return false;
  }
}

export function getTodayIsoDate(now: Date = new Date()): string {
  return toIsoDateString(now);
}

export function addDays(isoDate: string, days: number): string {
  const date = parseIsoDate(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
