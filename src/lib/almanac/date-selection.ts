import { Solar } from 'lunar-javascript';
import { addDays, isValidIsoDate } from '../date/date';
import { getDayDisplay, type OfficialHoliday } from './day-display';

export const DATE_SELECTION_ACTIVITIES = [
  { value: 'wedding', label: '结婚嫁娶', keywords: ['嫁娶'] },
  { value: 'moving', label: '搬家入宅', keywords: ['入宅', '移徙'] },
  { value: 'opening', label: '开业开市', keywords: ['开市'] },
  { value: 'travel', label: '出行', keywords: ['出行'] },
  { value: 'renovation', label: '动土装修', keywords: ['动土', '修造'] },
  { value: 'blessing', label: '祈福', keywords: ['祈福'] },
  { value: 'bed', label: '安床', keywords: ['安床'] },
  { value: 'trade', label: '签约交易', keywords: ['交易', '立券'] }
] as const;

export type DateSelectionActivity = (typeof DATE_SELECTION_ACTIVITIES)[number]['value'];
export type DateSelectionRange = 30 | 90;

export type DateSelectionFilters = {
  excludeMakeUpWorkdays: boolean;
  weekendsOrRestDaysOnly: boolean;
};

export type DateSelectionMatch = {
  isoDate: string;
  weekdayLabel: string;
  lunarLabel: string;
  calendarNote: string;
  suitable: string[];
  clash: string;
  officialHoliday: OfficialHoliday | null;
  isWeekend: boolean;
};

function getActivity(activity: DateSelectionActivity) {
  const definition = DATE_SELECTION_ACTIVITIES.find((item) => item.value === activity);
  if (!definition) {
    throw new Error(`Unsupported date-selection activity: ${activity}`);
  }
  return definition;
}

function isWeekend(isoDate: string): boolean {
  const day = new Date(`${isoDate}T00:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
}

export function findSuitableDates(
  startDate: string,
  range: DateSelectionRange,
  activity: DateSelectionActivity,
  filters: DateSelectionFilters,
): DateSelectionMatch[] {
  if (!isValidIsoDate(startDate)) {
    throw new Error(`Invalid start date: ${startDate}`);
  }

  const activityDefinition = getActivity(activity);
  const results: DateSelectionMatch[] = [];

  for (let offset = 0; offset < range; offset += 1) {
    const isoDate = addDays(startDate, offset);
    const [year, month, day] = isoDate.split('-').map(Number);
    const lunar = Solar.fromYmd(year, month, day).getLunar();
    const suitable = lunar.getDayYi();
    const avoid = lunar.getDayJi();
    const matchesSuitable = activityDefinition.keywords.some((keyword) => suitable.includes(keyword));
    const matchesAvoid = activityDefinition.keywords.some((keyword) => avoid.includes(keyword));

    if (!matchesSuitable || matchesAvoid) {
      continue;
    }

    const dayDisplay = getDayDisplay(isoDate);
    const weekend = isWeekend(isoDate);
    const isMakeUpWorkday = dayDisplay.officialHoliday?.status === 'work';
    const isRestDay = dayDisplay.officialHoliday?.status === 'rest';

    if (filters.excludeMakeUpWorkdays && isMakeUpWorkday) {
      continue;
    }

    if (filters.weekendsOrRestDaysOnly && ((!weekend && !isRestDay) || isMakeUpWorkday)) {
      continue;
    }

    results.push({
      isoDate,
      weekdayLabel: dayDisplay.weekdayLabel,
      lunarLabel: dayDisplay.lunarLabel,
      calendarNote:
        dayDisplay.solarTerm ||
        dayDisplay.solarFestivals[0] ||
        dayDisplay.lunarFestivals[0] ||
        '',
      suitable: activityDefinition.keywords.filter((keyword) => suitable.includes(keyword)),
      clash: `${lunar.getDayChongDesc()} 煞${lunar.getDaySha()}`,
      officialHoliday: dayDisplay.officialHoliday,
      isWeekend: weekend
    });
  }

  return results;
}
