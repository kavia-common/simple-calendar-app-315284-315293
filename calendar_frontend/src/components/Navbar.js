import React from "react";

/** PUBLIC_INTERFACE */
export default function Navbar({ onAddEvent }) {
  /** Top navigation bar with app title and primary CTA. */
  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__brand" aria-label="App title">
          <span className="nav__logoMark" aria-hidden="true" />
          <span className="nav__title">Simple Calendar</span>
        </div>

        <div className="nav__actions">
          <button className="btn btn--primary" type="button" onClick={onAddEvent}>
            Add Event
          </button>
        </div>
      </div>
    </header>
  );
}
