import { useEffect, useState } from "react";
import { getRegistrations, updateRegistration } from "../../services/registrationService";

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await getRegistrations();
    setRegistrations(data);
  }

  const updateStatus = async (id, status) => {
    await updateRegistration(id, { status });
    load();
  };

  return (
    <div className="organizer-page">
      <header className="organizer-page__header">
        <div>
          <p className="section-label">Admin</p>
          <h1 className="organizer-page__title">Registrations</h1>
          <p className="organizer-page__subtitle">Track bib assignments, payment status, and entry state.</p>
        </div>
      </header>

      <div className="organizer-table-panel">
        <table className="organizer-data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Event</th>
              <th>Bib</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id}>
                <td className="text-white">{r.user_name}</td>
                <td>{r.event_title}</td>
                <td className="text-brand font-semibold">{r.bib_number}</td>
                <td>
                  <span className={`organizer-badge ${r.payment_status === "completed" ? "organizer-badge--green" : "organizer-badge--yellow"}`}>
                    {r.payment_status}
                  </span>
                </td>
                <td className="capitalize">{r.status}</td>
                <td className="text-gray-500">{new Date(r.registered_at).toLocaleDateString()}</td>
                <td>
                  {r.status !== "cancelled" && (
                    <button onClick={() => updateStatus(r.id, "cancelled")} className="text-red-400 hover:text-red-300 text-xs font-semibold uppercase tracking-wide">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {registrations.length === 0 && <p className="organizer-empty">No registrations yet.</p>}
      </div>
    </div>
  );
}
