import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlmanacInfoGrid } from '../components/home/AlmanacInfoGrid';
import { LuckyHoursTimeline } from '../components/home/LuckyHoursTimeline';
import { TodaySummaryCard } from '../components/home/TodaySummaryCard';
import { getDayAlmanac } from '../lib/almanac/adapter';
import { isValidIsoDate } from '../lib/date/date';
import { useDateContext } from '../state/date-context';

type HomePageProps = {
  displayDateOverride?: string;
};

export function HomePage({ displayDateOverride }: HomePageProps) {
  const { selectedDate } = useDateContext();
  const displayDate = displayDateOverride ?? selectedDate;

  const dayAlmanac = getDayAlmanac(displayDate);

  return (
    <main className="app-shell home-page">
      <TodaySummaryCard summary={dayAlmanac.summary} />
      <LuckyHoursTimeline hours={dayAlmanac.hours} />
      <AlmanacInfoGrid title="黄历信息" fields={Object.values(dayAlmanac.core)} />
      {dayAlmanac.additionalGroups.map((group) => (
        <AlmanacInfoGrid key={group.title} title={group.title} fields={group.fields} />
      ))}
    </main>
  );
}

export function DayHomePage() {
  const { date } = useParams();
  const { selectedDate, setSelectedDate } = useDateContext();
  const routeDate = date ?? '';
  const isRouteDateValid = isValidIsoDate(routeDate);

  useEffect(() => {
    if (isRouteDateValid && routeDate !== selectedDate) {
      setSelectedDate(routeDate);
    }
  }, [isRouteDateValid, routeDate, selectedDate, setSelectedDate]);

  if (!isRouteDateValid) {
    return (
      <main className="app-shell">
        <h2>日期参数无效</h2>
        <p>{routeDate}</p>
      </main>
    );
  }

  return <HomePage displayDateOverride={routeDate} />;
}
