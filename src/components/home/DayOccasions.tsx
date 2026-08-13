import type { DayDisplay } from '../../lib/almanac/day-display';

type DayOccasionsProps = {
  dayDisplay: DayDisplay;
};

function FestivalGroup({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="day-occasions__item">
      <dt>{label}</dt>
      <dd>{values.join('、')}</dd>
    </div>
  );
}

export function DayOccasions({ dayDisplay }: DayOccasionsProps) {
  const { officialHoliday } = dayDisplay;
  const hasFestival =
    Boolean(dayDisplay.solarTerm) ||
    dayDisplay.solarFestivals.length > 0 ||
    dayDisplay.lunarFestivals.length > 0;

  if (!hasFestival && !officialHoliday && dayDisplay.hasOfficialHolidayData) {
    return null;
  }

  return (
    <section className="day-occasions" aria-label="节日与假期">
      <h2>节日与假期</h2>
      <dl className="day-occasions__list">
        {dayDisplay.solarTerm ? (
          <div className="day-occasions__item">
            <dt>节气</dt>
            <dd>{dayDisplay.solarTerm}</dd>
          </div>
        ) : null}
        <FestivalGroup label="公历节日" values={dayDisplay.solarFestivals} />
        <FestivalGroup label="农历节日" values={dayDisplay.lunarFestivals} />
        {officialHoliday ? (
          <div className="day-occasions__item day-occasions__item--official">
            <dt>{officialHoliday.status === 'work' ? '调休上班' : '法定休假'}</dt>
            <dd>
              {officialHoliday.name}
              {officialHoliday.targetDate !== dayDisplay.isoDate
                ? `（关联 ${officialHoliday.targetDate}）`
                : ''}
            </dd>
          </div>
        ) : null}
      </dl>
      {!dayDisplay.hasOfficialHolidayData ? (
        <p className="day-occasions__coverage" role="note">
          {`${dayDisplay.isoDate.slice(0, 4)} 年法定节假日及调休数据暂未收录`}
        </p>
      ) : null}
    </section>
  );
}
