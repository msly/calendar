import { getDayDisplay } from '../../lib/almanac/day-display';

type MonthCalendarProps = {
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (isoDate: string) => void;
};

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function MonthCalendar({ year, month, selectedDate, onSelectDate }: MonthCalendarProps) {
  const monthPrefix = `${year}-${pad2(month)}`;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstDayWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    return `${monthPrefix}-${pad2(day)}`;
  });
  const daySlots: Array<string | null> = [
    ...Array.from({ length: firstDayWeekday }, () => null),
    ...days
  ];
  const trailingEmptySlots = (7 - (daySlots.length % 7)) % 7;

  daySlots.push(...Array.from({ length: trailingEmptySlots }, () => null));

  const weekRows = Array.from({ length: daySlots.length / 7 }, (_, weekIndex) =>
    daySlots.slice(weekIndex * 7, weekIndex * 7 + 7),
  );

  return (
    <section className="month-calendar" aria-label={`${monthPrefix} 月历`}>
      <div className="month-calendar__scroller">
        <table className="month-calendar__table" role="grid" aria-label={`${monthPrefix} 月历`}>
          <thead>
            <tr>
              {WEEKDAY_LABELS.map((label) => (
                <th key={label} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekRows.map((week, weekIndex) => (
              <tr key={`${monthPrefix}-week-${weekIndex + 1}`}>
                {week.map((isoDate, dayIndex) => (
                  <td key={isoDate ?? `${monthPrefix}-empty-${weekIndex}-${dayIndex}`}>
                    {isoDate ? (
                      (() => {
                        const dayDisplay = getDayDisplay(isoDate);

                        return (
                          <button
                            className="month-calendar__day month-calendar__day--rect"
                            type="button"
                            aria-label={isoDate}
                            aria-pressed={isoDate === selectedDate}
                            onClick={() => onSelectDate(isoDate)}
                          >
                            <span className="month-calendar__day-number">
                              {Number(isoDate.slice(-2))}
                            </span>
                            <span className="month-calendar__day-note">{dayDisplay.calendarNote}</span>
                          </button>
                        );
                      })()
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
