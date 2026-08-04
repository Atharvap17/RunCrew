import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaRunning } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      const role = data.user.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "organizer") {
        navigate("/organizer");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__visual auth-page__visual--login">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" />
        <div className="auth-page__visual-content">
          <span className="inline-block px-3.5 py-1 rounded-full bg-brand/20 border border-brand/40 text-brand text-xs font-bold tracking-[0.25em] uppercase mb-6">
            RunCrew Community
          </span>
          <h1 className="font-display text-4xl lg:text-6xl text-white leading-tight tracking-tight">
            Run smarter.<br />Race stronger.
          </h1>
          <p className="mt-6 max-w-lg text-sm lg:text-base text-gray-300 leading-relaxed">
            Sign in to manage your account, track registered events, and continue your marathon progress seamlessly.
          </p>
        </div>
      </div>

      <div className="auth-page__form-side">
        <div className="auth-card fade-in">
          <Link to="/" className="auth-brand group">
            <span className="w-11 h-11 rounded-xl bg-brand flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <FaRunning className="text-xl" />
            </span>
            <div>
              <span className="font-display text-2xl text-white tracking-wide block">RunCrew</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 block -mt-1">Marathon Platform</span>
            </div>
          </Link>

          <div className="auth-card__heading mt-6 mb-6">
            <p className="auth-kicker">Welcome back</p>
            <h2 className="font-display text-3xl sm:text-4xl text-white mt-1">Sign in to RunCrew</h2>
            <p className="auth-card__intro mt-2">Continue where your running journey left off.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {successMessage && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm px-4 py-3.5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                {successMessage}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm px-4 py-3.5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              center
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="flex flex-col">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                center
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-brand transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>
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
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>

          <p className="auth-switch mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand hover:underline font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
