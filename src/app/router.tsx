import { Capacitor } from '@capacitor/core';
import { BrowserRouter, HashRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { DayHomePage, HomePage } from '../pages/HomePage';
import { CalendarPage } from '../pages/CalendarPage';
import { ExplainPage } from '../pages/ExplainPage';

export function AppRouter() {
  const Router = Capacitor.isNativePlatform() ? HashRouter : BrowserRouter;

  return (
    <Router>
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
    </Router>
  );
}
