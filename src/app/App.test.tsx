import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppRouter } from './router';

test('renders the almanac app shell through the runtime router layout', () => {
  window.history.pushState({}, '', '/');
  render(<AppRouter />);
  expect(screen.getByRole('heading', { name: '今日黄历' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '上一天' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '下一天' })).toBeInTheDocument();
});

test('navigates to calendar page from the header entry', async () => {
  const user = userEvent.setup();
  window.history.pushState({}, '', '/');
  render(<AppRouter />);

  await user.click(screen.getByRole('link', { name: '查看月历' }));

  expect(screen.getByRole('heading', { name: '月历查日' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '返回首页' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '查看月历' })).not.toBeInTheDocument();
});

test('returns to homepage from the calendar header entry', async () => {
  const user = userEvent.setup();
  window.history.pushState({}, '', '/calendar');
  render(<AppRouter />);

  await user.click(screen.getByRole('link', { name: '返回首页' }));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/');
  });

  expect(screen.getByRole('heading', { name: '今日黄历' })).toBeInTheDocument();
});

test('syncs selected date from route param when visiting day route directly', async () => {
  window.history.pushState({}, '', '/day/2026-04-12');
  render(<AppRouter />);

  expect(screen.getByRole('heading', { name: '今日黄历' })).toBeInTheDocument();
  expect(screen.getByText('今日宜')).toBeInTheDocument();
  expect(screen.getByText('时辰吉凶')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('2026-04-12')).toBeInTheDocument();
  });
});

test('uses day-route navigation for header previous and next buttons on day routes', async () => {
  const user = userEvent.setup();
  window.history.pushState({}, '', '/day/2026-04-12');
  render(<AppRouter />);

  await waitFor(() => {
    expect(screen.getByText('2026-04-12')).toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: '下一天' }));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/day/2026-04-13');
    expect(screen.getByText('2026-04-13')).toBeInTheDocument();
  });
});

test('opens the same day-view shell after selecting a date from the calendar page', async () => {
  const user = userEvent.setup();
  window.history.pushState({}, '', '/calendar');
  render(<AppRouter />);

  await user.click(screen.getByRole('button', { name: '2026-04-12' }));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/day/2026-04-12');
  });

  expect(screen.getByRole('heading', { name: '今日黄历' })).toBeInTheDocument();
  expect(screen.getByText('今日宜')).toBeInTheDocument();
});

test('renders inline explanations on the homepage without drawer interactions', async () => {
  window.history.pushState({}, '', '/');
  render(<AppRouter />);

  await waitFor(() => {
    expect(screen.getByText('黄历信息')).toBeInTheDocument();
  });

  expect(
    screen.getByText(
      '冲煞用于描述日支与生肖的相冲关系及不利方位，传统上通常用于参考当天相冲生肖和方位。通常把它当作民俗参考信息，而不是绝对禁忌。',
    ),
  ).toBeInTheDocument();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.queryByText('?')).not.toBeInTheDocument();
});
