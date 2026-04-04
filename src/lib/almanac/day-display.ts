import { Solar } from 'lunar-javascript';
import { isValidIsoDate } from '../date/date';

export type DayDisplay = {
  isoDate: string;
  weekdayLabel: string;
  lunarLabel: string;
  calendarNote: string;
};

type SolarDisplayApi = {
  getWeekInChinese: () => string;
  getLunar: () => LunarDisplayApi;
};

type LunarDisplayApi = {
  getJieQi: () => string;
  getDayInChinese: () => string;
  getMonthInChinese: () => string;
};

function parseIsoDateParts(isoDate: string): [number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);

  if (!match || !isValidIsoDate(isoDate)) {
    throw new Error(`Invalid ISO date: ${isoDate}`);
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function getDayDisplay(isoDate: string): DayDisplay {
  const [year, month, day] = parseIsoDateParts(isoDate);
  const solar = Solar.fromYmd(year, month, day) as unknown as SolarDisplayApi;
  const lunar = solar.getLunar();
  const calendarNote = lunar.getJieQi() || lunar.getDayInChinese();

  return {
    isoDate,
    weekdayLabel: `星期${solar.getWeekInChinese()}`,
    lunarLabel: `农历${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    calendarNote
  };
}
