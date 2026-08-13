import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiCalendar, HiClock, HiLocationMarker, HiShieldCheck, HiUser, HiTag, HiHeart, HiChevronDown } from "react-icons/hi";
import { getEvent } from "../../services/eventService";
import { createRegistration } from "../../services/registrationService";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";

export default function EventRegistration() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "male",
    date_of_birth: "",
    city: "",
    bib_name: "",
    t_shirt_size: "M",
    emergency_contact: "",
    emergency_phone: "",
    blood_group: "O+",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "",
        email: user.email || "",
        bib_name: (user.first_name || user.username || "").toUpperCase(),
      }));
    }
  }, [user]);

  useEffect(() => {
    getEvent(id)
      .then(({ data }) => setEvent(data))
      .catch(() => navigate("/events"));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const emergencyContactCombined = form.emergency_phone
        ? `${form.emergency_contact} (${form.emergency_phone})`
        : form.emergency_contact;

      const { data } = await createRegistration({
        event: Number(id),
        emergency_contact: emergencyContactCombined,
        t_shirt_size: form.t_shirt_size,
        phone: form.phone,
        gender: form.gender,
        date_of_birth: form.date_of_birth,
        blood_group: form.blood_group,
        bib_name: form.bib_name,
        city: form.city,
      });
      navigate(`/payment/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="loading-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="participant-page">
      <div className="participant-flow participant-flow--wide">
        
        <div className="participant-flow__header">
          <span className="flow-kicker">Official race entry</span>
          <h1>Marathon registration</h1>
          <p>
            Fill in your athlete details to secure your entry for{" "}
            <span className="text-white font-semibold">{event.title}</span>.
          </p>
        </div>

        <div className="flow-panel flow-panel--emphasis flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -z-0 pointer-events-none" />
          <img
            src={event.image_url || "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500"}
            alt={event.title}
            className="w-full md:w-44 h-36 object-cover rounded-2xl border border-white/10 shrink-0 shadow-lg bg-zinc-900"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500";
            }}
          />
          <div className="flex-1 space-y-3 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2">
              <span className="text-brand text-xs font-bold tracking-widest uppercase bg-brand/15 border border-brand/20 px-3 py-1 rounded-lg">
                {event.distance}
              </span>
              <span className="text-xs text-gray-400 font-medium">Cap: {event.max_participants} Runners</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight">{event.title}</h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-xs sm:text-sm text-gray-300 pt-1">
              <span className="flex items-center gap-2"><HiLocationMarker className="text-brand text-base" /> {event.location}</span>
              <span className="flex items-center gap-2"><HiCalendar className="text-brand text-base" /> {event.date}</span>
              <span className="flex items-center gap-2"><HiClock className="text-brand text-base" /> {event.time?.slice(0, 5)}</span>
            </div>
          </div>
          <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-5 md:pt-0 md:pl-8 z-10 shrink-0">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Total Fee</p>
            <p className="font-display text-3xl sm:text-4xl text-brand font-bold mt-1">₹{event.fees}</p>
          </div>
        </div>

        {/* Multi-block Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {error && (
            <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm px-5 py-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
              {error}
            </div>
          )}

          {/* Block 1: Personal Information */}
          <div className="flow-panel flex flex-col gap-8">
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/15 text-brand flex items-center justify-center text-2xl shrink-0 border border-brand/20">
                  <HiUser />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-white">1. Personal Information</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Official runner details for race timing and ID verification.</p>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-bold text-brand bg-brand/10 border border-brand/20 px-3 py-1 rounded-full uppercase tracking-widest">
                Step 01 / 03
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-7 gap-y-7">
              <Input
                label="Full Name"
                placeholder="Runner Full Name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                value={form.date_of_birth}
                onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                required
              />
              <div className="flex flex-col gap-2.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 text-center leading-normal">
                  Gender
                </label>
                <div className="relative">
                  <select
                    className="w-full h-12 px-4 rounded-xl bg-[#161618] border border-white/12 text-white text-sm text-center appearance-none focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-[#1a1a1c] focus:outline-none transition-all duration-200 cursor-pointer"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base" />
                </div>
              </div>
              <Input
                label="City / State"
                placeholder="Mumbai, Maharashtra"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Block 2: Race Merchandise & Bib Customization */}
          <div className="flow-panel flex flex-col gap-8">
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/15 text-brand flex items-center justify-center text-2xl shrink-0 border border-brand/20">
                  <HiTag />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-white">2. Race Gear & Bib Customization</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Customize your official marathon T-shirt and printed Bib name.</p>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-bold text-brand bg-brand/10 border border-brand/20 px-3 py-1 rounded-full uppercase tracking-widest">
                Step 02 / 03
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-7 gap-y-7">
              <Input
                label="Name Printed on Bib"
                placeholder="e.g. ATHARVA"
                value={form.bib_name}
                onChange={(e) => setForm({ ...form, bib_name: e.target.value })}
                required
              />
              <div className="flex flex-col gap-2.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 text-center leading-normal">
                  T-Shirt Size
                </label>
                <div className="relative">
                  <select
                    className="w-full h-12 px-4 rounded-xl bg-[#161618] border border-white/12 text-white text-sm text-center appearance-none focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-[#1a1a1c] focus:outline-none transition-all duration-200 cursor-pointer"
                    value={form.t_shirt_size}
                    onChange={(e) => setForm({ ...form, t_shirt_size: e.target.value })}
                  >
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <option key={size} value={size}>{size} (Standard Athlete Fit)</option>
                    ))}
                  </select>
                  <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base" />
                </div>
              </div>
            </div>
          </div>

          {/* Block 3: Medical & Emergency Details */}
          <div className="flow-panel flex flex-col gap-8">
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/15 text-brand flex items-center justify-center text-2xl shrink-0 border border-brand/20">
                  <HiHeart />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-white">3. Medical & Emergency Details</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Required for track safety and emergency medical support.</p>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-bold text-brand bg-brand/10 border border-brand/20 px-3 py-1 rounded-full uppercase tracking-widest">
                Step 03 / 03
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-7 gap-y-7">
              <Input
                label="Emergency Contact Name"
                placeholder="Parent / Spouse / Friend Name"
                value={form.emergency_contact}
                onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })}
                required
              />
              <Input
                label="Emergency Contact Phone"
                type="tel"
                placeholder="+91 9876543210"
                value={form.emergency_phone}
                onChange={(e) => setForm({ ...form, emergency_phone: e.target.value })}
                required
              />
              <div className="flex flex-col gap-2.5 sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 text-center leading-normal">
                  Blood Group
                </label>
                <div className="relative">
                  <select
                    className="w-full h-12 px-4 rounded-xl bg-[#161618] border border-white/12 text-white text-sm text-center appearance-none focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-[#1a1a1c] focus:outline-none transition-all duration-200 cursor-pointer"
                    value={form.blood_group}
                    onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                  <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 text-center flex flex-col items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full h-14 justify-center font-display font-semibold tracking-wider text-base uppercase shadow-xl shadow-brand/25 hover:shadow-brand/40 transition-all duration-300"
              disabled={loading}
              showArrow={false}
            >
              {loading ? "Processing Entry..." : "Proceed to Payment"}
            </Button>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
              <HiShieldCheck className="text-brand text-base" /> 256-bit Encrypted & Official Marathon Entry Protocol
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
