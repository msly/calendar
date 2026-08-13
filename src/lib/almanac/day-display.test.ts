import { getDayDisplay } from './day-display';

test('uses a public holiday festival as the month-cell note', () => {
  const result = getDayDisplay('2026-05-01');

  expect(result.calendarNote).toBe('劳动节');
  expect(result.solarFestivals).toContain('劳动节');
  expect(result.officialHoliday).toEqual({
    name: '劳动节',
    status: 'rest',
    targetDate: '2026-05-01'
  });
  expect(result.hasOfficialHolidayData).toBe(true);
});

test('returns lunar festivals and official rest-day data independently', () => {
  const result = getDayDisplay('2026-02-17');

  expect(result.calendarNote).toBe('春节');
  expect(result.lunarFestivals).toContain('春节');
  expect(result.officialHoliday?.status).toBe('rest');
});

test('marks an official make-up workday and its related holiday date', () => {
  const result = getDayDisplay('2026-02-28');

  expect(result.officialHoliday).toEqual({
    name: '春节',
    status: 'work',
    targetDate: '2026-02-17'
  });
});

test('reports that official holiday data is unavailable after 2026', () => {
  const result = getDayDisplay('2027-01-01');

  expect(result.solarFestivals).toContain('元旦节');
  expect(result.officialHoliday).toBeNull();
  expect(result.hasOfficialHolidayData).toBe(false);
});
