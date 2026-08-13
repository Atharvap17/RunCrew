import { useEffect, useState } from "react";
import { getEvents } from "../../services/eventService";
import Button from "../Common/Button";

export default function EnduranceSection() {
  const [eventCount, setEventCount] = useState(0);
  useEffect(() => { getEvents().then(({ data }) => setEventCount(data.length)).catch(() => {}); }, []);
  return <section className="participant-endurance"><div className="participant-endurance__image" /><div className="participant-endurance__overlay" /><div className="section-inner relative z-10"><div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]"><div className="max-w-xl"><p className="section-label">Find your next challenge</p><h2 className="section-title">Run the distance. <span className="text-brand">Own the story.</span></h2><p className="mt-7 text-gray-300">From your first 10K to your next personal best, find routes, people, and events that make every training day count.</p><Button to="/events" variant="primary" size="lg" className="mt-10">Explore events</Button></div><div className="participant-metrics"><div><strong>50K+</strong><span>Runners connected</span></div><div><strong>{eventCount || "100"}+</strong><span>Events hosted</span></div><div className="participant-metrics__wide"><strong>One community</strong><span>Made for every pace, every goal, and every finish line.</span></div></div></div></div></section>;
}
