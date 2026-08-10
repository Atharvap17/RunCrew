import { BrowserRouter, Routes, Route } from "react-router-dom";

import OrganizerRoute from "../components/OrganizerRoute";
import OrganizerLayout from "../layouts/OrganizerLayout";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";


import OrganizerDashboard from "../pages/Organizer/Dashboard";
import OrganizerEvents from "../pages/Organizer/Events";
import OrganizerRegistrations from "../pages/Organizer/Registrations";
import OrganizerPayments from "../pages/Organizer/Payments";
import OrganizerResults from "../pages/Organizer/Results";

import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import EventDetails from "../pages/EventDetails/EventDetails";
import EventRegistration from "../pages/EventRegistration/EventRegistration";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Profile from "../pages/Profile/Profile";
import Results from "../pages/Results/Results";
import Payment from "../pages/Payment/Payment";
import PaymentConfirmation from "../pages/PaymentConfirmation/PaymentConfirmation";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import NotFound from "../pages/NotFound/NotFound";
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
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/events/:id/register" element={
            <ProtectedRoute><EventRegistration /></ProtectedRoute>
          } />
          <Route path="/payment/:registrationId" element={
            <ProtectedRoute><Payment /></ProtectedRoute>
          } />
          <Route path="/payment/confirmation/:paymentId" element={
            <ProtectedRoute><PaymentConfirmation /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/admin" element={
          <AdminRoute><AdminLayout /></AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="registrations" element={<AdminRegistrations />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

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
          <Route path="registrations" element={<OrganizerRegistrations />} />
          <Route path="payments" element={<OrganizerPayments />} />
          <Route path="results" element={<OrganizerResults />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
