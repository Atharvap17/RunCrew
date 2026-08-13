import { useEffect, useState } from "react";
import { getResults } from "../../services/resultService";
import { getEvents } from "../../services/eventService";

export default function Results() {
  const [results, setResults] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventFilter, setEventFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(({ data }) => setEvents(data));
  }, []);

  useEffect(() => {
    loadResults();
  }, [eventFilter]);

  async function loadResults() {
    setLoading(true);
    try {
      const params = eventFilter ? { event: eventFilter } : {};
      const { data } = await getResults(params);
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (duration) => {
    if (!duration) return "—";
    const parts = duration.split(":");
    if (parts.length >= 3) {
      const h = parseInt(parts[0]);
      const m = parts[1];
      const s = parts[2].split(".")[0];
      return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
    }
    return duration;
  };

  const rankColor = (rank) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-amber-600";
    return "text-white";
  };

  return (
    <div className="participant-page">
        <div className="participant-page-header"><p className="section-label">Leaderboard</p><h1>Race results.</h1><p>Official finish times and rankings from completed events.</p></div>

        <div className="participant-select-wrap">
          <select
            className="form-select max-w-xs"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          >
            <option value="">All Events</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="loading-spinner" />
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__title">No results yet</p>
            <p className="empty-state__text">Official finish times will appear here after events are completed.</p>
          </div>
        ) : (
          <div className="participant-table-panel">
              <table className="participant-data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Runner</th>
                    <th>Bib</th>
                    <th>Event</th>
                    <th>Finish Time</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span className={`font-display text-lg ${rankColor(r.rank)}`}>
                          #{r.rank || "—"}
                        </span>
                      </td>
                      <td className="text-white">{r.user_name}</td>
                      <td className="text-brand font-semibold">{r.bib_number}</td>
                      <td className="text-gray-400">{r.event_title}</td>
                      <td className="text-white font-mono text-sm">{formatTime(r.finish_time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}
    </div>
  );
}
