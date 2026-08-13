import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaSearch,
  FaSignOutAlt,
  FaBars,
  FaUser,
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronDown,
} from "react-icons/fa";

export default function AdminTopbar({ user, onLogout, onToggleSidebar }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "A";
  const userName = user?.username || user?.email?.split("@")[0] || "Admin";

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="volt-topbar">
      <div className="volt-topbar-left">
        <button
          className="volt-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>

        <div className="volt-search-box">
          <FaSearch />
          <input type="text" placeholder="Search events, users, payments..." />
          <span className="volt-search-shortcut">⌘K</span>
        </div>
      </div>

      <div className="volt-topbar-right">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            className="volt-icon-btn"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            aria-label="Notifications"
          >
            <FaBell />
            <span className="volt-dot-badge" />
          </button>

          {isNotifOpen && (
            <div className="volt-notif-popover">
              <div className="volt-notif-header">
                <h4>Notifications</h4>
                <span className="volt-badge volt-badge--brand">3 New</span>
              </div>
              <div className="volt-notif-list">
                <div className="volt-notif-item">
                  <div className="volt-notif-icon">
                    <FaCheckCircle className="text-emerald-400" />
                  </div>
                  <div className="volt-notif-text">
                    <p>New registration for Mumbai Half Marathon</p>
                    <span>5 mins ago</span>
                  </div>
                </div>
                <div className="volt-notif-item">
                  <div className="volt-notif-icon">
                    <FaCheckCircle className="text-emerald-400" />
                  </div>
                  <div className="volt-notif-text">
                    <p>Payment ₹1,200 received via Razorpay</p>
                    <span>22 mins ago</span>
                  </div>
                </div>
                <div className="volt-notif-item">
                  <div className="volt-notif-icon">
                    <FaExclamationTriangle className="text-amber-400" />
                  </div>
                  <div className="volt-notif-text">
                    <p>Event status updated to completed</p>
                    <span>1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="volt-profile-dropdown" ref={profileRef}>
          <button
            className="volt-profile-btn"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
          >
            <div className="volt-avatar-sm">{userInitial}</div>
            <span className="volt-profile-name">{userName}</span>
            <FaChevronDown className="text-xs text-gray-400" />
          </button>

          {isProfileOpen && (
            <div className="volt-dropdown-menu">
              <div className="volt-dropdown-header">
                <h5>{userName}</h5>
                <p>{user?.email || "admin@runcrew.com"}</p>
              </div>

              <Link
                to="/profile"
                className="volt-dropdown-item"
                onClick={() => setIsProfileOpen(false)}
              >
                <FaUser /> My Profile
              </Link>

              <Link
                to="/admin/settings"
                className="volt-dropdown-item"
                onClick={() => setIsProfileOpen(false)}
              >
                <FaCog /> Settings
              </Link>

              <button
                className="volt-dropdown-item text-danger"
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
              >
                <FaSignOutAlt /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}