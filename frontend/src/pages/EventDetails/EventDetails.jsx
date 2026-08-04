import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { HiLocationMarker } from "react-icons/hi";
import { getEvent } from "../../services/eventService";
import RouteMap from "../../components/Map/RouteMap";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Common/Button";
import Card from "../../components/Common/Card";

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
          <span className="organizer-badge organizer-badge--brand capitalize">{event.status}</span>
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
          <Card className="panel--lg participant-detail-sidebar">
            <h3 className="font-display text-xl text-white mb-6">Event Details</h3>
            <div className="space-y-4 text-sm">
              {[
                ["Date", event.date],
                ["Time", event.time?.slice(0, 5)],
                ["Distance", event.distance],
                ["Registration Fee", `₹${event.fees}`],
                ["Spots Left", event.max_participants - (event.registered_count || 0)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-400 font-medium">{label}</span>
                  <span className={label === "Distance" ? "text-brand font-semibold text-right" : label === "Registration Fee" ? "text-white font-bold text-right" : "text-white text-right"}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {event.status === "upcoming" && (
              <Button
                onClick={handleRegister}
                variant="primary"
                size="lg"
                className="w-full justify-center mt-8"
                showArrow={false}
              >
                Register Now
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
