import React, { useEffect, useMemo, useRef, useState } from "react";

const FOCUSABLE_SELECTOR =
  'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

/** PUBLIC_INTERFACE */
export default function EventFormModal({ isOpen, initialDate, onClose, onCreateEvent }) {
  /** Modal dialog for creating a new event. */
  const dialogRef = useRef(null);
  const titleRef = useRef(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const modalTitleId = useMemo(() => "add-event-title", []);
  const modalDescId = useMemo(() => "add-event-desc", []);

  useEffect(() => {
    if (!isOpen) return;
    setTitle("");
    setDate(initialDate || "");
    setTime("");
    setNotes("");
    setError("");
  }, [isOpen, initialDate]);

  useEffect(() => {
    if (!isOpen) return;

    // Focus title input on open.
    const t = window.setTimeout(() => titleRef.current?.focus(), 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        // Simple focus trap.
        const root = dialogRef.current;
        if (!root) return;
        const focusables = Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
          (el) => !el.hasAttribute("disabled")
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmed = title.trim();
    if (!trimmed) {
      setError("Please enter a title.");
      titleRef.current?.focus();
      return;
    }
    if (!date) {
      setError("Please choose a date.");
      return;
    }

    onCreateEvent({
      title: trimmed,
      date,
      time: time || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="modalOverlay" role="presentation" onMouseDown={(e) => {
      // Click outside closes, but avoid closing when clicking inside.
      if (e.target === e.currentTarget) onClose();
    }}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        aria-describedby={modalDescId}
        ref={dialogRef}
      >
        <div className="modal__header">
          <div>
            <h2 className="modal__title" id={modalTitleId}>
              Add event
            </h2>
            <p className="modal__desc" id={modalDescId}>
              Create a new event. Press Escape to close.
            </p>
          </div>
          <button type="button" className="btn btn--ghost" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form__field">
            <label className="form__label" htmlFor="event-title">
              Title
            </label>
            <input
              id="event-title"
              ref={titleRef}
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team sync"
              required
            />
          </div>

          <div className="form__row">
            <div className="form__field">
              <label className="form__label" htmlFor="event-date">
                Date
              </label>
              <input
                id="event-date"
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="event-time">
                Time <span className="form__optional">(optional)</span>
              </label>
              <input
                id="event-time"
                className="input"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="event-notes">
              Notes <span className="form__optional">(optional)</span>
            </label>
            <textarea
              id="event-notes"
              className="textarea"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any details…"
            />
          </div>

          {error ? (
            <div className="form__error" role="alert">
              {error}
            </div>
          ) : null}

          <div className="modal__footer">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Save event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
