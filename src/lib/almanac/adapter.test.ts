import { getDayAlmanac } from './adapter';

test('normalizes key homepage almanac fields', () => {
  const result = getDayAlmanac('2026-04-03');
  expect(result.summary.suitable.length).toBeGreaterThan(0);
  expect(result.summary.avoid.length).toBeGreaterThan(0);
  expect(result.core.clash.label).toBeTruthy();
  expect(result.additionalGroups.length).toBeGreaterThanOrEqual(2);
  expect(result.additionalGroups[0]?.fields.some((field) => field.label === '年干支')).toBe(true);
  expect(result.hours.length).toBe(12);
});

test('merges split 子时 into one explicit normalized slot', () => {
  const result = getDayAlmanac('2026-04-03');
  const ziHour = result.hours.find((hour) => hour.label === '子时');

  expect(ziHour).toBeDefined();
  expect(ziHour?.range).toBe('23:00-00:59');
  expect(ziHour?.deity).not.toContain('早子:');
  expect(ziHour?.luck).not.toContain('早子:');
  expect(ziHour?.clash).not.toContain('早子:');
  expect(ziHour?.segments).toHaveLength(2);
  expect(ziHour?.segments?.[0].label).toBe('早子');
  expect(ziHour?.segments?.[0].range).toBe('00:00-00:59');
  expect(ziHour?.segments?.[0].deity).toBeTruthy();
  expect(ziHour?.segments?.[0].luck).toBeTruthy();
  expect(ziHour?.segments?.[0].clash).toBeTruthy();
  expect(ziHour?.segments?.[1].label).toBe('晚子');
  expect(ziHour?.segments?.[1].range).toBe('23:00-23:59');
  expect(ziHour?.segments?.[1].deity).toBeTruthy();
  expect(ziHour?.segments?.[1].luck).toBeTruthy();
  expect(ziHour?.segments?.[1].clash).toBeTruthy();
  expect(ziHour?.suitable).toContain('祈福');
  expect(ziHour?.suitable).not.toContain('无');
  expect(ziHour?.avoid).toContain('上梁');
  expect(ziHour?.avoid).toContain('诸事不宜');
});

test('rejects impossible dates', () => {
  expect(() => getDayAlmanac('2026-02-30')).toThrow('Invalid isoDate');
});
