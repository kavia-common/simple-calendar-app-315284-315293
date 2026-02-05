/**
 * Minimal date helpers (no external deps).
 * All dates are treated as local time. Day keys are "YYYY-MM-DD".
 */

const pad2 = (n) => String(n).padStart(2, "0");

/** PUBLIC_INTERFACE */
export function toDayKey(date) {
  /** Convert a Date to an ISO-like local day key (YYYY-MM-DD). */
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
}

/** PUBLIC_INTERFACE */
export function fromDayKey(dayKey) {
  /** Convert "YYYY-MM-DD" to a Date at local midnight. */
  const [y, m, d] = dayKey.split("-").map((v) => Number(v));
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/** PUBLIC_INTERFACE */
export function startOfMonth(date) {
  /** Get Date representing the first day of the month at local midnight. */
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

/** PUBLIC_INTERFACE */
export function endOfMonth(date) {
  /** Get Date representing the last day of the month at local midnight. */
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0, 0);
}

/** PUBLIC_INTERFACE */
export function addMonths(date, delta) {
  /** Returns a new Date offset by delta months. */
  const d = new Date(date);
  d.setMonth(d.getMonth() + delta);
  return d;
}

/** PUBLIC_INTERFACE */
export function isSameDay(a, b) {
  /** True when two Dates fall on the same local calendar day. */
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** PUBLIC_INTERFACE */
export function isToday(date) {
  /** True if date is today (local). */
  return isSameDay(date, new Date());
}

/** PUBLIC_INTERFACE */
export function formatMonthYear(date) {
  /** Human readable month label. */
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

/** PUBLIC_INTERFACE */
export function formatShortWeekdayNames() {
  /** Returns weekday labels starting on Sunday. */
  const base = new Date(2024, 0, 7); // a Sunday
  return Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(base);
    d.setDate(base.getDate() + idx);
    return d.toLocaleDateString(undefined, { weekday: "short" });
  });
}

/** PUBLIC_INTERFACE */
export function getMonthGridDays(viewDate, weekStartsOn = 0) {
  /**
   * Produce an array of 42 Date objects representing a 6-week month grid.
   * weekStartsOn: 0=Sunday, 1=Monday
   */
  const first = startOfMonth(viewDate);
  const firstDayOfWeek = first.getDay(); // 0..6, Sunday-based
  const offset = (firstDayOfWeek - weekStartsOn + 7) % 7;

  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - offset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

/** PUBLIC_INTERFACE */
export function isInSameMonth(date, monthRef) {
  /** Whether `date` is within the same month/year as `monthRef`. */
  return (
    date.getFullYear() === monthRef.getFullYear() &&
    date.getMonth() === monthRef.getMonth()
  );
}

/** PUBLIC_INTERFACE */
export function compareEventDateTime(a, b) {
  /**
   * Sort events by date then time (if present).
   * Events: { date: 'YYYY-MM-DD', time?: 'HH:MM' }
   */
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  const at = a.time || "";
  const bt = b.time || "";
  if (at === bt) return 0;
  return at < bt ? -1 : 1;
}

/** PUBLIC_INTERFACE */
export function formatEventWhen(event) {
  /** Friendly label for an event's date/time. */
  const d = fromDayKey(event.date);
  const dateLabel = d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return event.time ? `${dateLabel} • ${event.time}` : dateLabel;
}
