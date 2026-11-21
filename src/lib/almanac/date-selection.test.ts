import { findSuitableDates } from './date-selection';

const DEFAULT_FILTERS = {
  excludeMakeUpWorkdays: true,
  weekendsOrRestDaysOnly: false
};

test('finds dates whose suitable list includes the selected activity', () => {
  const results = findSuitableDates('2026-08-13', 30, 'wedding', DEFAULT_FILTERS);

  expect(results).toHaveLength(13);
  expect(results[0]).toMatchObject({
    isoDate: '2026-08-18',
    weekdayLabel: '星期二',
    calendarNote: '',
    suitable: ['嫁娶']
  });
  expect(results.find((result) => result.isoDate === '2026-08-23')?.calendarNote).toBe('处暑');
  expect(results.every((result) => result.suitable.includes('嫁娶'))).toBe(true);
});

test('supports activities represented by more than one almanac keyword', () => {
  const results = findSuitableDates('2026-08-13', 30, 'moving', DEFAULT_FILTERS);
  const partialMatch = results.find((result) => result.isoDate === '2026-08-23');

  expect(partialMatch?.suitable).toEqual(['移徙']);
  expect(results.find((result) => result.isoDate === '2026-08-16')?.suitable).toEqual([
    '入宅',
    '移徙'
  ]);
});

test('excludes official make-up workdays by default', () => {
  const excluded = findSuitableDates('2026-02-28', 30, 'travel', DEFAULT_FILTERS);
  const included = findSuitableDates('2026-02-28', 30, 'travel', {
    ...DEFAULT_FILTERS,
    excludeMakeUpWorkdays: false
  });

  expect(excluded.some((result) => result.isoDate === '2026-02-28')).toBe(false);
  expect(included.find((result) => result.isoDate === '2026-02-28')).toMatchObject({
    officialHoliday: {
      name: '春节',
      status: 'work'
    }
  });
});

test('can limit results to weekends and official rest days', () => {
  const results = findSuitableDates('2026-08-13', 30, 'wedding', {
    ...DEFAULT_FILTERS,
    weekendsOrRestDaysOnly: true
  });

  expect(results.map((result) => result.isoDate)).toEqual([
    '2026-08-23',
    '2026-08-30',
    '2026-09-05',
    '2026-09-06'
  ]);
  expect(results.every((result) => result.isWeekend)).toBe(true);
});

test('rejects an invalid start date', () => {
  expect(() => findSuitableDates('2026-02-30', 30, 'wedding', DEFAULT_FILTERS)).toThrow(
    'Invalid start date',
  );
});
