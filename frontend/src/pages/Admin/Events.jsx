import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaChevronRight,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/eventService";
import LocationPickerMap from "../../components/Map/LocationPickerMap";

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
  start_latitude: "",
  start_longitude: "",
  route_coordinates: [],
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
      start_latitude: event.start_latitude ?? "",
      start_longitude: event.start_longitude ?? "",
      route_coordinates: Array.isArray(event.route_coordinates) ? event.route_coordinates : [],
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
      start_latitude: form.start_latitude !== "" && form.start_latitude !== null ? Number(form.start_latitude) : null,
      start_longitude: form.start_longitude !== "" && form.start_longitude !== null ? Number(form.start_longitude) : null,
      route_coordinates: Array.isArray(form.route_coordinates) ? form.route_coordinates : [],
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
    <div>
      {/* Volt Header */}
      <div className="volt-page-header">
        <div>
          <div className="volt-breadcrumb">
            <Link to="/admin">Admin</Link>
            <FaChevronRight className="text-[10px]" />
            <span>Events</span>
          </div>
          <div className="volt-page-title">
            <h1>Event Management</h1>
            <p className="volt-page-subtitle">
              Create, edit, and maintain marathon races and running events.
            </p>
          </div>
        </div>

        <div className="volt-action-btns">
          <button
            onClick={showForm ? closeForm : openCreate}
            className="volt-btn volt-btn--primary"
          >
            {showForm ? <FaTimes /> : <FaPlus />}
            <span>{showForm ? "Cancel" : "Add Event"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
          {success}
        </div>
      )}

      {/* Volt Form Modal/Panel */}
      {showForm && (
        <div className="volt-panel mb-8">
          <div className="volt-panel-header">
            <div className="volt-panel-title">
              <FaCalendarAlt />
              <span>{editingId ? "Edit Marathon Event" : "Create New Marathon Event"}</span>
            </div>
            <button className="volt-btn volt-btn--secondary volt-btn--sm" onClick={closeForm}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            {["title", "location", "distance", "date", "time", "fees", "max_participants", "image_url"].map((field) => (
              <div key={field} className="volt-form-group">
                <label className="volt-label" htmlFor={field}>
                  {field.replace("_", " ")}
                </label>
                <input
                  id={field}
                  className="volt-input"
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

            <div className="volt-form-group">
              <label className="volt-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="volt-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="volt-form-group flex items-center gap-3 pt-6">
              <input
                id="is_featured"
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="w-5 h-5 accent-[#f15a24] rounded cursor-pointer"
              />
              <label htmlFor="is_featured" className="text-sm font-semibold text-white cursor-pointer">
                Feature on Homepage Banner
              </label>
            </div>

            <div className="volt-form-group md:col-span-2">
              <label className="volt-label">
                Race Route & Location Map (Click map to set Start/Finish)
              </label>
              <LocationPickerMap
                startLat={form.start_latitude}
                startLng={form.start_longitude}
                routeCoordinates={form.route_coordinates}
                onChange={(mapData) => setForm((prev) => ({ ...prev, ...mapData }))}
              />
            </div>

            <div className="md:col-span-2 volt-form-group">
              <label className="volt-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="volt-textarea"
                rows={3}
                placeholder="Full event details, route descriptions, and schedule"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="volt-btn volt-btn--secondary"
                onClick={closeForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="volt-btn volt-btn--primary"
                disabled={saving}
              >
                <FaCheck />
                <span>{saving ? "Saving..." : editingId ? "Update Event" : "Create Event"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Volt Events Table Panel */}
      <div className="volt-panel">
        <div className="volt-panel-header">
          <div className="volt-panel-title">
            <FaCalendarAlt />
            <span>Marathon Events List ({events.length})</span>
          </div>
        </div>

        <div className="volt-table-container">
          {loading ? (
            <div className="volt-empty">Loading marathon events...</div>
          ) : events.length === 0 ? (
            <div className="volt-empty">No events found.</div>
          ) : (
            <table className="volt-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date & Time</th>
                  <th>Distance</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div className="volt-user-cell">
                        <div className="volt-avatar">{ev.title.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="volt-user-cell-name">{ev.title}</div>
                          <div className="volt-user-cell-sub">{ev.location}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-white font-medium">{ev.date}</div>
                      <div className="volt-user-cell-sub">{ev.time || "06:00"}</div>
                    </td>
                    <td>
                      <span className="volt-badge volt-badge--info">{ev.distance}</span>
                    </td>
                    <td className="text-white font-bold">₹{ev.fees}</td>
                    <td>
                      <span
                        className={`volt-badge ${
                          ev.status === "completed"
                            ? "volt-badge--success"
                            : ev.status === "ongoing"
                            ? "volt-badge--warning"
                            : ev.status === "cancelled"
                            ? "volt-badge--danger"
                            : "volt-badge--brand"
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(ev)}
                          className="volt-btn volt-btn--secondary volt-btn--sm"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ev.id)}
                          className="volt-btn volt-btn--danger volt-btn--sm"
                        >
                          <FaTrashAlt /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
