import { useEffect, useState } from "react";
import { getResults, createResult, deleteResult } from "../../services/resultService";
import { getRegistrations } from "../../services/registrationService";
import Button from "../../components/Common/Button";

export default function Results() {
  const [results, setResults] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState({ registration: "", finish_time: "01:30:00", rank: "", notes: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [resultsRes, registrationsRes] = await Promise.all([
        getResults(),
        getRegistrations(),
      ]);

      setResults(resultsRes.data);
      setRegistrations(
        registrationsRes.data.filter(
          (reg) => reg.payment_status === "completed" && reg.status === "confirmed"
        )
      );
    } catch (err) {
      setError("Failed to load results or registrations.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createResult({
        registration: form.registration,
        finish_time: form.finish_time,
        rank: Number(form.rank) || null,
        notes: form.notes,
      });
      setShowForm(false);
      setForm({ registration: "", finish_time: "01:30:00", rank: "", notes: "" });
      await loadData();
    } catch (err) {
      setError("Failed to save result.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this result?")) return;
    try {
      await deleteResult(id);
      await loadData();
    } catch (err) {
      setError("Failed to delete result.");
    }
  }

  return (
    <div className="organizer-page">
        <div className="organizer-page__header">
          <div>
          <p className="section-label">Organizer</p>
          <h1 className="organizer-page__title">Results</h1>
          <p className="organizer-page__subtitle">Publish finish times and rank details after your marathon events are complete.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Race Results</h2>
            <p className="text-sm text-gray-400">Add runner finish data or remove incorrect entries.</p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Hide form" : "+ Add Result"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="organizer-card organizer-form mb-8">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="organizer-label">Registration</label>
                <select
                  className="form-select"
                  value={form.registration}
                  onChange={(e) => setForm({ ...form, registration: e.target.value })}
                  required
                >
                  <option value="">Select a registration</option>
                  {registrations.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.user_name} — {reg.event_title} ({reg.bib_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="organizer-label">Finish Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={form.finish_time}
                  onChange={(e) => setForm({ ...form, finish_time: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="organizer-label">Rank</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={form.rank}
                  onChange={(e) => setForm({ ...form, rank: e.target.value })}
                />
              </div>

              <div>
                <label className="organizer-label">Notes</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)} showArrow={false}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={saving} showArrow={false}>
                {saving ? "Saving..." : "Save Result"}
              </Button>
            </div>
          </form>
        )}

        <div className="organizer-table-panel">
          <table className="organizer-data-table">
            <thead>
              <tr>
                <th className="px-4 py-4">Rank</th>
                <th className="px-4 py-4">Runner</th>
                <th className="px-4 py-4">Bib</th>
                <th className="px-4 py-4">Event</th>
                <th className="px-4 py-4">Time</th>
                <th className="px-4 py-4">Notes</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">Loading results...</td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">No results published yet.</td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id}>
                    <td className="px-4 py-4 text-white">{result.rank || "—"}</td>
                    <td className="px-4 py-4 text-gray-300">{result.user_name}</td>
                    <td className="px-4 py-4 text-brand">{result.bib_number}</td>
                    <td className="px-4 py-4 text-gray-300">{result.event_title}</td>
                    <td className="px-4 py-4 text-white">{result.finish_time}</td>
                    <td className="px-4 py-4 text-gray-300">{result.notes || "—"}</td>
                    <td className="px-4 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(result.id)}
                        showArrow={false}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}
