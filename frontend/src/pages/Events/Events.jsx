import { useEffect, useState } from "react";
import { HiLocationMarker, HiClock } from "react-icons/hi";
import { HiCheckCircle } from "react-icons/hi";
import { getEvents } from "../../services/eventService";
import Button from "../../components/Common/Button";
import ReadMore from "../../components/Common/ReadMore";
import ScrollReveal from "../../components/Common/ScrollReveal";

import { isEventPassed } from "../../utils/dateUtils";

function formatEventDate(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadEvents();
  }, [filter]);

  async function loadEvents() {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const { data } = await getEvents(params);
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filters = ["all", "upcoming", "ongoing", "completed"];

  return (
    <div className="participant-page">
      <div className="participant-page-header">
        <p className="section-label">Marathon Events</p>
        <h1>Find your next start line.</h1>
        <p>
          Browse and register for upcoming marathon events across India
        </p>
      </div>

      <div className="participant-filter-bar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`participant-filter ${filter === f ? "is-active" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="loading-spinner" />
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">No events found</p>
          <p className="empty-state__text">Try another filter or check back soon for new races.</p>
        </div>
      ) : (
        <div className="participant-event-grid">
          {events.map((event, index) => {
            const date = formatEventDate(event.date);
            const passed = isEventPassed(event);
            const defaultImg = "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900";
            return (
              <ScrollReveal key={event.id} animation="bubble" delay={(index % 3) * 120}>
                <article className="participant-event-card group flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden bg-zinc-900 shrink-0">
                    <img
                      src={event.image_url || defaultImg}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultImg;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                    <div className="event-date-badge">
                      <div className="day">{date.day}</div>
                      <div className="month">{date.month}, {date.year}</div>
                    </div>
                    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1.5">
                      {event.is_featured && (
                        <span className="featured-badge">
                          <span className="featured-badge__dot" />
                          Featured
                        </span>
                      )}
                      {passed && (

                        <span className="inline-flex min-w-[100px] items-center justify-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300 shadow-lg shadow-emerald-950/20 backdrop-blur-md">
                          <HiCheckCircle className="h-3.5 w-3.5" />
                          Passed
                        </span>

                      )}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1.5 text-white font-display text-xl rounded-md border border-white/10 shadow-lg z-10">
                      ₹{event.fees}
                    </div>
                  </div>

                  <div className="participant-event-card-body">
                    <div>
                      <span className="text-brand text-xs font-bold tracking-widest uppercase">{event.distance}</span>
                      <h3 className="font-display text-xl text-white mt-1 group-hover:text-brand transition-colors leading-snug">
                        {event.title}
                      </h3>
                      <div className="mt-3 space-y-1.5 text-gray-300 text-sm">
                        <p className="flex items-center gap-2"><HiLocationMarker className="text-brand shrink-0 text-base" />{event.location}</p>
                        <p className="flex items-center gap-2"><HiClock className="text-brand shrink-0 text-base" />{event.time?.slice(0, 5)}</p>
                      </div>
                      <p className="text-gray-400 text-xs mt-3 font-medium">
                        {event.registered_count || 0} / {event.max_participants} registered
                      </p>
                    </div>
                    <div className="participant-event-card-footer">
                      <ReadMore to={`/events/${event.id}`} />
                      {passed ? (
                        <Button to={`/events/${event.id}`} variant="secondary" size="sm" showArrow={false} className="opacity-80">
                          View Event
                        </Button>
                      ) : (
                        <Button to={`/events/${event.id}`} variant="primary" size="sm" showArrow={false}>
                          Book Now
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
