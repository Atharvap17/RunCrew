/**
 * Utility functions for event date and bookability checking.
 */

/**
 * Returns true if an event date is in the past (before today 00:00:00).
 */
export function isEventPassed(event) {
  if (!event || !event.date) return false;
  if (typeof event.is_past === "boolean") return event.is_past;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateStr = String(event.date).slice(0, 10);
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return false;

    const raceDate = new Date(year, month - 1, day);
    raceDate.setHours(0, 0, 0, 0);

    return raceDate < today;
  } catch {
    return false;
  }
}

/**
 * Returns true if an event can be booked by a user.
 */
export function isEventBookable(event) {
  if (!event) return false;
  if (isEventPassed(event)) return false;
  if (event.status && event.status !== "upcoming") return false;
  if (event.max_participants && (event.registered_count || 0) >= event.max_participants) return false;
  return true;
}
