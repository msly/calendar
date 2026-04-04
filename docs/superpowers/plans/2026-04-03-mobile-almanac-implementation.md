# Mobile Almanac Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first almanac web app powered by `6tail/lunar-javascript`, with a today-first homepage, month lookup, full day detail, and plain-language explanations for professional almanac terms.

**Architecture:** Build a React + Vite + TypeScript SPA with a small internal adapter layer that normalizes `6tail/lunar-javascript` output into app-friendly day models. Keep the UI split into focused page and component units, with explanation copy maintained in structured config and surfaced through a bottom drawer plus a dedicated explanation page.

**Tech Stack:** React, Vite, TypeScript, React Router, Vitest, Testing Library, `6tail/lunar-javascript`

---

## File Structure Map

Planned file responsibilities:

- `package.json` - scripts and dependencies
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite and Vitest configuration
- `index.html` - SPA entry
- `src/main.tsx` - React bootstrap
- `src/app/App.tsx` - root app shell
- `src/app/router.tsx` - route tree
- `src/app/layout/AppLayout.tsx` - top-level mobile shell and navigation framing
- `src/styles/globals.css` - global variables, reset, base layout, and mobile visual system
- `src/lib/date/date.ts` - date parsing and formatting helpers
- `src/lib/almanac/types.ts` - normalized app types
- `src/lib/almanac/explanations.ts` - structured explanation content
- `src/lib/almanac/adapter.ts` - `6tail/lunar-javascript` adapter
- `src/lib/almanac/adapter.test.ts` - adapter tests
- `src/state/date-context.tsx` - selected-date state and actions
- `src/components/date/DateHeader.tsx` - current date summary and previous/next navigation
- `src/components/home/TodaySummaryCard.tsx` - suitable/avoid hero card
- `src/components/home/LuckyHoursTimeline.tsx` - hour timeline and hour details
- `src/components/home/AlmanacInfoGrid.tsx` - homepage field grid with explanation triggers
- `src/components/calendar/MonthCalendar.tsx` - month grid and day selection
- `src/components/common/BottomDrawer.tsx` - reusable drawer
- `src/components/common/TermChip.tsx` - label + `?` trigger
- `src/components/detail/DetailSection.tsx` - collapsible detail groups
- `src/pages/HomePage.tsx` - homepage
- `src/pages/CalendarPage.tsx` - month page
- `src/pages/DayDetailPage.tsx` - full day detail page
- `src/pages/ExplainPage.tsx` - long explanation page
- `src/test/setup.ts` - Vitest setup
- `src/pages/HomePage.test.tsx` - homepage tests
- `src/pages/CalendarPage.test.tsx` - calendar flow tests
- `src/pages/DayDetailPage.test.tsx` - detail page tests
- `src/components/common/BottomDrawer.test.tsx` - explanation interaction tests

Notes:

- The current workspace is not a git repository. Commit steps below assume either `git init` has already been run or the code has been moved into a repo before implementation starts.
- Keep files focused. Do not let page files absorb adapter or explanation logic.

## Task 1: Bootstrap the React/Vite Mobile Shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/router.tsx`
- Create: `src/app/layout/AppLayout.tsx`
- Create: `src/styles/globals.css`
- Create: `src/test/setup.ts`
- Test: `src/app/App.test.tsx`

- [ ] **Step 1: Write the failing smoke test**

```tsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders the almanac app shell', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: '今日黄历' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/app/App.test.tsx`
Expected: FAIL because `App` and the test toolchain do not exist yet.

- [ ] **Step 3: Create the toolchain and minimal app shell**

```json
{
  "name": "wanlianli",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

```tsx
export function App() {
  return (
    <main className="app-shell">
      <h1>今日黄历</h1>
    </main>
  );
}
```

- [ ] **Step 4: Install dependencies and run the test again**

Run: `pnpm install`
Expected: dependencies install successfully.

Run: `pnpm vitest run src/app/App.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts index.html src
git commit -m "chore: bootstrap mobile almanac app shell"
```

## Task 2: Add the Almanac Adapter and Normalized Types

**Files:**
- Create: `src/lib/almanac/types.ts`
- Create: `src/lib/almanac/explanations.ts`
- Create: `src/lib/almanac/adapter.ts`
- Test: `src/lib/almanac/adapter.test.ts`

- [ ] **Step 1: Write the failing adapter tests**

```ts
import { getDayAlmanac } from './adapter';

test('normalizes key homepage almanac fields', () => {
  const result = getDayAlmanac('2026-04-03');
  expect(result.summary.suitable.length).toBeGreaterThan(0);
  expect(result.summary.avoid.length).toBeGreaterThan(0);
  expect(result.core.clash.label).toBeTruthy();
  expect(result.hours.length).toBe(12);
});
```

- [ ] **Step 2: Run the adapter test to verify it fails**

Run: `pnpm vitest run src/lib/almanac/adapter.test.ts`
Expected: FAIL because the adapter and normalized types do not exist.

- [ ] **Step 3: Implement the normalized types and adapter**

```ts
export type AlmanacDay = {
  isoDate: string;
  summary: {
    suitable: string[];
    avoid: string[];
    plainSummary: string;
  };
  core: {
    clash: AlmanacField;
    dutyDeity: AlmanacField;
    dayOfficer: AlmanacField;
    wealthDirection: AlmanacField;
  };
  hours: AlmanacHour[];
};
```

```ts
export function getDayAlmanac(isoDate: string): AlmanacDay {
  const solar = Solar.fromYmd(...isoDate.split('-').map(Number));
  const lunar = solar.getLunar();
  return normalizeLunarData(solar, lunar);
}
```

- [ ] **Step 4: Add explanation config entries for every field rendered on the homepage**

```ts
export const explanationMap = {
  clash: { title: '冲煞', short: '表示当天相冲的生肖和煞位。' },
  dutyDeity: { title: '值神', short: '表示当天值日之神，用来辅助判断吉凶属性。' }
};
```

- [ ] **Step 5: Run the tests again**

Run: `pnpm vitest run src/lib/almanac/adapter.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/almanac
git commit -m "feat: add lunar adapter and normalized almanac types"
```

## Task 3: Add Selected-Date State and Shared Date Header

**Files:**
- Create: `src/state/date-context.tsx`
- Create: `src/lib/date/date.ts`
- Create: `src/components/date/DateHeader.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/layout/AppLayout.tsx`
- Test: `src/components/date/DateHeader.test.tsx`

- [ ] **Step 1: Write the failing interaction test**

```tsx
test('moves to the previous day when the previous button is tapped', async () => {
  renderWithDateHeader('2026-04-03');
  await user.click(screen.getByRole('button', { name: '上一天' }));
  expect(screen.getByText('2026-04-02')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/components/date/DateHeader.test.tsx`
Expected: FAIL because the selected-date state and header component are missing.

- [ ] **Step 3: Implement shared date state**

```tsx
const DateContext = createContext<DateContextValue | null>(null);

export function DateProvider({ children }: PropsWithChildren) {
  const [selectedDate, setSelectedDate] = useState(getTodayIsoDate());
  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
}
```

- [ ] **Step 4: Implement the mobile date header**

```tsx
export function DateHeader() {
  const { selectedDate, setSelectedDate } = useDateContext();
  return (
    <header>
      <button aria-label="上一天" onClick={() => setSelectedDate(addDays(selectedDate, -1))} />
      <p>{selectedDate}</p>
      <button aria-label="下一天" onClick={() => setSelectedDate(addDays(selectedDate, 1))} />
    </header>
  );
}
```

- [ ] **Step 5: Run the test again**

Run: `pnpm vitest run src/components/date/DateHeader.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/state src/lib/date src/components/date src/app
git commit -m "feat: add shared date state and mobile date header"
```

## Task 4: Build the Homepage Summary, Hour Timeline, and Explanation Drawer

**Files:**
- Create: `src/components/common/BottomDrawer.tsx`
- Create: `src/components/common/TermChip.tsx`
- Create: `src/components/home/TodaySummaryCard.tsx`
- Create: `src/components/home/LuckyHoursTimeline.tsx`
- Create: `src/components/home/AlmanacInfoGrid.tsx`
- Create: `src/pages/HomePage.tsx`
- Modify: `src/app/router.tsx`
- Test: `src/pages/HomePage.test.tsx`
- Test: `src/components/common/BottomDrawer.test.tsx`

- [ ] **Step 1: Write the failing homepage test**

```tsx
test('renders today summary and opens the explanation drawer', async () => {
  renderHomePage();
  expect(screen.getByText('今日宜')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '查看冲煞解释' }));
  expect(screen.getByRole('dialog', { name: '冲煞说明' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the homepage tests to verify they fail**

Run: `pnpm vitest run src/pages/HomePage.test.tsx src/components/common/BottomDrawer.test.tsx`
Expected: FAIL because homepage sections and drawer behavior do not exist yet.

- [ ] **Step 3: Implement the reusable bottom drawer and term trigger**

```tsx
export function TermChip({ label, onExplain }: Props) {
  return (
    <span>
      {label}
      <button aria-label={`查看${label}解释`} onClick={onExplain}>?</button>
    </span>
  );
}
```

- [ ] **Step 4: Implement the homepage sections**

```tsx
export function HomePage() {
  const data = useSelectedDayAlmanac();
  return (
    <>
      <DateHeader />
      <TodaySummaryCard summary={data.summary} />
      <LuckyHoursTimeline hours={data.hours} />
      <AlmanacInfoGrid core={data.core} />
    </>
  );
}
```

- [ ] **Step 5: Run the homepage tests again**

Run: `pnpm vitest run src/pages/HomePage.test.tsx src/components/common/BottomDrawer.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/common src/components/home src/pages/HomePage.tsx src/app/router.tsx
git commit -m "feat: add homepage almanac summary and explanation drawer"
```

## Task 5: Build the Month Calendar Lookup Page

**Files:**
- Create: `src/components/calendar/MonthCalendar.tsx`
- Create: `src/pages/CalendarPage.tsx`
- Modify: `src/components/date/DateHeader.tsx`
- Modify: `src/app/router.tsx`
- Test: `src/pages/CalendarPage.test.tsx`

- [ ] **Step 1: Write the failing calendar-flow test**

```tsx
test('selects a day from the month view and navigates to day detail', async () => {
  renderCalendarPage();
  await user.click(screen.getByRole('button', { name: '2026-04-12' }));
  expect(mockNavigate).toHaveBeenCalledWith('/day/2026-04-12');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/pages/CalendarPage.test.tsx`
Expected: FAIL because the month page and date-cell behavior do not exist.

- [ ] **Step 3: Implement the month calendar grid**

```tsx
export function MonthCalendar({ month, onSelectDate }: Props) {
  return month.days.map((day) => (
    <button key={day.isoDate} aria-label={day.isoDate} onClick={() => onSelectDate(day.isoDate)}>
      <span>{day.day}</span>
      <small>{day.lunarLabel}</small>
    </button>
  ));
}
```

- [ ] **Step 4: Wire the homepage date header to open the calendar page**

Run: update the date header so the month entry is visible and route-safe on mobile.
Expected: homepage has a stable, obvious calendar entry.

- [ ] **Step 5: Run the test again**

Run: `pnpm vitest run src/pages/CalendarPage.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/calendar src/pages/CalendarPage.tsx src/components/date/DateHeader.tsx src/app/router.tsx
git commit -m "feat: add month calendar lookup flow"
```

## Task 6: Build the Full Day Detail Page with Grouped Sections

**Files:**
- Create: `src/components/detail/DetailSection.tsx`
- Create: `src/pages/DayDetailPage.tsx`
- Modify: `src/app/router.tsx`
- Test: `src/pages/DayDetailPage.test.tsx`

- [ ] **Step 1: Write the failing detail-page test**

```tsx
test('shows grouped almanac sections and allows expanding low-priority fields', async () => {
  renderDayDetailPage('2026-04-03');
  expect(screen.getByText('今日概览')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '展开方位与五行' }));
  expect(screen.getByText('财神位')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/pages/DayDetailPage.test.tsx`
Expected: FAIL because the detail page and grouped sections do not exist.

- [ ] **Step 3: Implement the collapsible section component**

```tsx
export function DetailSection({ title, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section>
      <button aria-label={`${open ? '收起' : '展开'}${title}`} onClick={() => setOpen((v) => !v)} />
      {open ? children : null}
    </section>
  );
}
```

- [ ] **Step 4: Implement the day detail page**

```tsx
export function DayDetailPage() {
  const { date } = useParams();
  const data = getDayAlmanac(date!);
  return (
    <>
      <DetailSection title="今日概览" defaultOpen />
      <DetailSection title="时辰吉凶" defaultOpen />
      <DetailSection title="神煞与值神" />
      <DetailSection title="方位与五行" />
      <DetailSection title="传统历法信息" />
    </>
  );
}
```

- [ ] **Step 5: Run the test again**

Run: `pnpm vitest run src/pages/DayDetailPage.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/detail src/pages/DayDetailPage.tsx src/app/router.tsx
git commit -m "feat: add grouped full-day almanac detail page"
```

## Task 7: Add the Explanation Detail Page and Long-Form Content Routing

**Files:**
- Create: `src/pages/ExplainPage.tsx`
- Modify: `src/lib/almanac/explanations.ts`
- Modify: `src/components/common/BottomDrawer.tsx`
- Modify: `src/app/router.tsx`
- Test: `src/pages/ExplainPage.test.tsx`

- [ ] **Step 1: Write the failing explanation-page test**

```tsx
test('renders long-form explanation content for a selected term', () => {
  renderExplainPage('/explain/clash');
  expect(screen.getByRole('heading', { name: '冲煞' })).toBeInTheDocument();
  expect(screen.getByText('传统上通常用于参考当天相冲生肖和方位')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/pages/ExplainPage.test.tsx`
Expected: FAIL because long-form explanation routing does not exist.

- [ ] **Step 3: Implement the explanation page and route handoff from the drawer**

```tsx
export function ExplainPage() {
  const { key } = useParams();
  const content = explanationMap[key as ExplanationKey];
  return <article><h1>{content.title}</h1><p>{content.long}</p></article>;
}
```

- [ ] **Step 4: Add solar-term and custom explanation records**

Run: expand `src/lib/almanac/explanations.ts` so homepage and detail pages can route to long-form content without fallback gaps.
Expected: explanation coverage exists for every rendered `?` field and for current in-scope seasonal content.

- [ ] **Step 5: Run the test again**

Run: `pnpm vitest run src/pages/ExplainPage.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/pages/ExplainPage.tsx src/lib/almanac/explanations.ts src/components/common/BottomDrawer.tsx src/app/router.tsx
git commit -m "feat: add long-form explanation page"
```

## Task 8: Apply the Mobile Visual System and Layout Polish

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/app/layout/AppLayout.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/DayDetailPage.tsx`
- Test: `src/pages/HomePage.test.tsx`

- [ ] **Step 1: Write or extend a failing layout test for mobile affordances**

```tsx
test('shows the homepage hero before low-priority sections', () => {
  renderHomePage();
  const main = screen.getByRole('main');
  expect(main.firstChild).toHaveTextContent('今日宜');
});
```

- [ ] **Step 2: Run the test to verify it fails or captures the current mismatch**

Run: `pnpm vitest run src/pages/HomePage.test.tsx`
Expected: FAIL if the rendered order or layout markers do not match the intended hierarchy.

- [ ] **Step 3: Implement the mobile visual system**

```css
:root {
  --bg: #f6f1e7;
  --card: #fffaf2;
  --text: #2c2418;
  --accent: #9d3f24;
}

.app-shell {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px 16px 32px;
}
```

- [ ] **Step 4: Add spacing, sticky affordances, and readable card hierarchy**

Run: adjust homepage and detail page structure so the today summary is visually dominant, the timeline remains readable, and secondary groups do not overwhelm the first screen.
Expected: mobile-first hierarchy matches the approved spec.

- [ ] **Step 5: Run the relevant tests again**

Run: `pnpm vitest run src/pages/HomePage.test.tsx src/pages/DayDetailPage.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/styles/globals.css src/app/layout/AppLayout.tsx src/pages/HomePage.tsx src/pages/DayDetailPage.tsx
git commit -m "style: polish mobile almanac layout"
```

## Task 9: Final Verification and Delivery Prep

**Files:**
- Modify: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Add a minimal project README**

```md
# 万年历 Web

## Scripts
- `pnpm dev`
- `pnpm build`
- `pnpm test`
```

- [ ] **Step 2: Run the full automated test suite**

Run: `pnpm test`
Expected: PASS

- [ ] **Step 3: Run the production build**

Run: `pnpm build`
Expected: PASS with generated production assets and no TypeScript errors.

- [ ] **Step 4: Manually verify the core mobile flows**

Run: `pnpm dev`
Expected: local app loads and these flows work:

- homepage shows today's almanac
- previous / next date works
- month page opens and selects a date
- day detail page renders grouped sections
- `?` opens the bottom drawer
- long-form explanation page opens

- [ ] **Step 5: Commit**

```bash
git add README.md package.json
git commit -m "docs: add usage and finish mobile almanac v1"
```

## Plan Review Status

- Plan-review subagent loop is not executed here because the current session instructions forbid spawning agents unless the user explicitly asks for sub-agents or delegation.
- If the user wants strict workflow compliance, ask for permission to run a plan-review subagent against this document and the approved spec.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-03-mobile-almanac-implementation.md`.

Two execution options:

**1. Subagent-Driven (recommended)** - dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - execute tasks in this session using the plan order, with checkpoints
