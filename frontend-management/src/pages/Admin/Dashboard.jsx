import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaDownload,
  FaChevronRight,
  FaChartLine,
  FaCheckCircle,
  FaTrophy,
} from "react-icons/fa";

import { getDashboardStats } from "../../services/adminService";
import RevenueChart from "../../components/Admin/RevenueChart";
import RegistrationChart from "../../components/Admin/RegistrationChart";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenueFilter, setRevenueFilter] = useState("1M");
  const [regFilter, setRegFilter] = useState("1M");

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data))
      .catch(console.error);
  }, []);

  if (!stats) {
    return (
      <div className="volt-loading">
        <div className="volt-spinner" />
        <span>Loading Volt Dashboard statistics...</span>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Members",
      value: stats.total_users?.toLocaleString() || 0,
      trend: "+14.2%",
      isUp: true,
      subtitle: "Active platform users",
      icon: <FaUsers />,
    },
    {
      title: "Marathon Events",
      value: stats.total_events || 0,
      trend: "+8.5%",
      isUp: true,
      subtitle: `${stats.upcoming_events || 0} Upcoming events`,
      icon: <FaCalendarAlt />,
    },
    {
      title: "Total Registrations",
      value: stats.total_registrations || 0,
      trend: "+24.0%",
      isUp: true,
      subtitle: `${stats.total_payments || 0} Paid entries`,
      icon: <FaClipboardList />,
    },
    {
      title: "Platform Revenue",
      value: `₹${(stats.total_revenue || 0).toLocaleString()}`,
      trend: "-2.1%",
      isUp: false,
      subtitle: "Razorpay transactions",
      icon: <FaRupeeSign />,
    },
  ];

  return (
    <div>
      {/* Volt Page Header */}
      <div className="volt-page-header">
        <div>
          <div className="volt-breadcrumb">
            <Link to="/admin">Admin</Link>
            <FaChevronRight className="text-[10px]" />
            <span>Dashboard</span>
          </div>
          <div className="volt-page-title">
            <h1>Overview & Analytics</h1>
            <p className="volt-page-subtitle">
              Real-time monitoring for users, marathon events, registrations, and revenue streams.
            </p>
          </div>
        </div>

        <div className="volt-action-btns">
          <button className="volt-btn volt-btn--secondary">
            <FaDownload /> Export Report
          </button>
          <Link to="/admin/events" className="volt-btn volt-btn--primary">
            <FaPlus /> Add New Event
          </Link>
        </div>
      </div>

      {/* Volt Stat Metric Grid */}
      <div className="volt-stat-grid">
        {cards.map((card) => (
          <div key={card.title} className="volt-stat-card">
            <div className="volt-stat-header">
              <div className="volt-stat-icon-box">{card.icon}</div>
              <div className={`volt-trend-badge ${card.isUp ? "up" : "down"}`}>
                {card.isUp ? <FaArrowUp /> : <FaArrowDown />}
                <span>{card.trend}</span>
              </div>
            </div>

            <div className="volt-stat-label">{card.title}</div>
            <div className="volt-stat-value">{card.value}</div>
            <div className="volt-stat-footer">
              <FaChartLine className="text-gray-500" />
              <span>{card.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Volt Charts Grid */}
      <div className="volt-grid-2">
        {/* Revenue Chart Panel */}
        <div className="volt-panel">
          <div className="volt-panel-header">
            <div className="volt-panel-title">
              <FaRupeeSign />
              <span>Revenue Overview</span>
            </div>
            <div className="volt-panel-actions">
              {["1W", "1M", "1Y"].map((tf) => (
                <button
                  key={tf}
                  className={`volt-filter-pill ${revenueFilter === tf ? "active" : ""}`}
                  onClick={() => setRevenueFilter(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Registrations Chart Panel */}
        <div className="volt-panel">
          <div className="volt-panel-header">
            <div className="volt-panel-title">
              <FaClipboardList />
              <span>Monthly Registrations</span>
            </div>
            <div className="volt-panel-actions">
              {["1M", "3M", "6M"].map((tf) => (
                <button
                  key={tf}
                  className={`volt-filter-pill ${regFilter === tf ? "active" : ""}`}
                  onClick={() => setRegFilter(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <RegistrationChart />
        </div>
      </div>

      {/* Volt Main & Side Section */}
      <div className="volt-grid-main-side">
        {/* Recent Registrations Table Panel */}
        <div className="volt-panel">
          <div className="volt-panel-header">
            <div className="volt-panel-title">
              <FaCheckCircle />
              <span>Recent Registrations</span>
            </div>
            <Link to="/admin/registrations" className="volt-btn volt-btn--secondary volt-btn--sm">
              View All
            </Link>
          </div>

          <div className="volt-table-container">
            <table className="volt-table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Event</th>
                  <th>Entry Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_registrations?.map((r) => {
                  const initial = r.user ? r.user.charAt(0).toUpperCase() : "U";
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="volt-user-cell">
                          <div className="volt-avatar">{initial}</div>
                          <div>
                            <div className="volt-user-cell-name">{r.user}</div>
                            <div className="volt-user-cell-sub">Bib assigned</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white font-medium">{r.event}</span>
                      </td>
                      <td>
                        <span className={`volt-badge volt-badge--${r.status}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <span className={`volt-badge volt-badge--${r.payment_status === "completed" ? "success" : "pending"}`}>
                          {r.payment_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!stats.recent_registrations || stats.recent_registrations.length === 0) && (
              <div className="volt-empty">No recent registrations logged yet.</div>
            )}
          </div>
        </div>

        {/* Quick Platform Metrics & Performance Panel */}
        <div className="volt-panel">
          <div className="volt-panel-header">
            <div className="volt-panel-title">
              <FaTrophy />
              <span>Quick Performance</span>
            </div>
          </div>

          {/* Goal Progress Bar */}
          <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-gray-400 font-medium">Monthly Revenue Target</span>
              <span className="text-[#f15a24] font-bold">78%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#f15a24] to-[#ff7b47] w-[78%]" />
            </div>
          </div>

          <div className="volt-quick-row">
            <div className="volt-quick-label">Total Users</div>
            <div className="volt-quick-value">{stats.total_users}</div>
          </div>

          <div className="volt-quick-row">
            <div className="volt-quick-label">Total Events</div>
            <div className="volt-quick-value">{stats.total_events}</div>
          </div>

          <div className="volt-quick-row">
            <div className="volt-quick-label">Upcoming Races</div>
            <div className="volt-quick-value text-amber-400">{stats.upcoming_events}</div>
          </div>

          <div className="volt-quick-row">
            <div className="volt-quick-label">Total Transactions</div>
            <div className="volt-quick-value">{stats.total_payments}</div>
          </div>

          <div className="volt-quick-row">
            <div className="volt-quick-label">Race Results Published</div>
            <div className="volt-quick-value text-emerald-400">{stats.total_results}</div>
          </div>
        </div>
      </div>
    </div>
  );
}