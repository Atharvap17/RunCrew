import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaClipboardList,
  FaCreditCard,
  FaTrophy,
  FaRunning,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  {
    to: "/organizer",
    icon: FaTachometerAlt,
    label: "Overview",
    end: true,
  },
  {
    to: "/organizer/events",
    icon: FaCalendarAlt,
    label: "My events",
  },
  {
    to: "/organizer/registrations",
    icon: FaClipboardList,
    label: "Registrations",
  },
  {
    to: "/organizer/payments",
    icon: FaCreditCard,
    label: "Payments",
  },
  {
    to: "/organizer/results",
    icon: FaTrophy,
    label: "Results",
  },
];

export default function OrganizerLayout() {
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
          <NavLink
            to="/organizer"
            className="flex items-center gap-2.5 font-display text-2xl text-white"
          >
            <FaRunning />
            <span>RunCrew</span>
          </NavLink>

          <p>Organizer workspace</p>
        </div>

        <nav
          className="organizer-nav"
          aria-label="Organizer navigation"
        >
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `organizer-nav__link ${
                  isActive ? "is-active" : ""
                }`
              }
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="organizer-account">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
              Signed in as
            </p>

            <p className="mt-1 truncate text-sm text-gray-300">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="organizer-logout"
            type="button"
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </div>

      </aside>

      <main className="organizer-main">
        <Outlet />
      </main>
    </div>
  );
}