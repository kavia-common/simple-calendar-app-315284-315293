import React from "react";
import DayCell from "./DayCell";
import {
  addMonths,
  formatMonthYear,
  formatShortWeekdayNames,
  getMonthGridDays,
  isInSameMonth,
} from "../utils/dateUtils";

/** PUBLIC_INTERFACE */
export default function CalendarGrid({
  viewDate,
  onChangeViewDate,
  eventsByDay,
  onSelectDay,
}) {
  /** Month grid with previous/next/today controls. */
  const weekDays = formatShortWeekdayNames();
  const days = getMonthGridDays(viewDate, 0);

  return (
    <section className="card calendar" aria-label="Monthly calendar">
      <div className="calendar__header">
        <div className="calendar__month" aria-live="polite">
          {formatMonthYear(viewDate)}
        </div>

        <div className="calendar__controls">
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => onChangeViewDate(addMonths(viewDate, -1))}
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => onChangeViewDate(new Date())}
            aria-label="Go to current month"
          >
            Today
          </button>
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => onChangeViewDate(addMonths(viewDate, 1))}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="calendar__weekdays" role="row">
        {weekDays.map((wd) => (
          <div key={wd} className="calendar__weekday" role="columnheader">
            {wd}
          </div>
        ))}
      </div>

      <div className="calendar__grid" role="grid" aria-label="Calendar days">
        {days.map((date) => {
          const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
            date.getDate()
          ).padStart(2, "0")}`;
          const events = eventsByDay.get(dayKey) || [];
          const isOutside = !isInSameMonth(date, viewDate);

          return (
            <DayCell
              key={dayKey}
              date={date}
              dayKey={dayKey}
              events={events}
              isOutsideMonth={isOutside}
              onSelectDay={onSelectDay}
            />
          );
        })}
      </div>

      <div className="calendar__hint">
        Tip: Select a day to prefill the event date. Events are stored in your browser.
      </div>
    </section>
  );
}
