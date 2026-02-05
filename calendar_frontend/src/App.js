import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import CalendarGrid from "./components/CalendarGrid";
import EventFormModal from "./components/EventFormModal";
import UpcomingEvents from "./components/UpcomingEvents";
import { loadEvents, saveEvents } from "./utils/storage";

/**
 * Event shape:
 * { id: string, title: string, date: 'YYYY-MM-DD', time?: 'HH:MM', notes?: string, createdAt: number }
 */

// PUBLIC_INTERFACE
export default function App() {
  /** Calendar application root. */
  const [viewDate, setViewDate] = useState(() => new Date());
  const [events, setEvents] = useState(() => loadEvents());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefillDate, setPrefillDate] = useState("");

  // Persist events to localStorage
  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      const arr = map.get(ev.date) || [];
      arr.push(ev);
      map.set(ev.date, arr);
    }
    // Keep each day bucket sorted (date same, sort by time)
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => {
        const at = a.time || "";
        const bt = b.time || "";
        if (at === bt) return 0;
        return at < bt ? -1 : 1;
      });
      map.set(k, arr);
    }
    return map;
  }, [events]);

  const openAddEvent = (dateKey) => {
    setPrefillDate(dateKey || "");
    setIsModalOpen(true);
  };

  const closeAddEvent = () => setIsModalOpen(false);

  const handleSelectDay = (dayKey) => {
    // Selecting a day opens modal with date prefilled (simple and fast UX).
    openAddEvent(dayKey);
  };

  const handleCreateEvent = (data) => {
    const newEvent = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      title: data.title,
      date: data.date,
      time: data.time,
      notes: data.notes,
      createdAt: Date.now(),
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  return (
    <div className="appShell">
      <Navbar onAddEvent={() => openAddEvent("")} />

      <main className="container">
        <div className="layout">
          <div className="layout__main">
            <CalendarGrid
              viewDate={viewDate}
              onChangeViewDate={setViewDate}
              eventsByDay={eventsByDay}
              onSelectDay={handleSelectDay}
            />
          </div>

          <div className="layout__side">
            <UpcomingEvents events={events} onAddEvent={() => openAddEvent("")} />
          </div>
        </div>
      </main>

      <EventFormModal
        isOpen={isModalOpen}
        initialDate={prefillDate}
        onClose={closeAddEvent}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
}
