import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DateProvider } from '../state/date-context';
import { getDayAlmanac } from '../lib/almanac/adapter';
import { DayDetailPage } from './DayDetailPage';

vi.mock('../lib/almanac/adapter', () => ({
  getDayAlmanac: vi.fn()
}));

const mockedGetDayAlmanac = vi.mocked(getDayAlmanac);

const dayAlmanacFixture = {
  isoDate: '2026-04-03',
  summary: {
    suitable: ['祭祀', '祈福'],
    avoid: ['动土'],
    plainSummary: '宜祭祀、祈福；忌动土'
  },
  core: {
    clash: { label: '冲煞', value: '冲鼠煞北', explanationKey: 'clash' as const },
    dutyDeity: { label: '值神', value: '司命（黄道）', explanationKey: 'dutyDeity' as const },
    dayOfficer: { label: '十二值日', value: '定', explanationKey: 'dayOfficer' as const },
    wealthDirection: { label: '财神位', value: '正南', explanationKey: 'wealthDirection' as const },
    joyDirection: { label: '喜神位', value: '东南', explanationKey: 'joyDirection' as const },
    fortuneDirection: { label: '福神位', value: '东北', explanationKey: 'fortuneDirection' as const },
    fetusDeity: { label: '胎神', value: '房床碓外正东', explanationKey: 'fetusDeity' as const },
    mansion: { label: '星宿', value: '角宿（吉）', explanationKey: 'mansion' as const },
    nayin: { label: '纳音', value: '金箔金', explanationKey: 'nayin' as const }
  },
  additionalGroups: [],
  hours: [
    {
      label: '子时',
      range: '23:00-00:59',
      deity: '司命 / 青龙',
      luck: '吉',
      suitable: ['祭祀'],
      avoid: ['动土'],
      clash: '冲马煞南',
      segments: [
        {
          label: '早子',
          range: '00:00-00:59',
          deity: '司命',
          luck: '黄道·吉',
          suitable: ['祭祀'],
          avoid: ['动土'],
          clash: '冲马煞南'
        },
        {
          label: '晚子',
          range: '23:00-23:59',
          deity: '青龙',
          luck: '黄道·吉',
          suitable: ['祈福'],
          avoid: [],
          clash: '冲马煞南'
        }
      ]
    }
  ]
};

function renderDayDetailPage(initialRoute = '/day/2026-04-03') {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <DateProvider initialSelectedDate="2026-04-01">
        <Routes>
          <Route path="/day/:date" element={<DayDetailPage />} />
        </Routes>
      </DateProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockedGetDayAlmanac.mockReset();
});

test('shows grouped almanac sections and allows expanding low-priority fields', async () => {
  const user = userEvent.setup();
  mockedGetDayAlmanac.mockReturnValue(dayAlmanacFixture);

  renderDayDetailPage('/day/2026-04-03');

  expect(screen.getByText('今日概览')).toBeInTheDocument();
  expect(screen.getByText('时辰吉凶')).toBeInTheDocument();
  expect(screen.getByText('神煞与值神')).toBeInTheDocument();
  expect(screen.getByText('方位与五行')).toBeInTheDocument();
  expect(screen.getByText('传统历法信息')).toBeInTheDocument();
  expect(screen.getByText('2026-04-03')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '收起今日概览' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '收起时辰吉凶' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '展开神煞与值神' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '展开方位与五行' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '展开传统历法信息' })).toBeInTheDocument();
  expect(screen.getByText('今日宜')).toBeInTheDocument();
  expect(screen.getByText('子时')).toBeInTheDocument();
  expect(screen.queryByText('冲煞')).not.toBeInTheDocument();
  expect(screen.queryByText('财神位')).not.toBeInTheDocument();
  expect(screen.queryByText('更多传统历法字段将在后续任务补充')).not.toBeInTheDocument();

  const main = screen.getByRole('main');
  expect(main).toHaveClass('app-shell', 'day-detail-page');
  expect(main.firstElementChild).toHaveClass('detail-section', 'detail-section--hero');

  await user.click(screen.getByRole('button', { name: '展开方位与五行' }));

  expect(screen.getByText('财神位')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '收起方位与五行' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '收起方位与五行' }));
  expect(screen.getByRole('button', { name: '展开方位与五行' })).toBeInTheDocument();
  expect(screen.queryByText('财神位')).not.toBeInTheDocument();
  expect(mockedGetDayAlmanac).toHaveBeenCalledWith('2026-04-03');
});

test('renders invalid-date state and skips almanac lookup for invalid route params', () => {
  renderDayDetailPage('/day/not-a-date');

  expect(screen.getByText('日期参数无效')).toBeInTheDocument();
  expect(screen.getByText('not-a-date')).toBeInTheDocument();
  expect(mockedGetDayAlmanac).not.toHaveBeenCalled();
});
