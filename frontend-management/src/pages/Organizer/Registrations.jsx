import { useEffect, useState } from "react";
import { getRegistrations, updateRegistration } from "../../services/registrationService";
import Button from "../../components/Common/Button";

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  async function loadRegistrations() {
    setLoading(true);
    setError("");

    try {
      const { data } = await getRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError("Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id, status) {
    setSavingId(id);
    try {
      await updateRegistration(id, { status });
      await loadRegistrations();
    } catch (err) {
      setError("Unable to update registration status.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="organizer-page">
        <div className="organizer-page__header">
          <div>
          <p className="section-label">Organizer</p>
          <h1 className="organizer-page__title">Registrations</h1>
          <p className="organizer-page__subtitle">Review runners registered for your marathons and update their registration status.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="organizer-table-panel">
          <table className="organizer-data-table">
            <thead>
              <tr>
                <th className="px-4 py-4">Runner</th>
                <th className="px-4 py-4">Event</th>
                <th className="px-4 py-4">Bib</th>
                <th className="px-4 py-4">Payment</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Registered</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">Loading registrations...</td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">No registrations found.</td>
                </tr>
              ) : (
                registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="px-4 py-4 text-white">{registration.user_name}</td>
                    <td className="px-4 py-4 text-gray-300">{registration.event_title}</td>
                    <td className="px-4 py-4 text-brand">{registration.bib_number || "—"}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                        registration.payment_status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {registration.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-4 capitalize text-gray-300">{registration.status}</td>
                    <td className="px-4 py-4 text-gray-400">{new Date(registration.registered_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4"><div className="flex flex-wrap gap-2">
                      {registration.status !== "confirmed" && (
                        <Button
                          onClick={() => handleStatusUpdate(registration.id, "confirmed")}
                          variant="primary"
                          size="sm"
                          showArrow={false}
                          disabled={savingId === registration.id}
                        >
                          {savingId === registration.id ? "Saving..." : "Confirm"}
                        </Button>
                      )}
                      {registration.status !== "cancelled" && (
                        <Button
                          onClick={() => handleStatusUpdate(registration.id, "cancelled")}
                          variant="outline"
                          size="sm"
                          showArrow={false}
                          disabled={savingId === registration.id}
                        >
                          Cancel
                        </Button>
                      )}
                    </div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}
