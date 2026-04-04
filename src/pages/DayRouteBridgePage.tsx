import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDateContext } from '../state/date-context';

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function isValidIsoDate(isoDate: string): boolean {
  const match = ISO_DATE_PATTERN.exec(isoDate);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const maxDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return month >= 1 && month <= 12 && day >= 1 && day <= maxDay;
}

export function DayRouteBridgePage() {
  const { date } = useParams();
  const { setSelectedDate } = useDateContext();

  useEffect(() => {
    if (date && isValidIsoDate(date)) {
      setSelectedDate(date);
    }
  }, [date, setSelectedDate]);

  return (
    <main className="app-shell">
      <p>日期详情页开发中</p>
    </main>
  );
}
