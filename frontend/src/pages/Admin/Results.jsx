import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTrophy,
  FaChevronRight,
  FaPlus,
  FaTrashAlt,
  FaTimes,
  FaStopwatch,
  FaCheck,
} from "react-icons/fa";
import {
  getResults,
  createResult,
  deleteResult,
} from "../../services/resultService";
import { getRegistrations } from "../../services/registrationService";

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState({
    registration: "",
    finish_time: "01:30:00",
    rank: "",
    notes: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [res, regs] = await Promise.all([getResults(), getRegistrations()]);
      setResults(res.data);
      setRegistrations(
        regs.data.filter((r) => r.payment_status === "completed")
      );
    } catch (err) {
      console.error("Failed to load results:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    await createResult({
      ...form,
      rank: form.rank ? Number(form.rank) : null,
    });
    setShowForm(false);
    setForm({ registration: "", finish_time: "01:30:00", rank: "", notes: "" });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this race result entry?")) return;
    await deleteResult(id);
    load();
  };

  return (
    <div>
      {/* Volt Header */}
      <div className="volt-page-header">
        <div>
          <div className="volt-breadcrumb">
            <Link to="/admin">Admin</Link>
            <FaChevronRight className="text-[10px]" />
            <span>Race Results</span>
          </div>
          <div className="volt-page-title">
            <h1>Race Results Leaderboard</h1>
            <p className="volt-page-subtitle">
              Publish finish timings, bib rankings, and leaderboard standings for completed events.
            </p>
          </div>
        </div>

        <div className="volt-action-btns">
          <button
            onClick={() => setShowForm(!showForm)}
            className="volt-btn volt-btn--primary"
          >
            {showForm ? <FaTimes /> : <FaPlus />}
            <span>{showForm ? "Cancel" : "Add Race Result"}</span>
          </button>
        </div>
      </div>

      {/* Volt Form Modal/Panel */}
      {showForm && (
        <div className="volt-panel mb-8">
          <div className="volt-panel-header">
            <div className="volt-panel-title">
              <FaTrophy />
              <span>Publish Participant Result</span>
            </div>
            <button
              className="volt-btn volt-btn--secondary volt-btn--sm"
              onClick={() => setShowForm(false)}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2 volt-form-group">
              <label className="volt-label" htmlFor="registration">
                Participant Registration
              </label>
              <select
                id="registration"
                className="volt-select"
                value={form.registration}
                onChange={(e) => setForm({ ...form, registration: e.target.value })}
                required
              >
                <option value="">Select paid registration entry</option>
                {registrations.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.user_name} — {r.event_title} (Bib #{r.bib_number})
                  </option>
                ))}
              </select>
            </div>

            <div className="volt-form-group">
              <label className="volt-label" htmlFor="finish_time">
                Finish Time (HH:MM:SS)
              </label>
              <input
                id="finish_time"
                className="volt-input"
                placeholder="HH:MM:SS"
                value={form.finish_time}
                onChange={(e) => setForm({ ...form, finish_time: e.target.value })}
                required
              />
            </div>

            <div className="volt-form-group">
              <label className="volt-label" htmlFor="rank">
                Position Rank
              </label>
              <input
                id="rank"
                className="volt-input"
                type="number"
                placeholder="Overall rank (1, 2, 3...)"
                value={form.rank}
                onChange={(e) => setForm({ ...form, rank: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 volt-form-group">
              <label className="volt-label" htmlFor="notes">
                Notes / Category Details
              </label>
              <input
                id="notes"
                className="volt-input"
                placeholder="Optional notes (e.g. Category Winner, Personal Best)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="volt-btn volt-btn--secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="volt-btn volt-btn--primary">
                <FaCheck /> Save & Publish Result
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Volt Table Panel */}
      <div className="volt-panel">
        <div className="volt-panel-header">
          <div className="volt-panel-title">
            <FaTrophy />
            <span>Leaderboard Results ({results.length})</span>
          </div>
        </div>

        <div className="volt-table-container">
          {loading ? (
            <div className="volt-empty">Loading race results...</div>
          ) : results.length === 0 ? (
            <div className="volt-empty">No results published yet.</div>
          ) : (
            <table className="volt-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Runner</th>
                  <th>Bib #</th>
                  <th>Event</th>
                  <th>Finish Time</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const initial = r.user_name
                    ? r.user_name.charAt(0).toUpperCase()
                    : "R";
                  return (
                    <tr key={r.id}>
                      <td>
                        <span
                          className={`volt-badge ${
                            r.rank === 1
                              ? "volt-badge--brand"
                              : r.rank === 2 || r.rank === 3
                              ? "volt-badge--warning"
                              : "volt-badge--info"
                          } font-bold font-mono text-xs`}
                        >
                          #{r.rank || "—"}
                        </span>
                      </td>
                      <td>
                        <div className="volt-user-cell">
                          <div className="volt-avatar">{initial}</div>
                          <div>
                            <div className="volt-user-cell-name">{r.user_name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="volt-badge volt-badge--brand font-mono">
                          #{r.bib_number || "TBD"}
                        </span>
                      </td>
                      <td>
                        <span className="text-white font-medium">{r.event_title}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
                          <FaStopwatch />
                          <span>{r.finish_time}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-gray-400 text-xs">
                          {r.notes || "—"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="volt-btn volt-btn--danger volt-btn--sm"
                        >
                          <FaTrashAlt /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}