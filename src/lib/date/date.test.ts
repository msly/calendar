import { addDays } from './date';

test('throws for invalid ISO calendar dates', () => {
  expect(() => addDays('2026-02-30', 1)).toThrow('Invalid ISO date: 2026-02-30');
});

test('rolls over correctly across month boundaries', () => {
  expect(addDays('2026-04-30', 1)).toBe('2026-05-01');
});
