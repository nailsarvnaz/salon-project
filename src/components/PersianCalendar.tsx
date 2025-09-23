import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PERSIAN_WEEK_DAYS_SHORT, ODD_DAYS_OF_WEEK, EVEN_DAYS_OF_WEEK } from '../constants';

interface PersianCalendarProps {
  onSelect: (date: Date) => void;
  onClose: () => void;
  selectedDate: Date | null;
}

const PersianCalendar: React.FC<PersianCalendarProps> = ({ onSelect, onClose, selectedDate }) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        // Also check if the click was on the date button that opens the calendar to prevent immediate closing.
        const dateButton = document.getElementById('date-button');
        if (dateButton && !dateButton.contains(event.target as Node)) {
            onClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const changeMonth = (amount: number) => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(1); // Set to first of month to avoid skipping months
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const { persianYear, persianMonth } = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
    });
    const parts = formatter.formatToParts(viewDate);
    return {
      persianYear: parts.find(p => p.type === 'year')?.value || '',
      persianMonth: parts.find(p => p.type === 'month')?.value || '',
    };
  }, [viewDate]);
  
  const calendarGrid = useMemo(() => {
    const today = new Date();
    const now = new Date();
    const isTodayDisabled = now.getHours() >= 10;

    today.setHours(0, 0, 0, 0);
    

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Persian week starts Saturday. JS getDay() is 6 for Sat. Grid index should be 0.
    // Map: Sat(6)->0, Sun(0)->1, Mon(1)->2, Tue(2)->3, Wed(3)->4, Thu(4)->5, Fri(5)->6
    const dayOfWeekOffset = (firstDayOfMonth.getDay() + 1) % 7;

    const days: any[] = [];
    for (let i = 0; i < dayOfWeekOffset; i++) {
      days.push({ key: `prev-${i}`, isEmpty: true });
    }

    const workingDays = [...EVEN_DAYS_OF_WEEK, ...ODD_DAYS_OF_WEEK];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < today;
      
      const isToday = today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate();

      const dayOfWeek = date.getDay();
      const isWorkingDay = workingDays.includes(dayOfWeek);
      const isDisabled = isPast || !isWorkingDay || (isToday && isTodayDisabled);

      const isSelected = selectedDate ? 
        date.getFullYear() === selectedDate.getFullYear() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getDate() === selectedDate.getDate()
        : false;

      days.push({
        key: date.toISOString(),
        date,
        persianDay: new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(date),
        isDisabled,
        isSelected,
        isToday,
      });
    }
    
    // Pad the grid to ensure a fixed height of 6 rows (42 cells total)
    // This prevents the calendar from changing height between months.
    const totalCells = days.length;
    const cellsToPad = 42 - totalCells;
    if (cellsToPad > 0) {
      for (let i = 0; i < cellsToPad; i++) {
        days.push({ key: `next-${i}`, isEmpty: true });
      }
    }


    return days;
  }, [viewDate, selectedDate]);

  const handleDayClick = (day: { date: Date, isDisabled: boolean }) => {
    if (!day.isDisabled) {
      onSelect(day.date);
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-20">
      <div 
        ref={calendarRef}
        className="bg-slate-900/95 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl shadow-2xl p-4 animate-fade-in-up-sm"
        style={{boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}
      >
        <div className="flex items-center justify-between px-2 mb-3">
          <button type="button" onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-white/10 transition">
            <i className="fas fa-chevron-left text-slate-300"></i>
          </button>
          <div className="font-bold text-lg text-white text-center">
            {persianMonth} {persianYear}
          </div>
          <button type="button" onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-white/10 transition">
            <i className="fas fa-chevron-right text-slate-300"></i>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
          {PERSIAN_WEEK_DAYS_SHORT.map(day => (
            <div key={day} className="p-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 place-items-center">
          {calendarGrid.map((day) =>
            day.isEmpty ? (
              <div key={day.key} className="w-10 h-10"></div>
            ) : (
              <button
                key={day.key}
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={day.isDisabled}
                className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center font-semibold
                  ${day.isDisabled ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-fuchsia-500/20'}
                  ${day.isToday && !day.isSelected ? 'border-2 border-cyan-400 text-cyan-300' : ''}
                  ${day.isSelected ? 'bg-fuchsia-600 text-white font-bold shadow-lg shadow-fuchsia-500/30 transform scale-110' : 'text-slate-200'}
                `}
              >
                {day.persianDay}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PersianCalendar;