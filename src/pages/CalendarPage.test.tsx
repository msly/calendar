import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DateProvider, useDateContext } from '../state/date-context';
import { CalendarPage } from './CalendarPage';

function DayRouteProbe() {
  const location = useLocation();
  const { selectedDate } = useDateContext();

  return (
    <>
      <p>{location.pathname}</p>
      <p>{selectedDate}</p>
    </>
  );
}

function renderCalendarPage(initialSelectedDate = '2026-04-03') {
  return render(
    <MemoryRouter initialEntries={['/calendar']}>
      <DateProvider initialSelectedDate={initialSelectedDate}>
        <Routes>
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/day/:date" element={<DayRouteProbe />} />
        </Routes>
      </DateProvider>
    </MemoryRouter>,
  );
}

test('selects a day from the month view and navigates to day detail', async () => {
  const user = userEvent.setup();
  renderCalendarPage();

  await user.click(screen.getByRole('button', { name: '2026-04-12' }));

  expect(screen.getByText('/day/2026-04-12')).toBeInTheDocument();
  expect(screen.getByText('2026-04-12')).toBeInTheDocument();
});

test('renders a month grid with weekday headers and leading empty slots', () => {
  renderCalendarPage();

  expect(screen.getByRole('grid', { name: '2026-04 月历' })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: '日' })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: '六' })).toBeInTheDocument();

  const firstDayCell = screen.getByRole('button', { name: '2026-04-01' }).closest('td');
  const rowCells = Array.from(firstDayCell?.parentElement?.children ?? []);
  const leadingCells = rowCells.slice(0, 3);

  expect(leadingCells).toHaveLength(3);
  expect(leadingCells.every((cell) => cell.textContent === '')).toBe(true);
});

test('shows lunar labels for normal days and solar terms for seasonal nodes', () => {
  renderCalendarPage();

  const normalDayButton = screen.getByRole('button', { name: '2026-04-02' });
  const solarTermButton = screen.getByRole('button', { name: '2026-04-05' });

  expect(normalDayButton).toHaveClass('month-calendar__day', 'month-calendar__day--rect');
  expect(normalDayButton).toHaveTextContent('2');
  expect(normalDayButton).toHaveTextContent('十五');
  expect(solarTermButton).toHaveTextContent('5');
  expect(solarTermButton).toHaveTextContent('清明');
});

test('shows public festivals and official rest-day badges', () => {
  renderCalendarPage('2026-05-01');

  const laborDayButton = screen.getByRole('button', { name: '2026-05-01' });

  expect(laborDayButton).toHaveTextContent('劳动节');
  expect(
    laborDayButton.querySelector('.month-calendar__holiday-badge'),
  ).toHaveTextContent('休');
  expect(screen.getByRole('note')).toHaveTextContent('覆盖 2002-2026 年');
});

test('shows make-up workdays and an explicit message for uncovered years', () => {
  const { unmount } = renderCalendarPage('2026-02-28');
  const makeUpWorkdayButton = screen.getByRole('button', { name: '2026-02-28' });

  expect(
    makeUpWorkdayButton.querySelector('.month-calendar__holiday-badge'),
  ).toHaveTextContent('班');

  unmount();
  renderCalendarPage('2027-01-01');

  expect(screen.getByRole('button', { name: '2027-01-01' })).toHaveTextContent('元旦节');
  expect(screen.getByRole('note')).toHaveTextContent('2027 年法定节假日及调休数据暂未收录');
});
