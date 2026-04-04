import { render, screen } from '@testing-library/react';
import { DateProvider } from '../state/date-context';
import { HomePage } from './HomePage';
import { getDayAlmanac } from '../lib/almanac/adapter';

vi.mock('../lib/almanac/adapter', () => ({
  getDayAlmanac: vi.fn()
}));

const mockedGetDayAlmanac = vi.mocked(getDayAlmanac);

const homePageFixture = {
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
    fortuneDirection: {
      label: '福神位',
      value: '东北',
      explanationKey: 'fortuneDirection' as const
    },
    fetusDeity: {
      label: '胎神',
      value: '房床碓外正东',
      explanationKey: 'fetusDeity' as const
    },
    mansion: { label: '星宿', value: '角宿（吉）', explanationKey: 'mansion' as const },
    nayin: { label: '纳音', value: '金箔金', explanationKey: 'nayin' as const }
  },
  additionalGroups: [
    {
      title: '干支与节令',
      fields: [
        { label: '年干支', value: '丙午', explanationKey: 'yearGanzhi' as const },
        { label: '月干支', value: '辛卯', explanationKey: 'monthGanzhi' as const },
        { label: '日干支', value: '己酉', explanationKey: 'dayGanzhi' as const },
        { label: '生肖', value: '年马 / 月龙 / 日鸡', explanationKey: 'zodiac' as const },
        { label: '节令', value: '清明', explanationKey: 'solarTerm' as const },
        { label: '物候', value: '清明 初候 · 桐始华', explanationKey: 'phenology' as const }
      ]
    },
    {
      title: '传统历注',
      fields: [
        { label: '六曜', value: '先胜', explanationKey: 'liuyao' as const },
        {
          label: '彭祖百忌',
          value: '己不破券二比并亡 / 酉不会客醉坐颠狂',
          explanationKey: 'pengZu' as const
        },
        { label: '日禄', value: '午命互禄 辛命进禄', explanationKey: 'dayLu' as const },
        {
          label: '贵神方位',
          value: '阳贵神 正北 / 阴贵神 西南',
          explanationKey: 'guiDirection' as const
        },
        {
          label: '太岁方位',
          value: '年 正南 / 月 西南 / 日 正南',
          explanationKey: 'taiSuiDirection' as const
        },
        {
          label: '九星',
          value: '年 一白水天枢 / 月 六白金开阳 / 日 七赤金摇光',
          explanationKey: 'nineStar' as const
        },
        { label: '宫兽', value: '东宫 青龙', explanationKey: 'gongShou' as const }
      ]
    }
  ],
  hours: [
    {
      label: '子时',
      range: '23:00-00:59',
      deity: '司命 / 青龙',
      luck: '黄道·吉',
      suitable: ['祭祀', '祈福'],
      avoid: ['上梁'],
      clash: '冲马煞南',
      segments: [
        {
          label: '早子',
          range: '00:00-00:59',
          deity: '司命',
          luck: '黄道·吉',
          suitable: ['祭祀'],
          avoid: ['上梁'],
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

function renderHomePage() {
  render(
    <DateProvider initialSelectedDate="2026-04-03">
      <HomePage />
    </DateProvider>,
  );
}

test('renders today summary with inline explanations and expanded homepage sections', () => {
  mockedGetDayAlmanac.mockReturnValue(homePageFixture);

  renderHomePage();

  expect(screen.getByRole('heading', { name: '今日黄历' })).toBeInTheDocument();
  expect(screen.getByText('今日宜')).toBeInTheDocument();
  expect(mockedGetDayAlmanac).toHaveBeenCalledWith('2026-04-03');
  expect(screen.getByText('黄历信息')).toBeInTheDocument();
  expect(screen.getByText('干支与节令')).toBeInTheDocument();
  expect(screen.getByText('传统历注')).toBeInTheDocument();
  expect(
    screen.getByText(
      '冲煞用于描述日支与生肖的相冲关系及不利方位，传统上通常用于参考当天相冲生肖和方位。通常把它当作民俗参考信息，而不是绝对禁忌。',
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      '节令信息用于帮助理解当天处于哪个节气阶段，以及它与季节变化、农时节奏和传统生活经验之间的关联。',
    ),
  ).toBeInTheDocument();
  expect(screen.queryByText('?')).not.toBeInTheDocument();
});

test('keeps the mobile-first content order with explicit styling hooks', () => {
  mockedGetDayAlmanac.mockReturnValue(homePageFixture);

  renderHomePage();

  const main = screen.getByRole('main');

  expect(main.firstElementChild).toHaveClass('today-summary-card');
  expect(main.children[1]).toHaveClass('lucky-hours-timeline');
  expect(main.children[2]).toHaveClass('almanac-info-grid');
  expect(main.children[3]).toHaveClass('almanac-info-grid');
  expect(main.children[4]).toHaveClass('almanac-info-grid');
  expect(screen.getByRole('list', { name: '时辰吉凶列表' })).toHaveClass(
    'lucky-hours-timeline__list',
    'lucky-hours-timeline__list--stacked',
  );
});

test('shows richer lucky-hour details on the homepage cards', () => {
  mockedGetDayAlmanac.mockReturnValue(homePageFixture);

  renderHomePage();

  expect(screen.getByText('值神 司命 / 青龙')).toBeInTheDocument();
  expect(screen.getByText('宜 祭祀、祈福')).toBeInTheDocument();
  expect(screen.getByText('忌 上梁')).toBeInTheDocument();
  expect(screen.getByText('冲煞 冲马煞南')).toBeInTheDocument();
  expect(screen.getByText('早子 00:00-00:59')).toBeInTheDocument();
  expect(screen.getByText('晚子 23:00-23:59')).toBeInTheDocument();
  expect(screen.getByText('年干支')).toBeInTheDocument();
  expect(screen.getByText('丙午')).toBeInTheDocument();
  expect(screen.getByText('彭祖百忌')).toBeInTheDocument();
  expect(screen.getByText('己不破券二比并亡 / 酉不会客醉坐颠狂')).toBeInTheDocument();
});
