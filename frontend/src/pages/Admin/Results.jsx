import { useEffect, useState } from "react";
import { getResults, createResult, deleteResult } from "../../services/resultService";
import { getRegistrations } from "../../services/registrationService";
import Button from "../../components/Common/Button";

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState({ registration: "", finish_time: "01:30:00", rank: "", notes: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const [res, regs] = await Promise.all([getResults(), getRegistrations()]);
    setResults(res.data);
    setRegistrations(regs.data.filter((r) => r.payment_status === "completed"));
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    await createResult({ ...form, rank: form.rank ? Number(form.rank) : null });
    setShowForm(false);
    setForm({ registration: "", finish_time: "01:30:00", rank: "", notes: "" });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this result?")) return;
    await deleteResult(id);
    load();
  };

  return (
    <div className="organizer-page">
      <header className="organizer-page__header">
        <div>
          <p className="section-label">Admin</p>
          <h1 className="organizer-page__title">Race results</h1>
          <p className="organizer-page__subtitle">Publish finish times and rankings for completed events.</p>
        </div>
        <Button type="button" variant="primary" size="sm" showArrow={false} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add result"}
        </Button>
      </header>

      {showForm && (
        <form onSubmit={handleCreate} className="organizer-card organizer-form mb-8 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="organizer-label" htmlFor="registration">Registration</label>
            <select
              id="registration"
              className="form-select form-select--left"
              value={form.registration}
              onChange={(e) => setForm({ ...form, registration: e.target.value })}
              required
            >
              <option value="">Select registration</option>
              {registrations.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.user_name} — {r.event_title} ({r.bib_number})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="organizer-label" htmlFor="finish_time">Finish time</label>
            <input id="finish_time" className="form-input" placeholder="HH:MM:SS" value={form.finish_time} onChange={(e) => setForm({ ...form, finish_time: e.target.value })} required />
          </div>
          <div>
            <label className="organizer-label" htmlFor="rank">Rank</label>
            <input id="rank" className="form-input" type="number" placeholder="Rank" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="organizer-label" htmlFor="notes">Notes</label>
            <input id="notes" className="form-input" placeholder="Optional notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" variant="primary" size="sm" showArrow={false}>Save result</Button>
          </div>
        </form>
      )}

      <div className="organizer-table-panel">
        <table className="organizer-data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Runner</th>
              <th>Bib</th>
              <th>Event</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td className="text-white font-display text-lg">#{r.rank || "—"}</td>
                <td className="text-white">{r.user_name}</td>
                <td className="text-brand font-semibold">{r.bib_number}</td>
                <td>{r.event_title}</td>
                <td className="font-mono text-sm">{r.finish_time}</td>
                <td>
                  <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-300 text-xs font-semibold uppercase tracking-wide">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length === 0 && <p className="organizer-empty">No results published yet.</p>}
      </div>
    </div>
  );
}
