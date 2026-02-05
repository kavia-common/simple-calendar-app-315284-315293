import React from "react";
import { isToday } from "../utils/dateUtils";

/** PUBLIC_INTERFACE */
export default function DayCell({ date, dayKey, events, isOutsideMonth, onSelectDay }) {
  /** Individual day cell in the calendar grid. */
  const today = isToday(date);

  const handleKeyDown = (e) => {
    // Enter/Space triggers selection.
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectDay(dayKey);
    }
  };

  return (
    <div
      className={[
        "day",
        isOutsideMonth ? "day--outside" : "",
        today ? "day--today" : "",
      ].join(" ")}
      role="gridcell"
    >
      <button
        type="button"
        className="day__button"
        onClick={() => onSelectDay(dayKey)}
        onKeyDown={handleKeyDown}
        aria-label={`Select ${date.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
      >
        <div className="day__top">
          <span className="day__num">{date.getDate()}</span>
          {events.length > 0 ? (
            <span className="day__count" aria-label={`${events.length} events`}>
              {events.length}
            </span>
          ) : null}
        </div>

        <div className="day__events" aria-hidden="true">
          {events.slice(0, 2).map((ev) => (
            <div key={ev.id} className="day__pill">
              {ev.title}
            </div>
          ))}
          {events.length > 2 ? <div className="day__more">+{events.length - 2} more</div> : null}
        </div>
      </button>
    </div>
  );
}
