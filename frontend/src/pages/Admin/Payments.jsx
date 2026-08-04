import { useEffect, useState } from "react";
import { getPayments } from "../../services/paymentService";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getPayments().then(({ data }) => setPayments(data));
  }, []);

  return (
    <div className="organizer-page">
      <header className="organizer-page__header">
        <div>
          <p className="section-label">Admin</p>
          <h1 className="organizer-page__title">Payment records</h1>
          <p className="organizer-page__subtitle">Completed transactions and Razorpay references across events.</p>
        </div>
      </header>

      <div className="organizer-table-panel">
        <table className="organizer-data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Event</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="text-gray-500">#{p.id}</td>
                <td className="text-white">{p.user_name}</td>
                <td>{p.event_title}</td>
                <td className="text-white font-semibold">₹{p.amount}</td>
                <td className="capitalize">{p.payment_method}</td>
                <td>
                  <span className="organizer-badge organizer-badge--green">{p.status}</span>
                </td>
                <td className="text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="organizer-empty">No payment records yet.</p>}
      </div>
    </div>
  );
}
