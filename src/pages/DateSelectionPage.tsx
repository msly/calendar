import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DATE_SELECTION_ACTIVITIES,
  findSuitableDates,
  type DateSelectionActivity,
  type DateSelectionRange
} from '../lib/almanac/date-selection';
import {
  OFFICIAL_HOLIDAY_DATA_END_YEAR,
  OFFICIAL_HOLIDAY_DATA_START_YEAR
} from '../lib/almanac/day-display';
import { addDays, isValidIsoDate } from '../lib/date/date';
import { useDateContext } from '../state/date-context';

export function DateSelectionPage() {
  const { selectedDate } = useDateContext();
  const [startDate, setStartDate] = useState(selectedDate);
  const [activity, setActivity] = useState<DateSelectionActivity>('wedding');
  const [range, setRange] = useState<DateSelectionRange>(30);
  const [excludeMakeUpWorkdays, setExcludeMakeUpWorkdays] = useState(true);
  const [weekendsOrRestDaysOnly, setWeekendsOrRestDaysOnly] = useState(false);
  const validStartDate = isValidIsoDate(startDate);

  useEffect(() => {
    setStartDate(selectedDate);
  }, [selectedDate]);

  const matches = useMemo(
    () =>
      validStartDate
        ? findSuitableDates(startDate, range, activity, {
            excludeMakeUpWorkdays,
            weekendsOrRestDaysOnly
          })
        : [],
    [activity, excludeMakeUpWorkdays, range, startDate, validStartDate, weekendsOrRestDaysOnly],
  );

  const activityLabel =
    DATE_SELECTION_ACTIVITIES.find((item) => item.value === activity)?.label ?? '';
  const endDate = validStartDate ? addDays(startDate, range - 1) : '';
  const startYear = Number(startDate.slice(0, 4));
  const endYear = Number(endDate.slice(0, 4));
  const hasCompleteOfficialHolidayData =
    validStartDate &&
    startYear >= OFFICIAL_HOLIDAY_DATA_START_YEAR &&
    endYear <= OFFICIAL_HOLIDAY_DATA_END_YEAR;

  return (
    <main className="app-shell date-selection-page">
      <section className="date-selection-page__controls" aria-labelledby="date-selection-title">
        <div className="date-selection-page__heading">
          <h1 id="date-selection-title">择日查询</h1>
          <p>按黄历宜忌筛选日期，结果仅作传统民俗参考。</p>
        </div>

        <div className="date-selection-page__field">
          <label htmlFor="date-selection-activity">所办事项</label>
          <select
            id="date-selection-activity"
            value={activity}
            onChange={(event) => setActivity(event.target.value as DateSelectionActivity)}
          >
            {DATE_SELECTION_ACTIVITIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="date-selection-page__field">
          <label htmlFor="date-selection-start">起始日期</label>
          <input
            id="date-selection-start"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>

        <fieldset className="date-selection-page__range">
          <legend>查询范围</legend>
          <div className="date-selection-page__segments">
            {[30, 90].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="date-selection-range"
                  value={value}
                  checked={range === value}
                  onChange={() => setRange(value as DateSelectionRange)}
                />
                <span>{`未来 ${value} 天`}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="date-selection-page__filters">
          <label>
            <input
              type="checkbox"
              checked={excludeMakeUpWorkdays}
              onChange={(event) => setExcludeMakeUpWorkdays(event.target.checked)}
            />
            <span>排除法定调休上班日</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={weekendsOrRestDaysOnly}
              onChange={(event) => setWeekendsOrRestDaysOnly(event.target.checked)}
            />
            <span>仅看周末或法定休假</span>
          </label>
        </div>
        {validStartDate && !hasCompleteOfficialHolidayData ? (
          <p className="date-selection-page__coverage" role="note">
            {`法定休班筛选仅覆盖 ${OFFICIAL_HOLIDAY_DATA_START_YEAR}-${OFFICIAL_HOLIDAY_DATA_END_YEAR} 年，其他年份只能识别自然周末。`}
          </p>
        ) : null}
      </section>

      <section className="date-selection-results" aria-live="polite" aria-labelledby="date-selection-results-title">
        <div className="date-selection-results__heading">
          <h2 id="date-selection-results-title">匹配日期</h2>
          <p>{validStartDate ? `${activityLabel} · 共 ${matches.length} 天` : '请选择有效的起始日期'}</p>
        </div>

        {validStartDate && matches.length === 0 ? (
          <p className="date-selection-results__empty">当前条件下没有匹配日期，可扩大范围或调整休假筛选。</p>
        ) : null}

        {matches.length > 0 ? (
          <ol className="date-selection-results__list">
            {matches.map((match) => (
              <li key={match.isoDate} className="date-selection-result">
                <div className="date-selection-result__date">
                  <strong>{match.isoDate}</strong>
                  <span>{`${match.weekdayLabel} · ${match.lunarLabel}`}</span>
                </div>
                <div className="date-selection-result__badges">
                  {match.officialHoliday ? (
                    <span className={`date-selection-result__badge date-selection-result__badge--${match.officialHoliday.status}`}>
                      {match.officialHoliday.status === 'work' ? '班' : '休'}
                    </span>
                  ) : match.isWeekend ? (
                    <span className="date-selection-result__badge date-selection-result__badge--weekend">周末</span>
                  ) : null}
                  {match.calendarNote ? <span>{match.calendarNote}</span> : null}
                </div>
                <dl className="date-selection-result__summary">
                  <div>
                    <dt>宜</dt>
                    <dd>{match.suitable.join('、')}</dd>
                  </div>
                  <div>
                    <dt>冲煞</dt>
                    <dd>{match.clash}</dd>
                  </div>
                </dl>
                <Link
                  to={`/day/${match.isoDate}`}
                  aria-label={`查看 ${match.isoDate} 当日黄历`}
                >
                  查看当日黄历
                </Link>
              </li>
            ))}
          </ol>
        ) : null}
      </section>
    </main>
  );
}
