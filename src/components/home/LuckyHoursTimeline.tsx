import type { AlmanacHour } from '../../lib/almanac/types';

type LuckyHoursTimelineProps = {
  hours: AlmanacHour[];
};

function renderList(items: string[]): string {
  return items.length > 0 ? items.join('、') : '暂无';
}

export function LuckyHoursTimeline({ hours }: LuckyHoursTimelineProps) {
  return (
    <section className="lucky-hours-timeline" aria-label="时辰吉凶">
      <h2>时辰吉凶</h2>
      <ol
        aria-label="时辰吉凶列表"
        className="lucky-hours-timeline__list lucky-hours-timeline__list--stacked"
      >
        {hours.map((hour) => (
          <li key={hour.label} className="lucky-hours-timeline__item">
            <p className="lucky-hours-timeline__title">
              <strong>{hour.label}</strong>
              <span>{` ${hour.range}`}</span>
            </p>
            <p className="lucky-hours-timeline__meta">{`值神 ${hour.deity}`}</p>
            <p className="lucky-hours-timeline__meta">{`吉凶 ${hour.luck}`}</p>
            <p className="lucky-hours-timeline__meta">{`宜 ${renderList(hour.suitable)}`}</p>
            <p className="lucky-hours-timeline__meta">{`忌 ${renderList(hour.avoid)}`}</p>
            <p className="lucky-hours-timeline__meta">{`冲煞 ${hour.clash}`}</p>
            {hour.segments && hour.segments.length > 0 ? (
              <ul className="lucky-hours-timeline__segments">
                {hour.segments.map((segment) => (
                  <li key={segment.label} className="lucky-hours-timeline__segment">
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
    </section>
  );
}
