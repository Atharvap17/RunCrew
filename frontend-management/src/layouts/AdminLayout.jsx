import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminTopbar from "../components/Admin/AdminTopbar";
import "../styles/admin.css";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="volt-layout">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`volt-backdrop ${isSidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />

      {/* Volt Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Volt Main Content */}
      <main className="volt-main">
        <AdminTopbar
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar}
        />

        <div className="volt-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
