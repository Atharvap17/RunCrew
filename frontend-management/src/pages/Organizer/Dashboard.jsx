import { useEffect, useState } from "react";
import { getEvents } from "../../services/eventService";
import { getRegistrations } from "../../services/registrationService";
import { getPayments } from "../../services/paymentService";
import { getResults } from "../../services/resultService";
import Button from "../../components/Common/Button";
import { FaArrowRight, FaCalendarAlt, FaCheck, FaClipboardList, FaCreditCard, FaPlus, FaTrophy } from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState({ events: 0, registrations: 0, payments: 0, results: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { loadStats(); }, []);
  async function loadStats() {
    setLoading(true); setError("");
    try {
      const [eventsRes, registrationsRes, paymentsRes, resultsRes] = await Promise.all([getEvents({ scope: "mine" }), getRegistrations(), getPayments(), getResults()]);
      setStats({ events: eventsRes.data.length, registrations: registrationsRes.data.length, payments: paymentsRes.data.length, results: resultsRes.data.length });
    } catch { setError("Failed to load dashboard stats."); } finally { setLoading(false); }
  }

  const cards = [
    { title: "My events", value: stats.events, link: "/organizer/events", icon: FaCalendarAlt, helper: "Marathons you manage" },
    { title: "Registrations", value: stats.registrations, link: "/organizer/registrations", icon: FaClipboardList, helper: "Runner entries received" },
    { title: "Payments", value: stats.payments, link: "/organizer/payments", icon: FaCreditCard, helper: "Transactions to review" },
    { title: "Results", value: stats.results, link: "/organizer/results", icon: FaTrophy, helper: "Finish times published" },
  ];
  const checklist = [
    { label: "Create your marathon", text: "Add the race date, route details, capacity, and entry fee.", to: "/organizer/events", done: stats.events > 0 },
    { label: "Review runner entries", text: "Confirm registrations as payments are received.", to: "/organizer/registrations", done: stats.registrations > 0 },
    { label: "Publish race results", text: "Add finish times and rankings when the event is complete.", to: "/organizer/results", done: stats.results > 0 },
  ];

  return <div className="organizer-page">
    <header className="organizer-dashboard-hero">
      <div><p className="section-label">Organizer workspace</p><h1 className="organizer-page__title">Your race command centre.</h1><p className="organizer-page__subtitle">Everything needed to plan your events, support runners, and deliver a great race day.</p></div>
      <Button to="/organizer/events" variant="primary" showArrow={false}><FaPlus /> Create marathon</Button>
    </header>

    {error && <div className="alert alert-error mb-6">{error}</div>}

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Organizer overview">
      {cards.map(({ title, value, link, icon: Icon, helper }) => <div key={title} className="organizer-stat-card">
        <div className="organizer-stat-card__top"><span>{title}</span><Icon /></div>
        <p className="organizer-stat-card__number">{loading ? "—" : value}</p>
        <p className="organizer-stat-card__helper">{helper}</p>
        <a className="organizer-inline-link" href={link}>Open <FaArrowRight /></a>
      </div>)}
    </section>

    <section className="mt-7 grid gap-6 lg:grid-cols-[1.65fr_1fr]">
      <div className="organizer-card organizer-checklist">
        <div className="organizer-panel-heading"><div><p className="organizer-eyebrow">Get started</p><h2>Keep your race on track</h2></div><span className="organizer-progress">{checklist.filter((item) => item.done).length}/3 complete</span></div>
        <div className="organizer-checklist__items">{checklist.map((item, index) => <div className="organizer-checklist__item" key={item.label}>
          <div className={`organizer-checklist__marker ${item.done ? "is-done" : ""}`}>{item.done ? <FaCheck /> : index + 1}</div>
          <div className="min-w-0"><h3>{item.label}</h3><p>{item.text}</p></div>
          <a href={item.to} className="organizer-task-link">{item.done ? "Review" : "Start"}<FaArrowRight /></a>
        </div>)}</div>
      </div>

      <aside className="organizer-card organizer-activity">
        <p className="organizer-eyebrow">Activity</p><h2>What needs attention</h2>
        <div className="organizer-activity__body">
          {loading ? <p>Updating your workspace…</p> : stats.events === 0 ? <><span className="organizer-activity__icon"><FaCalendarAlt /></span><h3>Start with your first marathon</h3><p>Create an event to begin collecting registrations and payments.</p><Button to="/organizer/events" variant="outline-brand" size="sm" showArrow={false}>Create event</Button></> : <><span className="organizer-activity__icon"><FaClipboardList /></span><h3>Your workspace is live</h3><p>Review registrations regularly and publish results after each race.</p><Button to="/organizer/registrations" variant="outline-brand" size="sm" showArrow={false}>Review registrations</Button></>}
        </div>
      </aside>
    </section>
  </div>;
}
