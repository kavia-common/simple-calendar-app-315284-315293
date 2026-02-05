import React, { useMemo } from "react";
import { compareEventDateTime, formatEventWhen } from "../utils/dateUtils";

/** PUBLIC_INTERFACE */
export default function UpcomingEvents({ events, onAddEvent }) {
  /** Sidebar list of upcoming events (sorted). */
  const upcoming = useMemo(() => {
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;

    return [...events]
      .filter((e) => e.date >= todayKey)
      .sort(compareEventDateTime)
      .slice(0, 8);
  }, [events]);

  return (
    <aside className="card upcoming" aria-label="Upcoming events">
      <div className="upcoming__header">
        <h2 className="sectionTitle">Upcoming</h2>
        <button className="btn btn--success" type="button" onClick={onAddEvent}>
          Add
        </button>
      </div>

      {upcoming.length === 0 ? (
        <div className="empty">
          <p className="empty__title">No upcoming events</p>
          <p className="empty__desc">Click “Add” to create your first event.</p>
        </div>
      ) : (
        <ul className="upcoming__list">
          {upcoming.map((ev) => (
            <li key={ev.id} className="upcoming__item">
              <div className="upcoming__meta">{formatEventWhen(ev)}</div>
              <div className="upcoming__title">{ev.title}</div>
              {ev.notes ? <div className="upcoming__notes">{ev.notes}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
