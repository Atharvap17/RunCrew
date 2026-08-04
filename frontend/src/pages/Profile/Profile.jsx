import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiCalendar, HiTag, HiUser } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../services/authService";
import { getRegistrations, cancelRegistration } from "../../services/registrationService";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import Card from "../../components/Common/Card";
import ScrollReveal from "../../components/Common/ScrollReveal";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profileRes, regRes] = await Promise.all([
        getProfile(),
        getRegistrations(),
      ]);
      setProfile(profileRes.data);
      setForm(profileRes.data);
      setRegistrations(regRes.data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSave = async () => {
    try {
      const { data } = await updateProfile(form);
      setProfile(data);
      updateUser(data);
      setEditing(false);
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this registration?")) return;
    try {
      await cancelRegistration(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const displayName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.username
    : "";

  return (
    <div className="participant-page">
      <div className="participant-page-header">
        <p className="section-label">Account</p>
        <h1>My profile.</h1>
      </div>

      {message && (
        <div className="alert alert-success mb-6 fade-in">{message}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <ScrollReveal animation="bubble">
          <Card className="panel--lg flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-3xl font-display text-brand mb-4 shadow-lg shadow-brand/10">
              {displayName?.[0]?.toUpperCase() || <HiUser />}
            </div>
            
            <h2 className="font-display text-2xl text-white">{displayName}</h2>
            
            {profile?.email && displayName !== profile.email && (
              <p className="text-gray-300 text-sm mt-1">{profile.email}</p>
            )}
            
            {profile?.phone && (
              <p className="text-gray-400 text-xs mt-1">{profile.phone}</p>
            )}

            <span className="inline-block mt-4 text-xs bg-brand/10 border border-brand/20 text-brand px-3.5 py-1 rounded-full uppercase tracking-widest font-bold">
              {profile?.role || "Participant"}
            </span>

            {!editing ? (
              <Button
                onClick={() => setEditing(true)}
                variant="outline-brand"
                size="sm"
                className="w-full justify-center mt-6"
                showArrow={false}
              >
                Edit Profile
              </Button>
            ) : (
              <div className="mt-6 w-full space-y-3 text-left">
                <Input
                  label="Username"
                  value={form.username || ""}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <Input
                  label="Phone"
                  value={form.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave} variant="primary" size="sm" className="flex-1 justify-center" showArrow={false}>
                    Save
                  </Button>
                  <Button onClick={() => setEditing(false)} variant="dark" size="sm" className="flex-1 justify-center" showArrow={false}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </ScrollReveal>

        <div className="lg:col-span-2">
          <div className="mb-10">
            <h3 className="font-display text-2xl text-white">Registration History</h3>
          </div>
          
          {registrations.length === 0 ? (
            <Card className="panel--lg text-center">
              <p className="text-gray-400">No registrations yet.</p>
              <Link to="/events" className="read-more mt-4 inline-flex">
                Browse Events
              </Link>
            </Card>
          ) : (
            <div className="space-y-5">
              {registrations.map((reg, index) => (
                <ScrollReveal key={reg.id} animation="bubble" delay={index * 100}>
                  <Card className="p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                    <div className="space-y-1.5">
                      <h4 className="text-white font-display text-xl">{reg.event_title}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300">
                        <span className="flex items-center gap-1.5">
                          <HiCalendar className="text-brand text-base shrink-0" />
                          {reg.event_date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <HiTag className="text-brand text-base shrink-0" />
                          Bib: <span className="text-brand font-bold">{reg.bib_number || "Pending"}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 sm:justify-end shrink-0">
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5 block select-none">
                          Status
                        </span>
                        {reg.status === "cancelled" ? (
                          <span className="status-pill status-pill--cancelled">
                            Cancelled
                          </span>
                        ) : (
                          <span className={`status-pill ${
                            reg.payment_status === "completed"
                              ? "status-pill--successful"
                              : "status-pill--pending"
                          }`}>
                            {reg.payment_status === "completed" ? "Successful" : "Pending"}
                          </span>
                        )}
                      </div>

                      {reg.payment_status === "pending" && reg.status !== "cancelled" && (
                        <div className="flex items-center gap-2.5">
                          <Button to={`/payment/${reg.id}`} variant="primary" size="sm" showArrow={false}>
                            Pay Now
                          </Button>
                          <Button
                            onClick={() => handleCancel(reg.id)}
                            variant="outline-danger"
                            size="sm"
                            showArrow={false}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
