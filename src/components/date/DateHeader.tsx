import { Link, useInRouterContext, useLocation, useNavigate } from 'react-router-dom';
import { getDayDisplay } from '../../lib/almanac/day-display';
import { addDays, isValidIsoDate } from '../../lib/date/date';
import { useDateContext } from '../../state/date-context';

type DateHeaderViewProps = {
  displayDate: string;
  weekdayLabel: string;
  lunarLabel: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
  calendarEntry: JSX.Element;
};

function DateHeaderView({
  displayDate,
  weekdayLabel,
  lunarLabel,
  onPreviousDay,
  onNextDay,
  calendarEntry
}: DateHeaderViewProps) {
  return (
    <header className="date-header">
      <div className="date-header__summary">
        <p className="date-header__eyebrow">当前日期</p>
        <p className="date-header__date">{displayDate}</p>
        <p className="date-header__meta">{weekdayLabel}</p>
        <p className="date-header__meta">{lunarLabel}</p>
      </div>
      <div className="date-header__actions">
        <button
          className="date-header__nav-button"
          type="button"
          aria-label="上一天"
          onClick={onPreviousDay}
        >
          上一天
        </button>
        <button
          className="date-header__nav-button"
          type="button"
          aria-label="下一天"
          onClick={onNextDay}
        >
          下一天
        </button>
        <div className="date-header__entry">{calendarEntry}</div>
      </div>
    </header>
  );
}

function DateHeaderInRouter() {
  const { selectedDate, goToPreviousDay, goToNextDay } = useDateContext();
  const location = useLocation();
  const navigate = useNavigate();
  const detailRouteMatch = /^\/day\/(.+)$/.exec(location.pathname);
  const isCalendarRoute = location.pathname === '/calendar';
  const routeDateParam = detailRouteMatch?.[1] ?? null;
  const displayDate =
    routeDateParam && isValidIsoDate(routeDateParam) ? routeDateParam : selectedDate;
  const dayDisplay = getDayDisplay(displayDate);

  const handlePreviousDay = () => {
    if (detailRouteMatch) {
      navigate(`/day/${addDays(displayDate, -1)}`);
      return;
    }
    goToPreviousDay();
  };

  const handleNextDay = () => {
    if (detailRouteMatch) {
      navigate(`/day/${addDays(displayDate, 1)}`);
      return;
    }
    goToNextDay();
  };

  return (
    <DateHeaderView
      displayDate={dayDisplay.isoDate}
      weekdayLabel={dayDisplay.weekdayLabel}
      lunarLabel={dayDisplay.lunarLabel}
      onPreviousDay={handlePreviousDay}
      onNextDay={handleNextDay}
      calendarEntry={<Link to={isCalendarRoute ? '/' : '/calendar'}>{isCalendarRoute ? '返回首页' : '查看月历'}</Link>}
    />
  );
}

export function DateHeader() {
  const { selectedDate, goToPreviousDay, goToNextDay } = useDateContext();
  const isInRouterContext = useInRouterContext();

  if (isInRouterContext) {
    return <DateHeaderInRouter />;
  }

  const dayDisplay = getDayDisplay(selectedDate);

  return (
    <DateHeaderView
      displayDate={dayDisplay.isoDate}
      weekdayLabel={dayDisplay.weekdayLabel}
      lunarLabel={dayDisplay.lunarLabel}
      onPreviousDay={goToPreviousDay}
      onNextDay={goToNextDay}
      calendarEntry={<a href="/calendar">查看月历</a>}
    />
  );
}
