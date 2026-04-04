import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DetailSection } from '../components/detail/DetailSection';
import { getDayAlmanac } from '../lib/almanac/adapter';
import { isValidIsoDate } from '../lib/date/date';
import type { AlmanacField, AlmanacHour } from '../lib/almanac/types';
import { useDateContext } from '../state/date-context';

function renderCommaList(items: string[]): string {
  return items.length > 0 ? items.join('、') : '暂无';
}

function FieldList({ fields }: { fields: AlmanacField[] }) {
  return (
    <dl>
      {fields.map((field) => (
        <div key={field.label}>
          <dt>{field.label}</dt>
          <dd>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function HourList({ hours }: { hours: AlmanacHour[] }) {
  return (
    <ol>
      {hours.map((hour) => (
        <li key={hour.label}>
          <p>
            <strong>{hour.label}</strong>
            <span>{` ${hour.range}`}</span>
          </p>
          <p>{`值神 ${hour.deity}`}</p>
          <p>{`吉凶 ${hour.luck}`}</p>
          <p>{`宜 ${renderCommaList(hour.suitable)}`}</p>
          <p>{`忌 ${renderCommaList(hour.avoid)}`}</p>
          <p>{`冲煞 ${hour.clash}`}</p>
          {hour.segments && hour.segments.length > 0 ? (
            <ul>
              {hour.segments.map((segment) => (
                <li key={segment.label}>
                  <p>{`${segment.label} ${segment.range}`}</p>
                  <p>{`值神 ${segment.deity}`}</p>
                  <p>{`吉凶 ${segment.luck}`}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function DayDetailPage() {
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

  const dayAlmanac = getDayAlmanac(routeDate);

  return (
    <main className="app-shell day-detail-page">
      <DetailSection title="今日概览" defaultOpen variant="hero">
        <p>{dayAlmanac.isoDate}</p>
        <p>今日宜</p>
        <p>{renderCommaList(dayAlmanac.summary.suitable)}</p>
        <p>今日忌</p>
        <p>{renderCommaList(dayAlmanac.summary.avoid)}</p>
        <p>{dayAlmanac.summary.plainSummary}</p>
      </DetailSection>

      <DetailSection title="时辰吉凶" defaultOpen>
        <HourList hours={dayAlmanac.hours} />
      </DetailSection>

      <DetailSection title="神煞与值神">
        <FieldList
          fields={[
            dayAlmanac.core.clash,
            dayAlmanac.core.dutyDeity,
            dayAlmanac.core.dayOfficer,
            dayAlmanac.core.mansion
          ]}
        />
      </DetailSection>

      <DetailSection title="方位与五行">
        <FieldList
          fields={[
            dayAlmanac.core.wealthDirection,
            dayAlmanac.core.joyDirection,
            dayAlmanac.core.fortuneDirection,
            dayAlmanac.core.nayin,
            dayAlmanac.core.fetusDeity
          ]}
        />
      </DetailSection>

      <DetailSection title="传统历法信息">
        <p>更多传统历法字段将在后续任务补充</p>
      </DetailSection>
    </main>
  );
}
