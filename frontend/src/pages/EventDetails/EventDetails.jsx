import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { HiLocationMarker } from "react-icons/hi";
import { HiLockClosed } from "react-icons/hi";
import { getEvent } from "../../services/eventService";
import RouteMap from "../../components/Map/RouteMap";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Common/Button";
import Card from "../../components/Common/Card";
import { isEventPassed } from "../../utils/dateUtils";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function loadEvent() {
    try {
      const { data } = await getEvent(id);
      setEvent(data);
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }

  const handleRegister = () => {
    if (isEventPassed(event)) {
      alert("Registration closed: This event date has already passed.");
      return;
    }
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/events/${id}/register` } } });
      return;
    }
    navigate(`/events/${id}/register`);
  };

  if (loading) {
    return (
      <div className="loading-center pt-20">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="loading-center flex-col pt-20">
        <h1 className="font-display text-3xl text-white">Event Not Found</h1>
        <Link to="/events" className="read-more mt-6">Back to Events</Link>
      </div>
    );
  }

  const passed = isEventPassed(event);

  return (
    <div className="participant-page">
      <div className="participant-detail-hero panel-clip bg-zinc-900">
        <img
          src={event.image_url || "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200"}
          alt={event.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200";
          }}
        />
        <div className="participant-detail-hero__overlay" />
        <div className="participant-detail-hero__content">
          <span className={`organizer-badge ${passed ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'organizer-badge--brand'} capitalize`}>
            {passed ? "Event Passed" : event.status}
          </span>
          <h1 className="font-display text-3xl md:text-5xl text-white mt-3 leading-tight">{event.title}</h1>
          <p className="text-gray-300 mt-2 flex items-center gap-2 text-sm md:text-base">
            <HiLocationMarker className="text-brand shrink-0" /> {event.location}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 space-y-8">
          <Card className="panel--lg">
            <h2 className="font-display text-2xl text-white mb-4">About This Race</h2>
            <p className="text-gray-300 leading-relaxed">{event.description}</p>
          </Card>

          <Card className="panel--lg">
            <h2 className="font-display text-2xl text-white mb-4">Race Route Map</h2>
            <RouteMap
              coordinates={event.route_coordinates}
              startLat={event.start_latitude}
              startLng={event.start_longitude}
              locationName={event.location}
              title={event.title}
              height="380px"
            />
          </Card>
        </div>

        <div>
          <div className="participant-detail-sidebar">
            <h3 className="font-display text-2xl text-white font-bold mb-6">Event Details</h3>

            <div>
              <div className="event-details-row">
                <span className="text-gray-400 font-medium">Date</span>
                <span className="text-white font-semibold text-right">{event.date}</span>
              </div>

              <div className="event-details-row">
                <span className="text-gray-400 font-medium">Time</span>
                <span className="text-white font-semibold text-right">{event.time ? `${event.time.slice(0, 5)} AM` : "05:00 AM"}</span>
              </div>

              <div className="event-details-row">
                <span className="text-gray-400 font-medium">Distance</span>
                <span className="text-[#f15a24] font-bold text-right tracking-wide">{event.distance}</span>
              </div>

              <div className="event-details-row">
                <span className="text-gray-400 font-medium">Registration Fee</span>
                <span className="text-white font-bold text-right text-base">₹{event.fees}</span>
              </div>

              <div className="event-details-row">
                <span className="text-gray-400 font-medium">Spots Left</span>
                <span className="text-amber-400 font-bold text-right text-base">
                  {event.max_participants - (event.registered_count || 0)}
                </span>
              </div>
            </div>


            {passed ? (
              <div style={{ paddingTop: "24px" }}>
                <div className="rounded-2xl border border-rose-400/20 bg-gradient-to-br from-rose-500/10 via-rose-950/10 to-zinc-950/80 px-5 py-6 text-center shadow-lg shadow-rose-950/10 backdrop-blur-md">
                  <div className="flex items-center justify-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose-400/20 bg-rose-500/10">
                      <HiLockClosed className="h-3.5 w-3.5 text-rose-400" />
                    </span>

                    <span className="font-display text-sm font-bold uppercase tracking-wider text-rose-300">
                      Registration Closed
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    This event date has already passed.
                  </p>
                </div>
              </div>
            ) : event.status === "upcoming" ? (

              <div className="mt-8">
                <Button
                  onClick={handleRegister}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center text-sm font-display font-bold uppercase tracking-wider"
                  showArrow={false}
                >
                  Register Now
                </Button>
              </div>
            ) : (
              // Keep your existing status section here
              <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-800 p-4 text-center">
                <span className="block font-display text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Status: {event.status}
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
