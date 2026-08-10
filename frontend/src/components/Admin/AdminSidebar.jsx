import { NavLink } from "react-router-dom";
import {
  FaRunning,
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaCreditCard,
  FaTrophy,
  FaCog,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    title: "MAIN",
    items: [
      {
        to: "/admin",
        label: "Dashboard",
        icon: FaTachometerAlt,
        end: true,
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        to: "/admin/users",
        label: "Users",
        icon: FaUsers,
      },
      {
        to: "/admin/events",
        label: "Events",
        icon: FaCalendarAlt,
      },
      {
        to: "/admin/registrations",
        label: "Registrations",
        icon: FaClipboardList,
      },
      {
        to: "/admin/payments",
        label: "Payments",
        icon: FaCreditCard,
      },
      {
        to: "/admin/results",
        label: "Results",
        icon: FaTrophy,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        to: "/admin/settings",
        label: "Settings",
        icon: FaCog,
      },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const userInitial = user?.email?.charAt(0).toUpperCase() || "A";

  return (
    <aside className={`volt-sidebar ${isOpen ? "open" : ""}`}>
      {/* Brand Header */}
      <div className="volt-sidebar-header">
        <NavLink to="/admin" className="volt-brand-box" onClick={onClose}>
          <div className="volt-brand-icon">
            <FaRunning />
          </div>
          <div className="volt-brand-text">
            <h2>RunCrew</h2>
            <p>Admin Dashboard</p>
          </div>
        </NavLink>

        <button
          className="volt-sidebar-close"
          onClick={onClose}
          aria-label="Close Sidebar"
        >
          <FaTimes />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="volt-sidebar-nav">
        {menuItems.map((section) => (
          <div key={section.title} className="volt-nav-group">
            <div className="volt-nav-title">{section.title}</div>

            {section.items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `volt-nav-link ${isActive ? "active" : ""}`
                }
              >
                <div className="volt-nav-link-content">
                  <Icon />
                  <span>{label}</span>
                </div>
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Footer User Profile Card */}
      <div className="volt-sidebar-footer">
        <div className="volt-user-card">
          <div className="volt-avatar">{userInitial}</div>
          <div className="volt-user-info">
            <div className="volt-user-name">
              {user?.username || user?.email?.split("@")[0] || "Administrator"}
            </div>
            <div className="volt-user-role">Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}