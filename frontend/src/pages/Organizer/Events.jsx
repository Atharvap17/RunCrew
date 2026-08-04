import { useEffect, useState } from "react";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../../services/eventService";
import Button from "../../components/Common/Button";
import { FaCalendarAlt, FaEdit, FaMapMarkerAlt, FaTrashAlt, FaCloudUploadAlt } from "react-icons/fa";

const emptyForm = { title: "", description: "", location: "", date: "", time: "06:00", distance: "", fees: "", max_participants: "", image_url: "", is_featured: false, status: "upcoming", start_latitude: "", start_longitude: "" };
const fields = [
  { field: "title", label: "Title", type: "text" }, { field: "location", label: "Location", type: "text" },
  { field: "distance", label: "Distance", type: "text" }, { field: "date", label: "Date", type: "date" },
  { field: "time", label: "Start time", type: "time" }, { field: "fees", label: "Fee (₹)", type: "number" },
  { field: "max_participants", label: "Maximum participants", type: "number" },
];

export default function Events() {
  const [events, setEvents] = useState([]); const [loading, setLoading] = useState(true); const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); const [form, setForm] = useState(emptyForm); const [error, setError] = useState(""); const [success, setSuccess] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { loadEvents(); }, []);
  async function loadEvents() { setLoading(true); setError(""); try { const { data } = await getEvents({ scope: "mine" }); setEvents(data); } catch (err) { setError(err.response?.data?.detail || "Failed to load marathons."); } finally { setLoading(false); } }
  function closeForm() { setShowForm(false); setEditingId(null); setForm(emptyForm); }
  function openCreate() { closeForm(); setError(""); setSuccess(""); setShowForm(true); }
  function openEdit(event) { setEditingId(event.id); setForm({ title: event.title || "", description: event.description || "", location: event.location || "", date: event.date || "", time: event.time ? String(event.time).slice(0, 5) : "06:00", distance: event.distance || "", fees: event.fees ?? "", max_participants: event.max_participants ?? "", image_url: event.image_url || "", is_featured: Boolean(event.is_featured), status: event.status || "upcoming", start_latitude: event.start_latitude ?? "", start_longitude: event.start_longitude ?? "" }); setError(""); setSuccess(""); setShowForm(true); }

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setForm((prev) => ({ ...prev, image_url: reader.result })); };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e) { e.preventDefault(); setSaving(true); setError(""); try { const payload = { ...form, fees: Number(form.fees), max_participants: Number(form.max_participants), start_latitude: form.start_latitude ? Number(form.start_latitude) : null, start_longitude: form.start_longitude ? Number(form.start_longitude) : null }; if (editingId) { await updateEvent(editingId, payload); setSuccess("Marathon updated successfully."); } else { await createEvent(payload); setSuccess("Marathon created successfully."); } closeForm(); await loadEvents(); } catch (err) { const data = err.response?.data; setError(data?.detail || data?.error || (typeof data === "object" ? Object.values(data).flat().join(" ") : null) || "Failed to save marathon."); } finally { setSaving(false); } }
  async function handleDelete(id) { if (!confirm("Delete this marathon event?")) return; setError(""); setSuccess(""); try { await deleteEvent(id); setSuccess("Marathon deleted successfully."); await loadEvents(); } catch (err) { setError(err.response?.data?.detail || "Failed to delete marathon."); } }
  const statusClass = (status) => status === "cancelled" ? "organizer-badge--red" : status === "completed" ? "organizer-badge--green" : "organizer-badge--yellow";

  return <div className="organizer-page">
    <div className="organizer-page__header"><div><p className="section-label">Organizer</p><h1 className="organizer-page__title">My marathons</h1><p className="organizer-page__subtitle">Create, update, and keep every race detail in one polished workspace.</p></div><Button onClick={showForm ? closeForm : openCreate} variant={showForm ? "outline" : "primary"} showArrow={false}>{showForm ? "Cancel" : "+ Create marathon"}</Button></div>
    {error && <div className="alert alert-error mb-5">{error}</div>}{success && <div className="alert alert-success mb-5">{success}</div>}
    {showForm && <form onSubmit={handleSubmit} className="organizer-card organizer-form mb-8 grid gap-5 md:grid-cols-2 fade-in"><h2 className="md:col-span-2 text-xl font-semibold text-white">{editingId ? "Edit marathon" : "Create marathon"}</h2>{fields.map(({ field, label, type, required = true }) => <div key={field}><label className="organizer-label">{label}</label><input className="form-input" type={type} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required={required} /></div>)}<div><label className="organizer-label">Poster Image (URL or Upload)</label><div className="flex gap-2"><input className="form-input" type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" /><input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" id="poster-file-input" /><label htmlFor="poster-file-input" className="btn btn-outline cursor-pointer shrink-0 text-xs py-2 px-3 flex items-center justify-center gap-1"><FaCloudUploadAlt />Upload</label></div></div><div><label className="organizer-label">Status</label><select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{["upcoming", "ongoing", "completed", "cancelled"].map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></div><label className="flex items-center gap-2 pt-7 text-sm text-gray-300"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-orange-500" />Feature on the home page</label><div className="md:col-span-2"><label className="organizer-label">Description</label><textarea className="form-textarea" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div><div className="md:col-span-2 flex justify-end"><Button type="submit" disabled={saving} showArrow={false}>{saving ? "Saving..." : editingId ? "Update marathon" : "Create marathon"}</Button></div></form>}
    <div className="organizer-card organizer-table-wrap">{loading ? <p className="organizer-empty">Loading marathons...</p> : events.length === 0 ? <p className="organizer-empty">No marathons yet. Create your first event.</p> : <table className="organizer-table"><thead><tr><th>Marathon</th><th>Date & location</th><th>Distance</th><th>Fee</th><th>Status</th><th className="text-right">Actions</th></tr></thead><tbody>{events.map((ev) => <tr key={ev.id}><td><p className="font-semibold text-white">{ev.title}</p>{ev.is_featured && <span className="organizer-badge organizer-badge--brand mt-2">Featured</span>}</td><td><p className="flex items-center gap-2 text-gray-300"><FaCalendarAlt className="text-brand" />{ev.date}</p><p className="mt-1 flex items-center gap-2 text-xs text-gray-500"><FaMapMarkerAlt />{ev.location}</p></td><td>{ev.distance}</td><td className="font-semibold text-white">₹{ev.fees}</td><td><span className={`organizer-badge ${statusClass(ev.status)}`}>{ev.status}</span></td><td><div className="flex justify-end gap-3"><button onClick={() => openEdit(ev)} className="text-sm font-semibold text-brand hover:text-brand-light"><FaEdit className="mr-1 inline" />Edit</button><button onClick={() => handleDelete(ev.id)} className="text-sm font-semibold text-red-400 hover:text-red-300"><FaTrashAlt className="mr-1 inline" />Delete</button></div></td></tr>)}</tbody></table>}</div>
  </div>;
}
