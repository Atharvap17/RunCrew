import { useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/eventService";

import Button from "../../components/Common/Button";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  date: "",
  time: "06:00",
  distance: "",
  fees: "",
  max_participants: "",
  image_url: "",
  is_featured: false,
  status: "upcoming",
};

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      const { data } = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEdit = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      date: event.date || "",
      time: event.time ? String(event.time).slice(0, 5) : "06:00",
      distance: event.distance || "",
      fees: event.fees ?? "",
      max_participants: event.max_participants ?? "",
      image_url: event.image_url || "",
      is_featured: Boolean(event.is_featured),
      status: event.status || "upcoming",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      fees: Number(form.fees),
      max_participants: Number(form.max_participants),
    };

    try {
      if (editingId) {
        await updateEvent(editingId, payload);
        setSuccess("Event updated successfully");
      } else {
        await createEvent(payload);
        setSuccess("Event created successfully");
      }
      closeForm();
      await loadEvents();
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.detail ||
          data?.error ||
          (typeof data === "object" ? Object.values(data).flat().join(" ") : null) ||
          "Failed to save event"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    setError("");
    setSuccess("");
    try {
      await deleteEvent(id);
      setSuccess("Event deleted successfully");
      await loadEvents();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete event");
    }
  };

  return (
    <div className="organizer-page">
      <header className="organizer-page__header">
        <div>
          <p className="section-label">Admin</p>
          <h1 className="organizer-page__title">Event management</h1>
          <p className="organizer-page__subtitle">Create, edit, and remove marathon events across the platform.</p>
        </div>
        <Button type="button" variant="primary" size="sm" showArrow={false} onClick={showForm ? closeForm : openCreate}>
          {showForm ? "Cancel" : "Add event"}
        </Button>
      </header>

      {error && <div className="alert alert-error mb-6">{error}</div>}
      {success && <div className="alert alert-success mb-6">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="organizer-card organizer-form mb-8 grid md:grid-cols-2 gap-4">
          <h2 className="md:col-span-2 font-display text-xl text-white">
            {editingId ? "Edit event" : "Create event"}
          </h2>

          {["title", "location", "distance", "date", "time", "fees", "max_participants", "image_url"].map((field) => (
            <div key={field}>
              <label className="organizer-label" htmlFor={field}>{field.replace("_", " ")}</label>
              <input
                id={field}
                className="form-input"
                placeholder={field.replace("_", " ")}
                type={
                  field === "date"
                    ? "date"
                    : field === "time"
                      ? "time"
                      : field === "fees" || field === "max_participants"
                        ? "number"
                        : "text"
                }
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required={field !== "image_url"}
              />
            </div>
          ))}

          <div>
            <label className="organizer-label" htmlFor="status">Status</label>
            <select id="status" className="form-select form-select--left" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300 px-1 mt-6">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="accent-brand"
            />
            Featured on homepage
          </label>

          <div className="md:col-span-2">
            <label className="organizer-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Event description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" variant="primary" size="sm" disabled={saving} showArrow={false}>
              {saving ? "Saving..." : editingId ? "Update event" : "Create event"}
            </Button>
          </div>
        </form>
      )}

      <div className="organizer-table-panel">
        {loading ? (
          <p className="organizer-empty">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="organizer-empty">No events found.</p>
        ) : (
          <table className="organizer-data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Distance</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td className="text-white font-medium">{ev.title}</td>
                  <td>{ev.date}</td>
                  <td>{ev.distance}</td>
                  <td>₹{ev.fees}</td>
                  <td>
                    <span className="organizer-badge organizer-badge--green capitalize">{ev.status}</span>
                  </td>
                  <td className="space-x-3">
                    <button onClick={() => openEdit(ev)} className="text-brand text-xs font-semibold uppercase tracking-wide hover:text-white">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(ev.id)} className="text-red-400 text-xs font-semibold uppercase tracking-wide hover:text-red-300">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
