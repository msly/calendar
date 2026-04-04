import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { DayHomePage, HomePage } from '../pages/HomePage';
import { CalendarPage } from '../pages/CalendarPage';
import { ExplainPage } from '../pages/ExplainPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Outlet />
            </AppLayout>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="day/:date" element={<DayHomePage />} />
          <Route path="explain/:key" element={<ExplainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
