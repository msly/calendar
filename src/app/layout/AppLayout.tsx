import type { PropsWithChildren } from 'react';
import { DateHeader } from '../../components/date/DateHeader';
import { DateProvider } from '../../state/date-context';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <DateProvider>
      <div className="app-layout">
        <div className="app-layout__content">
          <DateHeader />
          {children}
        </div>
      </div>
    </DateProvider>
  );
}
