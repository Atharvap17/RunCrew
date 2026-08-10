import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaChevronRight,
  FaSearch,
  FaBan,
} from "react-icons/fa";
import {
  getRegistrations,
  updateRegistration,
} from "../../services/registrationService";

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await getRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error("Failed to load registrations:", err);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id, status) => {
    if (!confirm(`Change registration status to ${status}?`)) return;
    await updateRegistration(id, { status });
    load();
  };

  const filtered = registrations.filter(
    (r) =>
      r.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.event_title?.toLowerCase().includes(search.toLowerCase()) ||
      r.bib_number?.toString().includes(search)
  );

  return (
    <div>
      {/* Volt Header */}
      <div className="volt-page-header">
        <div>
          <div className="volt-breadcrumb">
            <Link to="/admin">Admin</Link>
            <FaChevronRight className="text-[10px]" />
            <span>Registrations</span>
          </div>
          <div className="volt-page-title">
            <h1>Event Registrations</h1>
            <p className="volt-page-subtitle">
              Monitor bib assignments, verify payment receipts, and update entry status.
            </p>
          </div>
        </div>

        <div className="volt-action-btns">
          <div className="volt-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search user, event or bib..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Volt Panel Table */}
      <div className="volt-panel">
        <div className="volt-panel-header">
          <div className="volt-panel-title">
            <FaClipboardList />
            <span>Registrations Log ({filtered.length})</span>
          </div>
        </div>

        <div className="volt-table-container">
          {loading ? (
            <div className="volt-empty">Loading registrations...</div>
          ) : (
            <table className="volt-table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Event</th>
                  <th>Bib #</th>
                  <th>Payment</th>
                  <th>Entry Status</th>
                  <th>Registered On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const initial = r.user_name
                    ? r.user_name.charAt(0).toUpperCase()
                    : "U";
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="volt-user-cell">
                          <div className="volt-avatar">{initial}</div>
                          <div>
                            <div className="volt-user-cell-name">{r.user_name}</div>
                            <div className="volt-user-cell-sub">Reg ID: #{r.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white font-medium">{r.event_title}</span>
                      </td>
                      <td>
                        <span className="volt-badge volt-badge--brand font-mono font-bold">
                          #{r.bib_number || "TBD"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`volt-badge ${
                            r.payment_status === "completed"
                              ? "volt-badge--success"
                              : "volt-badge--pending"
                          }`}
                        >
                          {r.payment_status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`volt-badge ${
                            r.status === "confirmed"
                              ? "volt-badge--success"
                              : r.status === "cancelled"
                              ? "volt-badge--danger"
                              : "volt-badge--pending"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <span className="text-gray-400 text-xs">
                          {new Date(r.registered_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        {r.status !== "cancelled" ? (
                          <button
                            onClick={() => updateStatus(r.id, "cancelled")}
                            className="volt-btn volt-btn--danger volt-btn--sm"
                          >
                            <FaBan /> Cancel Entry
                          </button>
                        ) : (
                          <span className="text-gray-500 text-xs">Cancelled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="volt-empty">No registrations found.</div>
          )}
        </div>
      </div>
    </div>
  );
}