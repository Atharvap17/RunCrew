import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCreditCard,
  FaChevronRight,
  FaSearch,
  FaRupeeSign,
  FaCheckCircle,
} from "react-icons/fa";
import { getPayments } from "../../services/paymentService";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments()
      .then(({ data }) => setPayments(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(
    (p) =>
      p.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.event_title?.toLowerCase().includes(search.toLowerCase()) ||
      p.payment_method?.toLowerCase().includes(search.toLowerCase()) ||
      p.razorpay_payment_id?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = payments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div>
      {/* Volt Header */}
      <div className="volt-page-header">
        <div>
          <div className="volt-breadcrumb">
            <Link to="/admin">Admin</Link>
            <FaChevronRight className="text-[10px]" />
            <span>Payments</span>
          </div>
          <div className="volt-page-title">
            <h1>Payment Records</h1>
            <p className="volt-page-subtitle">
              Audit completed financial transactions, Razorpay references, and revenue logs.
            </p>
          </div>
        </div>

        <div className="volt-action-btns">
          <div className="volt-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search user, event or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Financial Summary Stat Card */}
      <div className="volt-stat-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="volt-stat-card">
          <div className="volt-stat-header">
            <div className="volt-stat-icon-box">
              <FaRupeeSign />
            </div>
            <span className="volt-badge volt-badge--success">+100% Verified</span>
          </div>
          <div className="volt-stat-label">Total Revenue Processed</div>
          <div className="volt-stat-value">₹{totalAmount.toLocaleString()}</div>
        </div>

        <div className="volt-stat-card">
          <div className="volt-stat-header">
            <div className="volt-stat-icon-box">
              <FaCreditCard />
            </div>
            <span className="volt-badge volt-badge--brand">Razorpay API</span>
          </div>
          <div className="volt-stat-label">Successful Transactions</div>
          <div className="volt-stat-value">{payments.length}</div>
        </div>
      </div>

      {/* Volt Table Panel */}
      <div className="volt-panel">
        <div className="volt-panel-header">
          <div className="volt-panel-title">
            <FaCreditCard />
            <span>Transaction Logs ({filtered.length})</span>
          </div>
        </div>

        <div className="volt-table-container">
          {loading ? (
            <div className="volt-empty">Loading payment logs...</div>
          ) : (
            <table className="volt-table">
              <thead>
                <tr>
                  <th>Trans ID</th>
                  <th>Payer</th>
                  <th>Event</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const initial = p.user_name
                    ? p.user_name.charAt(0).toUpperCase()
                    : "P";
                  return (
                    <tr key={p.id}>
                      <td>
                        <span className="font-mono text-xs text-gray-400">#{p.id}</span>
                      </td>
                      <td>
                        <div className="volt-user-cell">
                          <div className="volt-avatar">{initial}</div>
                          <div>
                            <div className="volt-user-cell-name">{p.user_name}</div>
                            <div className="volt-user-cell-sub">
                              {p.razorpay_payment_id || "Direct Pay"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white font-medium">{p.event_title}</span>
                      </td>
                      <td className="text-white font-bold text-base">
                        ₹{Number(p.amount).toLocaleString()}
                      </td>
                      <td>
                        <span className="volt-badge volt-badge--info uppercase">
                          {p.payment_method || "Razorpay"}
                        </span>
                      </td>
                      <td>
                        <span className="volt-badge volt-badge--success flex items-center gap-1">
                          <FaCheckCircle /> {p.status}
                        </span>
                      </td>
                      <td>
                        <span className="text-gray-400 text-xs">
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="volt-empty">No payment logs found.</div>
          )}
        </div>
      </div>
    </div>
  );
}