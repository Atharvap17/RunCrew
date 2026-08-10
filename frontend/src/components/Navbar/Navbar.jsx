import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaRunning } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import Button from "../Common/Button";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/results", label: "Results" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, logout, isAdmin, isOrganizer } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="section-inner site-header__nav">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-[#F15A24] flex items-center justify-center shadow-lg shadow-orange-500/30">
            <FaRunning className="text-white text-xl" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              RunCrew
            </h2>

            <p className="text-xs uppercase tracking-[3px] text-gray-400">
              Marathon Platform
            </p>
          </div>
        </Link>

        <ul className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          {user && (
            <li>
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Profile
              </NavLink>
            </li>
          )}
          {isOrganizer && (
            <li>
              <NavLink to="/organizer" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Organizer
              </NavLink>
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <Button variant="outline" size="sm" onClick={logout} showArrow={false}>
              Logout
            </Button>
          ) : (
            <>
              <Button to="/login" variant="outline" size="sm" showArrow={false}>
                Login
              </Button>
              <Button to="/register" variant="primary" size="sm" showArrow={false}>
                Register
              </Button>
            </>
          )}
        </div>

        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      {open && (
        <div className="site-header__mobile lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block nav-link py-2"
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link to="/profile" onClick={() => setOpen(false)} className="block nav-link py-2">
              Profile
            </Link>
          )}
          {isOrganizer && (
            <Link to="/organizer" onClick={() => setOpen(false)} className="block nav-link py-2">
              Organizer
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="block nav-link py-2">
              Admin
            </Link>
          )}
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            {user ? (
              <Button variant="outline" size="sm" onClick={() => { logout(); setOpen(false); }} showArrow={false}>
                Logout
              </Button>
            ) : (
              <>
                <Button to="/login" variant="outline" size="sm" showArrow={false} onClick={() => setOpen(false)}>
                  Login
                </Button>
                <Button to="/register" variant="primary" size="sm" showArrow={false} onClick={() => setOpen(false)}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
