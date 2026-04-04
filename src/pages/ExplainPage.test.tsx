import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ExplainPage } from './ExplainPage';

function renderExplainPage(initialRoute = '/explain/clash') {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/explain/:key" element={<ExplainPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

test('renders long-form explanation content for a selected term', () => {
  renderExplainPage('/explain/clash');

  expect(screen.getByRole('heading', { name: '冲煞' })).toBeInTheDocument();
  expect(screen.getByText(/传统上通常用于参考当天相冲生肖和方位/)).toBeInTheDocument();
});

test('renders an explicit not-found state for unknown explanation keys', () => {
  renderExplainPage('/explain/not-exists');

  expect(screen.getByRole('heading', { name: '未找到说明内容' })).toBeInTheDocument();
  expect(screen.getByText('not-exists')).toBeInTheDocument();
});

test('renders the seasonal solar-term explanation record', () => {
  renderExplainPage('/explain/solarTerm');

  expect(screen.getByRole('heading', { name: '节令' })).toBeInTheDocument();
  expect(screen.getByText(/节气阶段/)).toBeInTheDocument();
});
