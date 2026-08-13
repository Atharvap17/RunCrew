import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import OrganizerRoute from "../components/OrganizerRoute";
import OrganizerLayout from "../layouts/OrganizerLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "../components/AdminRoute";

import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";

import OrganizerDashboard from "../pages/Organizer/Dashboard";
import OrganizerEvents from "../pages/Organizer/Events";
import OrganizerRegistrations from "../pages/Organizer/Registrations";
import OrganizerPayments from "../pages/Organizer/Payments";
import OrganizerResults from "../pages/Organizer/Results";

import AdminDashboard from "../pages/Admin/Dashboard";
import AdminUsers from "../pages/Admin/Users";
import AdminEvents from "../pages/Admin/Events";
import AdminRegistrations from "../pages/Admin/Registrations";
import AdminPayments from "../pages/Admin/Payments";
import AdminResults from "../pages/Admin/Results";
import AdminSettings from "../pages/Admin/Settings";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Management Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ==================== ADMIN ==================== */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="registrations" element={<AdminRegistrations />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ==================== ORGANIZER ==================== */}

        <Route
          path="/organizer"
          element={
            <OrganizerRoute>
              <OrganizerLayout />
            </OrganizerRoute>
          }
        >
          <Route index element={<OrganizerDashboard />} />
          <Route path="events" element={<OrganizerEvents />} />
          <Route
            path="registrations"
            element={<OrganizerRegistrations />}
          />
          <Route path="payments" element={<OrganizerPayments />} />
          <Route path="results" element={<OrganizerResults />} />
        </Route>

        {/* ==================== UNKNOWN ROUTES ==================== */}

        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0c0c0c",
                color: "#fff",
                fontSize: "18px",
              }}
            >
              Page not found
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}