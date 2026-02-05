/**
 * Local storage utilities (small and resilient).
 */

const STORAGE_KEY = "simple_calendar_events_v1";

/** PUBLIC_INTERFACE */
export function loadEvents() {
  /** Load events array from localStorage. Returns [] if missing/corrupt. */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    // If storage is blocked/corrupt, fail gracefully to in-memory.
    return [];
  }
}

/** PUBLIC_INTERFACE */
export function saveEvents(events) {
  /** Persist events array to localStorage. */
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    // Ignore write failures (private mode, quota, etc.)
  }
}
