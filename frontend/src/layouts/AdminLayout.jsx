import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaTachometerAlt, FaUsers, FaCalendarAlt, FaClipboardList,
  FaCreditCard, FaTrophy, FaRunning, FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { to: "/admin", icon: FaTachometerAlt, label: "Dashboard", end: true },
  { to: "/admin/users", icon: FaUsers, label: "Users" },
  { to: "/admin/events", icon: FaCalendarAlt, label: "Events" },
  { to: "/admin/registrations", icon: FaClipboardList, label: "Registrations" },
  { to: "/admin/payments", icon: FaCreditCard, label: "Payments" },
  { to: "/admin/results", icon: FaTrophy, label: "Results" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="organizer-app">
      <aside className="organizer-sidebar">
        <div className="organizer-brand">
          <NavLink to="/" className="flex items-center gap-2.5 font-display text-2xl text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <FaRunning />
            </span>
            RunCrew
          </NavLink>
          <p>Admin workspace</p>
        </div>

        <nav className="organizer-nav" aria-label="Admin navigation">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `organizer-nav__link ${isActive ? "is-active" : ""}`}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="organizer-account">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">Signed in as</p>
            <p className="mt-1 truncate text-sm text-gray-300">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="organizer-logout" type="button">
            <FaSignOutAlt /> Sign out
          </button>
        </div>
      </aside>

      <main className="organizer-main">
        <Outlet />
      </main>
    </div>
  );
}
