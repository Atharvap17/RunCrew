import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService";
import { FaUsers, FaCalendarAlt, FaClipboardList, FaRupeeSign } from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(({ data }) => setStats(data));
  }, []);

  if (!stats) {
    return (
      <div className="organizer-page">
        <div className="skeleton h-40 w-full" />
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats.total_users, icon: FaUsers },
    { label: "Total Events", value: stats.total_events, icon: FaCalendarAlt },
    { label: "Registrations", value: stats.total_registrations, icon: FaClipboardList },
    { label: "Revenue", value: `₹${stats.total_revenue}`, icon: FaRupeeSign },
  ];

  return (
    <div className="organizer-page">
      <header className="organizer-page__header">
        <div>
          <p className="section-label">Admin</p>
          <h1 className="organizer-page__title">Dashboard overview</h1>
          <p className="organizer-page__subtitle">Platform activity, revenue, and recent registrations at a glance.</p>
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {cards.map((card) => (
          <article key={card.label} className="organizer-stat-card">
            <div className="organizer-stat-card__top">
              <span>{card.label}</span>
              <card.icon />
            </div>
            <p className="organizer-stat-card__number">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="organizer-card organizer-checklist">
          <div className="organizer-panel-heading">
            <div>
              <p className="organizer-eyebrow">Snapshot</p>
              <h2>Quick stats</h2>
            </div>
          </div>
          <div className="space-y-3 text-sm pt-2">
            {[
              ["Upcoming events", stats.upcoming_events],
              ["Completed payments", stats.total_payments],
              ["Race results", stats.total_results],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-white/5 pb-3 last:border-0">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="organizer-card organizer-activity">
          <div className="organizer-panel-heading">
            <div>
              <p className="organizer-eyebrow">Activity</p>
              <h2>Recent registrations</h2>
            </div>
          </div>
          <div className="organizer-activity__body w-full items-stretch">
            {stats.recent_registrations?.length === 0 ? (
              <p className="text-gray-400 text-sm">No registrations yet.</p>
            ) : (
              <div className="w-full space-y-3">
                {stats.recent_registrations?.map((r) => (
                  <div key={r.id} className="flex justify-between gap-4 border-b border-white/5 pb-3 text-sm last:border-0">
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{r.user}</p>
                      <p className="text-gray-400 text-xs truncate">{r.event}</p>
                    </div>
                    <span className={`organizer-badge shrink-0 ${r.payment_status === "completed" ? "organizer-badge--green" : "organizer-badge--yellow"}`}>
                      {r.payment_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}