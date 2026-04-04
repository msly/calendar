import type { AlmanacDay } from '../../lib/almanac/types';

type TodaySummaryCardProps = {
  summary: AlmanacDay['summary'];
};

function formatItems(items: string[]): string {
  return items.length > 0 ? items.join('、') : '暂无';
}

export function TodaySummaryCard({ summary }: TodaySummaryCardProps) {
  return (
    <section className="today-summary-card">
      <div className="today-summary-card__hero">
        <p className="today-summary-card__eyebrow">今日重点</p>
        <h1>今日黄历</h1>
        <p className="today-summary-card__plain">{summary.plainSummary}</p>
      </div>
      <div className="today-summary-card__columns">
        <div className="today-summary-card__column">
          <p className="today-summary-card__label">今日宜</p>
          <p className="today-summary-card__value">{formatItems(summary.suitable)}</p>
        </div>
        <div className="today-summary-card__column">
          <p className="today-summary-card__label">今日忌</p>
          <p className="today-summary-card__value">{formatItems(summary.avoid)}</p>
        </div>
      </div>
    </section>
  );
}
