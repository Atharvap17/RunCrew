import { useEffect, useState } from "react";
import { HiLocationMarker, HiClock } from "react-icons/hi";
import { getEvents } from "../../services/eventService";
import Button from "../Common/Button";
import ReadMore from "../Common/ReadMore";
import ScrollReveal from "../Common/ScrollReveal";

function formatEventDate(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
}

export default function FeaturedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEvents({ featured: "true" })
      .then(({ data }) => setEvents(data.slice(0, 3)))
      .catch(() => getEvents().then(({ data }) => setEvents(data.slice(0, 3))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="events" className="section-block bg-[#0a0a0a]">
      <div className="section-inner">
        <header className="section-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-16">
          <div className="max-w-2xl">
            <p className="section-label">Upcoming Races</p>
            <h2 className="section-title">
              Miles marked by events,
              <span className="block mt-2">triumph defined</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-sm text-base leading-[1.8] lg:pb-2">
            Register for world-class marathon events across India.
            Every race is a new chapter in your running journey.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="loading-spinner" />
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__title">No featured races yet</p>
            <p className="empty-state__text">New events are added regularly — browse the full calendar for open registrations.</p>
            <Button to="/events" variant="outline-brand" size="sm" showArrow={false}>
              View all events
            </Button>
          </div>
        ) : (
        <div className="grid gap-10 lg:gap-12 lg:grid-cols-3">
          {events.map((event, index) => {
            const date = formatEventDate(event.date);
            const defaultImg = "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900";
            return (
              <ScrollReveal key={event.id} animation="bubble" delay={(index % 3) * 120}>
                <article className="card-lift group bg-[#141414] border border-white/10 overflow-hidden flex flex-col h-full">
                  <div className="relative h-56 lg:h-60 overflow-hidden shrink-0 bg-zinc-900">
                    <img
                      src={event.image_url || defaultImg}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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

                    <div className="absolute top-4 right-4 z-10">
                      <span className="featured-badge">
                        <span className="featured-badge__dot" />
                        Featured
                      </span>
                    </div>

                    <div className="absolute bottom-5 right-5 bg-black/75 backdrop-blur-md px-4 py-2 text-white font-display text-2xl rounded-md border border-white/10 shadow-lg z-10">
                      ₹{event.fees}
                    </div>
                  </div>

                  <div className="participant-event-card-body">
                    <div>
                      <span className="text-brand text-xs font-bold tracking-[0.2em] uppercase">
                        {event.distance}
                      </span>
                      <h3 className="font-display text-[1.65rem] text-white mt-3 leading-tight group-hover:text-brand transition-colors">
                        {event.title}
                      </h3>

                      <div className="mt-6 space-y-3 text-gray-300 text-sm leading-relaxed">
                        <p className="flex items-start gap-3">
                          <HiLocationMarker className="text-brand shrink-0 mt-0.5 text-base" />
                          {event.location}
                        </p>
                        <p className="flex items-start gap-3">
                          <HiClock className="text-brand shrink-0 mt-0.5 text-base" />
                          {event.time?.slice(0, 5)} · {date.day} {date.month} {date.year}
                        </p>
                      </div>
                    </div>

                    <div className="participant-event-card-footer">
                      <ReadMore to={`/events/${event.id}`} />
                      <Button to={`/events/${event.id}`} variant="primary" size="sm" showArrow={false}>
                        Book Now
                      </Button>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
        )}

        {!loading && events.length > 0 && (
        <div className="featured-events-cta">
          <Button to="/events" variant="outline-brand" size="lg">
            View All Events
          </Button>
        </div>
        )}
      </div>
    </section>
  );
}
