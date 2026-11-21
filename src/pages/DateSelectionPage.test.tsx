import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DateProvider } from '../state/date-context';
import { DateSelectionPage } from './DateSelectionPage';

function renderDateSelectionPage() {
  render(
    <MemoryRouter>
      <DateProvider initialSelectedDate="2026-08-13">
        <DateSelectionPage />
      </DateProvider>
    </MemoryRouter>,
  );
}

test('shows offline date-selection controls and matching dates', () => {
  renderDateSelectionPage();

  expect(screen.getByRole('heading', { name: '择日查询' })).toBeInTheDocument();
  expect(screen.getByText('按黄历宜忌筛选日期，结果仅作传统民俗参考。')).toBeInTheDocument();
  expect(screen.getByLabelText('所办事项')).toHaveValue('wedding');
  expect(screen.getByLabelText('起始日期')).toHaveValue('2026-08-13');
  expect(screen.getByRole('radio', { name: '未来 30 天' })).toBeChecked();
  expect(screen.getByText('结婚嫁娶 · 共 13 天')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '查看 2026-08-18 当日黄历' })).toHaveAttribute(
    'href',
    '/day/2026-08-18',
  );
});

test('updates results when activity, range, and availability filters change', async () => {
  const user = userEvent.setup();
  renderDateSelectionPage();

  await user.selectOptions(screen.getByLabelText('所办事项'), 'travel');
  expect(screen.getByText(/出行 · 共 \d+ 天/)).toBeInTheDocument();

  await user.click(screen.getByRole('checkbox', { name: '仅看周末或法定休假' }));
  expect(screen.getByText('出行 · 共 4 天')).toBeInTheDocument();
  expect(screen.getAllByText('周末')).toHaveLength(4);

  await user.click(screen.getByRole('radio', { name: '未来 90 天' }));
  expect(screen.getByRole('radio', { name: '未来 90 天' })).toBeChecked();
  expect(screen.getByText(/出行 · 共 \d+ 天/)).toBeInTheDocument();
});

test('warns when the query range exceeds official holiday data coverage', async () => {
  const user = userEvent.setup();
  renderDateSelectionPage();

  await user.clear(screen.getByLabelText('起始日期'));
  await user.type(screen.getByLabelText('起始日期'), '2027-01-01');

  expect(screen.getByRole('note')).toHaveTextContent(
    '法定休班筛选仅覆盖 2002-2026 年，其他年份只能识别自然周末。',
  );
});
