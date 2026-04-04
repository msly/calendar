import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import { addDays, getTodayIsoDate } from '../lib/date/date';

type DateContextValue = {
  selectedDate: string;
  setSelectedDate: (isoDate: string) => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
};

type DateProviderProps = PropsWithChildren<{
  initialSelectedDate?: string;
}>;

const DateContext = createContext<DateContextValue | null>(null);

export function DateProvider({ children, initialSelectedDate }: DateProviderProps) {
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate ?? getTodayIsoDate());

  const goToPreviousDay = () => {
    setSelectedDate((currentDate) => addDays(currentDate, -1));
  };

  const goToNextDay = () => {
    setSelectedDate((currentDate) => addDays(currentDate, 1));
  };

  return (
    <DateContext.Provider
      value={{ selectedDate, setSelectedDate, goToPreviousDay, goToNextDay }}
    >
      {children}
    </DateContext.Provider>
  );
}

export function useDateContext(): DateContextValue {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDateContext must be used within a DateProvider');
  }
  return context;
}
