import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCog,
  FaChevronRight,
  FaCheck,
  FaBell,
  FaShieldAlt,
  FaSlidersH,
} from "react-icons/fa";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "RunCrew",
    supportEmail: "support@runcrew.com",
    currency: "INR (₹)",
    razorpayEnv: "Live",
    emailNotifications: true,
    autoBibAssignment: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {/* Volt Header */}
      <div className="volt-page-header">
        <div>
          <div className="volt-breadcrumb">
            <Link to="/admin">Admin</Link>
            <FaChevronRight className="text-[10px]" />
            <span>Settings</span>
          </div>
          <div className="volt-page-title">
            <h1>System Configuration</h1>
            <p className="volt-page-subtitle">
              Manage platform settings, payment gateway options, and system notification rules.
            </p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-2">
          <FaCheck /> Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="volt-grid-2">
        {/* General Settings Panel */}
        <div className="volt-panel">
          <div className="volt-panel-header">
            <div className="volt-panel-title">
              <FaSlidersH />
              <span>General Platform Settings</span>
            </div>
          </div>

          <div className="volt-form-group">
            <label className="volt-label">Platform Name</label>
            <input
              type="text"
              className="volt-input"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>

          <div className="volt-form-group">
            <label className="volt-label">Support Email Address</label>
            <input
              type="email"
              className="volt-input"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
          </div>

          <div className="volt-form-group">
            <label className="volt-label">Default Currency</label>
            <input
              type="text"
              className="volt-input"
              value={settings.currency}
              disabled
            />
          </div>
        </div>

        {/* Integration & Security Panel */}
        <div className="volt-panel">
          <div className="volt-panel-header">
            <div className="volt-panel-title">
              <FaShieldAlt />
              <span>Payment Gateway & Automation</span>
            </div>
          </div>

          <div className="volt-form-group">
            <label className="volt-label">Razorpay Gateway Mode</label>
            <select
              className="volt-select"
              value={settings.razorpayEnv}
              onChange={(e) => setSettings({ ...settings, razorpayEnv: e.target.value })}
            >
              <option value="Live">Live Production</option>
              <option value="Test">Sandbox Test</option>
            </select>
          </div>

          <div className="volt-form-group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 mt-4">
            <div>
              <div className="text-white text-sm font-semibold flex items-center gap-2">
                <FaBell className="text-[#f15a24]" /> Email Notifications
              </div>
              <div className="text-gray-400 text-xs">Send automatic receipts to participants</div>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="w-5 h-5 accent-[#f15a24] rounded cursor-pointer"
            />
          </div>

          <div className="volt-form-group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 mt-3">
            <div>
              <div className="text-white text-sm font-semibold flex items-center gap-2">
                <FaCog className="text-[#3b82f6]" /> Auto Bib Number Generation
              </div>
              <div className="text-gray-400 text-xs">Assign bib numbers upon payment confirmation</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoBibAssignment}
              onChange={(e) => setSettings({ ...settings, autoBibAssignment: e.target.checked })}
              className="w-5 h-5 accent-[#f15a24] rounded cursor-pointer"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="volt-btn volt-btn--primary">
              <FaCheck /> Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
