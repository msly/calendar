import { Solar, type Lunar, type LunarTime } from 'lunar-javascript';

import type { AlmanacDay, AlmanacField, AlmanacFieldGroup, AlmanacHour, AlmanacHourSegment } from './types';

type Zhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

const ZHI_ORDER: Zhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const ZHI_RANGES: Record<Zhi, string> = {
  子: '23:00-00:59',
  丑: '01:00-02:59',
  寅: '03:00-04:59',
  卯: '05:00-06:59',
  辰: '07:00-08:59',
  巳: '09:00-10:59',
  午: '11:00-12:59',
  未: '13:00-14:59',
  申: '15:00-16:59',
  酉: '17:00-18:59',
  戌: '19:00-20:59',
  亥: '21:00-22:59'
};

function normalizeList(value: string[]): string[] {
  return value.map((item) => item.trim()).filter(Boolean);
}

function uniqueItems(items: string[]): string[] {
  return Array.from(new Set(items));
}

function joinValues(items: string[], separator = ' / '): string {
  return uniqueItems(items.map((item) => item.trim()).filter(Boolean)).join(separator);
}

function toPlainSummary(suitable: string[], avoid: string[]): string {
  const suitableText = suitable.slice(0, 3).join('、') || '暂无';
  const avoidText = avoid.slice(0, 3).join('、') || '暂无';
  return `宜${suitableText}；忌${avoidText}`;
}

function formatLuck(time: LunarTime): string {
  const luckType = time.getTianShenType();
  const luck = time.getTianShenLuck();
  return luck ? `${luckType}·${luck}` : luckType;
}

function formatClash(time: LunarTime): string {
  return `${time.getChongDesc()} 煞${time.getSha()}`;
}

function mergeValues(values: string[]): string {
  return uniqueItems(values).join(' / ');
}

function filterSentinelValues(values: string[]): string[] {
  return values.filter((value) => value !== '无');
}

function createField(
  label: string,
  value: string,
  explanationKey: AlmanacField['explanationKey'],
): AlmanacField {
  return { label, value, explanationKey };
}

function createOptionalField(
  label: string,
  value: string,
  explanationKey: AlmanacField['explanationKey'],
): AlmanacField | null {
  if (!value.trim()) {
    return null;
  }

  return createField(label, value, explanationKey);
}

function normalizeZiSegment(label: '早子' | '晚子', range: string, time: LunarTime): AlmanacHourSegment {
  return {
    label,
    range,
    deity: time.getTianShen(),
    luck: formatLuck(time),
    suitable: normalizeList(time.getYi()),
    avoid: normalizeList(time.getJi()),
    clash: formatClash(time)
  };
}

function normalizeSingleHour(zhi: Zhi, time: LunarTime): AlmanacHour {
  return {
    label: `${zhi}时`,
    range: ZHI_RANGES[zhi],
    deity: time.getTianShen(),
    luck: formatLuck(time),
    suitable: normalizeList(time.getYi()),
    avoid: normalizeList(time.getJi()),
    clash: formatClash(time)
  };
}

function normalizeMergedZiHour(earlyZi: LunarTime, lateZi: LunarTime): AlmanacHour {
  const segments: AlmanacHourSegment[] = [
    normalizeZiSegment('早子', '00:00-00:59', earlyZi),
    normalizeZiSegment('晚子', '23:00-23:59', lateZi)
  ];

  return {
    label: '子时',
    range: ZHI_RANGES.子,
    deity: mergeValues(segments.map((segment) => segment.deity)),
    luck: mergeValues(segments.map((segment) => segment.luck)),
    suitable: uniqueItems(filterSentinelValues(segments.flatMap((segment) => segment.suitable))),
    avoid: uniqueItems(filterSentinelValues(segments.flatMap((segment) => segment.avoid))),
    clash: mergeValues(segments.map((segment) => segment.clash)),
    segments
  };
}

function normalizeHours(lunar: Lunar): AlmanacHour[] {
  const timesByZhi = new Map<string, LunarTime[]>();
  for (const time of lunar.getTimes()) {
    const zhi = time.getZhi();
    const existing = timesByZhi.get(zhi);
    if (existing) {
      existing.push(time);
    } else {
      timesByZhi.set(zhi, [time]);
    }
  }

  const hours: AlmanacHour[] = [];
  for (const zhi of ZHI_ORDER) {
    const entries = timesByZhi.get(zhi);
    if (!entries || entries.length === 0) {
      throw new Error(`Missing ${zhi} hour data`);
    }

    if (zhi === '子') {
      if (entries.length === 2) {
        hours.push(normalizeMergedZiHour(entries[0], entries[1]));
      } else {
        hours.push(normalizeSingleHour(zhi, entries[0]));
      }
      continue;
    }

    hours.push(normalizeSingleHour(zhi, entries[0]));
  }

  return hours;
}

function normalizeLunarData(isoDate: string, lunar: Lunar): AlmanacDay {
  const suitable = normalizeList(lunar.getDayYi());
  const avoid = normalizeList(lunar.getDayJi());
  const solarTermValue = lunar.getJieQi() || joinValues([lunar.getJie(), lunar.getQi()]);
  const phenologyValue = [lunar.getHou(), lunar.getWuHou()].filter(Boolean).join(' · ');
  const festivalValue = joinValues([...lunar.getFestivals(), ...lunar.getOtherFestivals()], '、');
  const additionalGroups: AlmanacFieldGroup[] = [
    {
      title: '干支与节令',
      fields: [
        createField('年干支', lunar.getYearInGanZhiExact(), 'yearGanzhi'),
        createField('月干支', lunar.getMonthInGanZhiExact(), 'monthGanzhi'),
        createField('日干支', lunar.getDayInGanZhiExact(), 'dayGanzhi'),
        createField(
          '生肖',
          joinValues(
            [
              `年${lunar.getYearShengXiao()}`,
              `月${lunar.getMonthShengXiao()}`,
              `日${lunar.getDayShengXiao()}`
            ],
            ' / ',
          ),
          'zodiac',
        ),
        createField('节令', solarTermValue || '暂无', 'solarTerm'),
        createField('物候', phenologyValue || '暂无', 'phenology')
      ]
    },
    {
      title: '传统历注',
      fields: [
        createField('六曜', lunar.getLiuYao(), 'liuyao'),
        createField(
          '彭祖百忌',
          joinValues([lunar.getPengZuGan(), lunar.getPengZuZhi()], ' / '),
          'pengZu',
        ),
        createField('日禄', lunar.getDayLu(), 'dayLu'),
        createField(
          '贵神方位',
          joinValues(
            [
              `阳贵神 ${lunar.getDayPositionYangGuiDesc()}`,
              `阴贵神 ${lunar.getDayPositionYinGuiDesc()}`
            ],
            ' / ',
          ),
          'guiDirection',
        ),
        createField(
          '太岁方位',
          joinValues(
            [
              `年 ${lunar.getYearPositionTaiSuiDesc()}`,
              `月 ${lunar.getMonthPositionTaiSuiDesc()}`,
              `日 ${lunar.getDayPositionTaiSuiDesc()}`
            ],
            ' / ',
          ),
          'taiSuiDirection',
        ),
        createField(
          '九星',
          joinValues(
            [
              `年 ${lunar.getYearNineStar()}`,
              `月 ${lunar.getMonthNineStar()}`,
              `日 ${lunar.getDayNineStar()}`
            ],
            ' / ',
          ),
          'nineStar',
        ),
        createField('宫兽', `${lunar.getGong()}宫 ${lunar.getShou()}`, 'gongShou')
      ]
    }
  ];

  const folkCustomField = createOptionalField('节俗', festivalValue, 'folkCustom');
  if (folkCustomField) {
    additionalGroups.push({
      title: '节俗与节日',
      fields: [folkCustomField]
    });
  }

  return {
    isoDate,
    summary: {
      suitable,
      avoid,
      plainSummary: toPlainSummary(suitable, avoid)
    },
    core: {
      clash: createField('冲煞', `${lunar.getDayChongDesc()} 煞${lunar.getDaySha()}`, 'clash'),
      dutyDeity: createField(
        '值神',
        `${lunar.getDayTianShen()}（${lunar.getDayTianShenType()}）`,
        'dutyDeity',
      ),
      dayOfficer: createField('十二值日', lunar.getZhiXing(), 'dayOfficer'),
      wealthDirection: createField('财神位', lunar.getDayPositionCaiDesc(), 'wealthDirection'),
      joyDirection: createField('喜神位', lunar.getDayPositionXiDesc(), 'joyDirection'),
      fortuneDirection: createField('福神位', lunar.getDayPositionFuDesc(), 'fortuneDirection'),
      fetusDeity: createField('胎神', lunar.getDayPositionTai(), 'fetusDeity'),
      mansion: createField('星宿', `${lunar.getXiu()}宿（${lunar.getXiuLuck()}）`, 'mansion'),
      nayin: createField('纳音', lunar.getDayNaYin(), 'nayin')
    },
    additionalGroups,
    hours: normalizeHours(lunar)
  };
}

function parseIsoDate(isoDate: string): [number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error(`Invalid isoDate: ${isoDate}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const isValid =
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() === month - 1 &&
    utcDate.getUTCDate() === day;

  if (!isValid) {
    throw new Error(`Invalid isoDate: ${isoDate}`);
  }

  return [year, month, day];
}

export function getDayAlmanac(isoDate: string): AlmanacDay {
  const [year, month, day] = parseIsoDate(isoDate);
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  return normalizeLunarData(solar.toYmd(), lunar);
}
