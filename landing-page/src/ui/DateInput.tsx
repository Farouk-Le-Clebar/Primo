import React, { useState, useRef, useEffect } from "react";

type DateInputProps = {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
};

const pad = (n: number) => n.toString().padStart(2, "0");

const formatDate = (date: Date) => {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

const parseDate = (str: string): Date | null => {
  const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return isNaN(d.getTime()) ? null : d;
};

const daysOfWeek = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];

const DateInput = ({ value, onChange, placeholder = "JJ/MM/AAAA", className = "" }: DateInputProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date>(() => parseDate(value) || new Date());
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9/]*$/.test(val) && val.length <= 10) {
      onChange(val);
      const d = parseDate(val);
      if (d) setCalendarDate(d);
    }
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    onChange(formatDate(newDate));
    setCalendarDate(newDate);
    setShowCalendar(false);
  };

  const changeMonth = (delta: number) => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + delta, 1));
  };

  const generateDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const startWeekDay = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startWeekDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const isSelectedDay = (day: number) => {
    const d = parseDate(value);
    if (!d) return false;
    return (
      d.getFullYear() === calendarDate.getFullYear() &&
      d.getMonth() === calendarDate.getMonth() &&
      d.getDate() === day
    );
  };

  return (
    <div className={`relative inline-block ${className} w-full`} ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowCalendar(true)}
        placeholder={placeholder}
        className="border border-gray-500 rounded-xl p-2 w-full h-12 focus:outline-none focus:border-blue-600"
        maxLength={10}
      />

      {showCalendar && (
        <div className="absolute z-10 mt-1 bg-darker-light-gray border border-light-gray rounded shadow-lg p-2 w-52 select-none">
          <div className="flex justify-between items-center mb-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="px-2 py-1 hover:bg-gray-200 rounded"
            >
              {"<"}
            </button>
            <div className="font-semibold">
              {calendarDate.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="px-2 py-1 hover:bg-gray-200 rounded"
            >
              {">"}
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-semibold mb-1 text-gray-500">
            {daysOfWeek.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {generateDays().map((day, i) =>
              day === null ? (
                <div key={i} />
              ) : (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${
                    isSelectedDay(day) ? "bg-blue-600 text-white" : "hover:bg-blue-100"
                  }`}
                >
                  {day}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateInput;
