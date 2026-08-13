import { useNavigate } from 'react-router-dom';
import { MonthCalendar } from '../components/calendar/MonthCalendar';
import {
  OFFICIAL_HOLIDAY_DATA_END_YEAR,
  OFFICIAL_HOLIDAY_DATA_START_YEAR
} from '../lib/almanac/day-display';
import { useDateContext } from '../state/date-context';

function parseYearMonth(isoDate: string): { year: number; month: number } {
  const [yearPart, monthPart] = isoDate.split('-');
  return { year: Number(yearPart), month: Number(monthPart) };
}

export function CalendarPage() {
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate } = useDateContext();
  const { year, month } = parseYearMonth(selectedDate);
  const monthLabel = `${year}-${String(month).padStart(2, '0')}`;

  const handleSelectDate = (isoDate: string) => {
    setSelectedDate(isoDate);
    navigate(`/day/${isoDate}`);
  };

  return (
    <main className="app-shell calendar-page">
      <h1>月历查日</h1>
      <p>{monthLabel}</p>
      <p className="calendar-page__coverage" role="note">
        {year >= OFFICIAL_HOLIDAY_DATA_START_YEAR && year <= OFFICIAL_HOLIDAY_DATA_END_YEAR
          ? `法定节假日及调休数据覆盖 ${OFFICIAL_HOLIDAY_DATA_START_YEAR}-${OFFICIAL_HOLIDAY_DATA_END_YEAR} 年`
          : `${year} 年法定节假日及调休数据暂未收录`}
      </p>
      <MonthCalendar
        year={year}
        month={month}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />
    </main>
  );
}
