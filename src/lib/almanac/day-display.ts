import { HolidayUtil, Solar } from 'lunar-javascript';
import { isValidIsoDate } from '../date/date';

export const OFFICIAL_HOLIDAY_DATA_START_YEAR = 2002;
export const OFFICIAL_HOLIDAY_DATA_END_YEAR = 2026;

export type OfficialHoliday = {
  name: string;
  status: 'rest' | 'work';
  targetDate: string;
};

export type DayDisplay = {
  isoDate: string;
  weekdayLabel: string;
  lunarLabel: string;
  calendarNote: string;
  solarTerm: string;
  solarFestivals: string[];
  lunarFestivals: string[];
  officialHoliday: OfficialHoliday | null;
  hasOfficialHolidayData: boolean;
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
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const solarTerm = lunar.getJieQi();
  const solarFestivals = solar.getFestivals();
  const lunarFestivals = lunar.getFestivals();
  const holiday = HolidayUtil.getHoliday(year, month, day);
  const calendarNote =
    solarTerm || solarFestivals[0] || lunarFestivals[0] || lunar.getDayInChinese();

  return {
    isoDate,
    weekdayLabel: `星期${solar.getWeekInChinese()}`,
    lunarLabel: `农历${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    calendarNote,
    solarTerm,
    solarFestivals,
    lunarFestivals,
    officialHoliday: holiday
      ? {
          name: holiday.getName(),
          status: holiday.isWork() ? 'work' : 'rest',
          targetDate: holiday.getTarget()
        }
      : null,
    hasOfficialHolidayData:
      year >= OFFICIAL_HOLIDAY_DATA_START_YEAR && year <= OFFICIAL_HOLIDAY_DATA_END_YEAR
  };
}
