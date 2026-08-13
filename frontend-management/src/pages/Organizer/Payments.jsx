import { useEffect, useState } from "react";
import { getPayments } from "../../services/paymentService";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);
    setError("");
    try {
      const { data } = await getPayments();
      setPayments(data);
    } catch (err) {
      setError("Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="organizer-page">
        <div className="organizer-page__header">
          <div>
          <p className="section-label">Organizer</p>
          <h1 className="organizer-page__title">Payments</h1>
          <p className="organizer-page__subtitle">Track payment confirmations and review completed runner transactions for your events.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="organizer-table-panel">
          <table className="organizer-data-table">
            <thead>
              <tr>
                <th className="px-4 py-4">Payment</th>
                <th className="px-4 py-4">Runner</th>
                <th className="px-4 py-4">Event</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Method</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">No payment records found.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-4 text-gray-300">#{payment.id}</td>
                    <td className="px-4 py-4 text-white">{payment.user_name}</td>
                    <td className="px-4 py-4 text-gray-300">{payment.event_title}</td>
                    <td className="px-4 py-4 font-semibold text-white">₹{payment.amount}</td>
                    <td className="px-4 py-4 capitalize text-gray-300">{payment.payment_method}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        payment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400">{new Date(payment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}
