import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DateHeader } from './DateHeader';
import { DateProvider } from '../../state/date-context';

function renderWithDateHeader(initialSelectedDate: string) {
  render(
    <DateProvider initialSelectedDate={initialSelectedDate}>
      <DateHeader />
    </DateProvider>,
  );
}

test('moves to the previous day when the previous button is tapped', async () => {
  const user = userEvent.setup();
  renderWithDateHeader('2026-04-03');
  await user.click(screen.getByRole('button', { name: '上一天' }));
  expect(screen.getByText('2026-04-02')).toBeInTheDocument();
});

test('renders weekday and lunar summary for the selected date', () => {
  renderWithDateHeader('2026-04-03');

  expect(screen.getByRole('banner')).toHaveClass('date-header');
  expect(screen.getByText('2026-04-03').closest('.date-header__summary')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '上一天' }).closest('.date-header__actions')).toBe(
    screen.getByRole('button', { name: '下一天' }).closest('.date-header__actions'),
  );
  expect(screen.getByText('星期五')).toBeInTheDocument();
  expect(screen.getByText('农历二月十六')).toBeInTheDocument();
});

test('uses the route date immediately on detail routes instead of stale context date', () => {
  render(
    <MemoryRouter initialEntries={['/day/2026-04-12']}>
      <DateProvider initialSelectedDate="2026-04-01">
        <Routes>
          <Route path="/day/:date" element={<DateHeader />} />
        </Routes>
      </DateProvider>
    </MemoryRouter>,
  );

  expect(screen.getByText('2026-04-12')).toBeInTheDocument();
  expect(screen.queryByText('2026-04-01')).not.toBeInTheDocument();
  expect(screen.getByText('星期日')).toBeInTheDocument();
  expect(screen.getByText('农历二月廿五')).toBeInTheDocument();
});
