# Mobile Almanac Web App Design

Date: 2026-04-03
Status: Draft approved in conversation, awaiting written-spec review

## 1. Goal

Build a mobile-first web almanac app based on `6tail/lunar-javascript`.

The product focus is:

- mobile first
- no account system in v1
- today almanac first
- professional almanac data with plain-language explanations
- light content only: term explanations, solar term notes, and traditional customs

PC support is not a v1 priority.

## 2. Product Positioning

This is a tool-first almanac product, not a content feed and not a personal planner.

The primary user task is:

1. open the app
2. understand today's almanac quickly
3. inspect important details such as lucky hours, conflicts, deities, and directions
4. optionally switch to another date
5. optionally read a plain-language explanation for unfamiliar terms

## 3. Scope

### In Scope for v1

- today almanac homepage
- date switching
- month calendar lookup
- full day almanac detail page
- term explanations
- solar term explanations
- traditional custom explanations
- mobile UI optimized for narrow screens

### Out of Scope for v1

- account and login
- reminders, anniversaries, countdowns
- weather
- fortune, zodiac luck, astrology
- dream, lottery, divination, or fortune-telling extensions
- personalized bazi calculation
- desktop-first layouts
- editorial content feed

## 4. Information Architecture

The homepage must follow this priority order:

1. top date area
2. today almanac hero
3. lucky-hour timeline
4. core almanac fields
5. light explanation content
6. full detail entry

The design principle is:

`conclusion first, evidence second, explanation third, deep reading last`

## 5. Pages

### 5.1 Home Page

Primary entry for daily use.

Sections:

- current Gregorian date, weekday, lunar date, ganzhi
- previous day / next day controls
- month calendar entry
- today suitable / avoid summary
- one-sentence plain-language interpretation
- lucky-hour timeline
- compact grid of key almanac fields
- light explanation blocks tied to the current date
- entry to full day detail

### 5.2 Month Calendar Page

Purpose: browse and pick any day in a month.

Characteristics:

- month view on a dedicated page
- each date cell shows minimal useful markers
- clicking a date opens the selected day's detail page
- returning to the homepage should preserve the selected date state when appropriate

Suggested cell metadata:

- lunar day
- solar term / festival marker
- lightweight suitable / avoid marker if visually feasible

### 5.3 Day Detail Page

Purpose: show the complete professional almanac for one day.

Structure:

- day overview
- lucky-hour section
- deity and good/bad spirit section
- direction and five-element section
- traditional calendar section

Low-priority groups should be collapsible by default.

### 5.4 Explanation Detail Page

Purpose: hold longer explanation content when the inline drawer is not enough.

Supported content types:

- almanac term explanation
- solar term explanation
- custom / folk explanation

This page is not a generic article feed.

## 6. Core Interactions

### 6.1 Date Switching

The homepage top area supports previous-day and next-day switching without route changes.

Switching dates refreshes all visible almanac content for that date.

### 6.2 Month Calendar Entry

The homepage provides a month-calendar entry point near the date area.

For mobile, month browsing should use a full page rather than expanding a large calendar inline on the homepage.

### 6.3 Date Selection

Selecting a date from the month calendar opens the day detail page for that date.

The selected date should remain consistent across the app until changed again.

### 6.4 Term Explanations

Professional terms show a `?` trigger next to the label.

Clicking the trigger opens a bottom drawer.

Drawer structure:

- one-sentence explanation
- what it means in today's context
- how a user should interpret it
- optional entry to a longer explanation page

### 6.5 Lucky-Hour Interaction

The lucky-hour timeline should support tapping an hour block to reveal:

- luck level
- hour-level suitable / avoid hints
- short explanation

This should be a light interaction, not a route change.

## 7. Almanac Field Scope

### 7.1 Homepage Essential Fields

The homepage should directly show:

- suitable
- avoid
- one-sentence summary
- lucky-hour timeline
- clash / sha
- duty deity
- twelve day officer
- wealth deity direction
- joy deity direction
- fortune deity direction
- fetus deity
- mansion
- nayin

### 7.2 Day Detail Full Fields

The detail page should support:

- Gregorian date
- lunar date
- weekday
- zodiac
- heavenly stems and earthly branches
- basic bazi-related day info
- solar term
- festivals
- suitable
- avoid
- lucky / unlucky hours
- hour-level suitable / avoid
- clash / sha
- duty deity
- yellow path / black path
- twelve day officer
- auspicious gods
- inauspicious gods
- fetus deity
- five elements
- nayin
- twenty-eight mansions
- Peng Zu hundred avoidances
- wealth deity direction
- joy deity direction
- fortune deity direction
- noble deity direction
- moon phase
- phenology
- solar-term explanation
- custom explanation

### 7.3 Fields Requiring Explanation Support

These fields must support drawer explanations:

- duty deity
- twelve day officer
- yellow path / black path
- clash / sha
- fetus deity
- nayin
- Peng Zu avoidances
- mansions
- auspicious gods
- inauspicious gods
- deity directions
- five elements
- solar term
- phenology

## 8. Explanation Content Strategy

The explanation system exists to make professional almanac data understandable to normal users.

### 8.1 Three Explanation Levels

#### Instant Explanation

Shown in the bottom drawer.

Goal:

- explain the term in plain language

#### Today Context

Shown below the instant explanation.

Goal:

- explain what the term implies for the selected day

#### Detailed Explanation

Shown on the explanation detail page when needed.

Goal:

- provide deeper background without polluting core flows

### 8.2 Writing Principles

- explain in plain language first
- avoid mystical or exaggerated claims
- avoid absolute instructions
- prefer wording such as "traditionally interpreted as" or "commonly used as a reference for"
- keep drawer copy short enough to read in one mobile screen

### 8.3 Explanation Content Types

Only these are supported in v1:

- almanac term explanations
- solar term explanations
- traditional custom explanations

## 9. Technical Design

### 9.1 Stack

- `React`
- `Vite`
- `TypeScript`
- `React Router`
- `6tail/lunar-javascript`

The v1 app should be a mobile-first SPA.

### 9.2 Why Frontend-Only First

v1 has no account, no reminders, and no backend-managed content feed.

Most of the core almanac data can be produced locally from the lunar library.

Benefits:

- faster delivery
- fewer dependencies
- no backend requirement for core features

### 9.3 App Structure

Pages:

- `HomePage`
- `CalendarPage`
- `DayDetailPage`
- `ExplainPage`

Suggested shared components:

- `DateHeader`
- `TodaySummaryCard`
- `LuckyHoursTimeline`
- `AlmanacInfoGrid`
- `MonthCalendar`
- `ExplainDrawer`
- `DetailSection`
- `ExplainArticle`

### 9.4 Data Model

The app should normalize all day data into one internal view model centered on a selected date.

Suggested sections:

- `solar`
- `lunar`
- `ganzhi`
- `almanac`
- `hours`
- `seasonal`
- `explanations`

This model should feed homepage, detail page, and explanation UI consistently.

### 9.5 Adapter Layer

Do not call `6tail/lunar-javascript` directly throughout page components.

Create an adapter layer such as:

- `getDayAlmanac(date)`
- `getHourAlmanac(date)`
- `getSeasonalInfo(date)`
- `getExplainContent(field, value)`

Benefits:

- isolates third-party API details
- simplifies testing
- keeps components stable if the library changes

### 9.6 Explanation Source

Explanation content should be stored as structured local configuration instead of being hardcoded inside UI components.

Each explanation item should support:

- title
- short explanation
- today-context explanation template
- long explanation
- related terms

## 10. Error Handling

### 10.1 Unsupported Dates

If a selected date is outside supported range, show a clear unsupported message instead of a blank screen.

### 10.2 Missing Fields

If an almanac field is unavailable:

- homepage only renders stable fields
- detail page shows `暂无` for missing items
- one missing field must not break the whole page

### 10.3 Missing Explanation Copy

If a long explanation is not yet prepared:

- drawer still shows the short explanation
- the UI clearly indicates that the full explanation is not available yet

### 10.4 Mobile Density

To avoid excessive homepage length:

- only high-priority fields appear on the homepage
- low-priority fields move to detail page
- detail sections are collapsible

### 10.5 Library Contract Changes

If `6tail/lunar-javascript` changes returned field names or output shape, the adapter layer handles the change.

## 11. Testing Strategy

### 11.1 Adapter Tests

Test representative dates:

- ordinary dates
- solar term dates
- festivals
- month boundaries
- year boundaries
- leap-month related dates where applicable

### 11.2 Component Tests

Cover:

- homepage rendering of core fields
- `?` opening the bottom drawer
- month-calendar date selection
- detail-page fold/unfold behavior

### 11.3 Content Integrity Tests

Verify:

- no empty explanation copy
- no field-to-copy mismatch
- consistent wording between homepage and detail contexts

### 11.4 Mobile Validation

Check common iPhone and Android widths for:

- above-the-fold readability
- tap target usability
- drawer open/close behavior
- date switching flow

### 11.5 Regression Focus

Every major change should re-verify:

- today's almanac rendering
- date switching
- month calendar selection
- explanation drawer
- detail-page completeness

## 12. Open Constraints

- The current workspace is not a git repository, so this spec cannot be committed yet.
- The spec-review subagent loop defined by the brainstorming workflow is blocked by the current session rule that forbids spawning agents unless the user explicitly asks for it.

## 13. Next Step

Once this written spec is reviewed by the user, the next workflow step is to create the implementation plan and then start building the app.
