import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRunning } from "react-icons/fa";
import { registerUser } from "../../services/authService";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "participant",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (form.password !== form.confirm_password) {
      setErrors({ confirm_password: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
        role: form.role,
      });
      navigate("/login", {
        state: { message: "Registration successful. Please login to continue." },
      });
    } catch (err) {
      setErrors(err.response?.data || { general: "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__visual auth-page__visual--register">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1571008887538-b36bb08f4571?w=1400)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" />
        <div className="auth-page__visual-content">
          <span className="inline-block px-3.5 py-1 rounded-full bg-brand/20 border border-brand/40 text-brand text-xs font-bold tracking-[0.25em] uppercase mb-6">
            Join RunCrew
          </span>
          <h1 className="font-display text-4xl lg:text-6xl text-white leading-tight tracking-tight">
            Create races with<br />speed & confidence.
          </h1>
          <p className="mt-6 max-w-lg text-sm lg:text-base text-gray-300 leading-relaxed">
            Register for premier marathon events or host your own races, track registrations, and manage leaderboards.
          </p>
        </div>
      </div>

      <div className="auth-page__form-side">
        <div className="auth-card auth-card--register fade-in">
          <Link to="/" className="auth-brand group">
            <span className="w-11 h-11 rounded-xl bg-brand flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <FaRunning className="text-xl" />
            </span>
            <div>
              <span className="font-display text-2xl text-white tracking-wide block">RunCrew</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 block -mt-1">Marathon Platform</span>
            </div>
          </Link>

          <div className="auth-card__heading mt-6 mb-6">
            <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Join India&apos;s premier marathon community today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errors.general && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm px-4 py-3.5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                {errors.general}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                center
                label="First Name"
                placeholder="John"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                error={errors.first_name?.[0] || errors.first_name}
                required
              />
              <Input
                center
                label="Last Name"
                placeholder="Doe"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                error={errors.last_name?.[0] || errors.last_name}
                required
              />
            </div>

            <Input
              center
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email?.[0] || errors.email}
              required
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                center
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password?.[0] || errors.password}
                required
              />
              <Input
                center
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                error={errors.confirm_password?.[0] || errors.confirm_password}
                required
              />
            </div>

            <div className="pt-5 border-t border-white/10 flex flex-col gap-3">
              <div className="text-center">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand mb-1">
                  Register As
                </label>
                <p className="text-xs text-gray-400">
                  Select your role to tailor your experience on RunCrew.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`group flex cursor-pointer gap-3.5 p-3.5 rounded-xl border transition-all duration-200 ${
                    form.role === "participant"
                      ? "bg-brand/10 border-brand text-white shadow-md shadow-brand/10"
                      : "bg-[#121214] border-white/10 text-gray-300 hover:border-white/20 hover:bg-[#18181b]"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="participant"
                    checked={form.role === "participant"}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="sr-only"
                  />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand text-xl">
                    🏃
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white">Participant</div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">
                      Book races & track progress.
                    </div>
                  </div>
                </label>

                <label
                  className={`group flex cursor-pointer gap-3.5 p-3.5 rounded-xl border transition-all duration-200 ${
                    form.role === "organizer"
                      ? "bg-brand/10 border-brand text-white shadow-md shadow-brand/10"
                      : "bg-[#121214] border-white/10 text-gray-300 hover:border-white/20 hover:bg-[#18181b]"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="organizer"
                    checked={form.role === "organizer"}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="sr-only"
                  />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand text-xl">
                    🏁
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white">Organizer</div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">
                      Create & manage marathons.
                    </div>
                  </div>
                </label>
              </div>

              {errors.role && (
                <p className="text-rose-400 text-xs mt-1 font-medium">
                  {errors.role?.[0] || errors.role}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-12 justify-center font-display font-semibold tracking-wider text-sm uppercase"
                disabled={loading}
                showArrow={false}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </form>

          <p className="auth-switch mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
