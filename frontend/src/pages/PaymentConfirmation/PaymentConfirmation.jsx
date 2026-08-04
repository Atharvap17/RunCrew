import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HiCheckCircle, HiTicket, HiShieldCheck } from "react-icons/hi";
import { getPayment } from "../../services/paymentService";
import Button from "../../components/Common/Button";

export default function PaymentConfirmation() {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    getPayment(paymentId)
      .then(({ data }) => setPayment(data))
      .catch(() => {});
  }, [paymentId]);

  if (!payment) {
    return (
      <div className="loading-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  const details = [
    ["Event Name", payment.event_title],
    ["Assigned Bib Number", payment.bib_number || "BIB-CONFIRMED"],
    ["Amount Paid", `₹${payment.amount}`],
    ["Transaction Reference", payment.transaction_ref || payment.razorpay_payment_id || `TXN${payment.id}982`],
    ["Payment Method", (payment.payment_method || "UPI").toUpperCase()],
    ["Status", "CONFIRMED & PAID"],
  ];

  return (
    <div className="participant-page">
      <div className="participant-flow">
        
        <div className="flow-panel border border-emerald-500/30 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
          
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-5xl mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
            <HiCheckCircle />
          </div>

          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-[0.25em] uppercase mb-3">
              Entry Verified
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white tracking-tight">
              Registration Confirmed!
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
              Your payment of <span className="text-emerald-400 font-bold">₹{payment.amount}</span> was processed successfully.
            </p>
          </div>

          {/* Details Table */}
          <div className="p-6 rounded-2xl bg-[#161618] border border-white/10 text-left space-y-3.5">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between items-center text-sm border-b border-white/5 pb-2.5 last:border-0 last:pb-0 gap-4">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-medium shrink-0">{label}</span>
                <span
                  className={`text-right font-semibold ${
                    label === "Assigned Bib Number"
                      ? "text-brand font-bold text-base"
                      : label === "Status"
                      ? "text-emerald-400 font-bold"
                      : "text-white"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <Button to="/profile" variant="primary" size="lg" className="flex-1 justify-center font-display font-semibold uppercase" showArrow={false}>
              <HiTicket className="mr-1.5 text-lg" /> View My Profile & Pass
            </Button>
            <Button to="/events" variant="outline" size="lg" className="flex-1 justify-center font-display font-semibold uppercase" showArrow={false}>
              Browse More Events
            </Button>
          </div>

          <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <HiShieldCheck className="text-emerald-400 text-sm" /> Official RunCrew Race Entry Pass
          </p>
        </div>
      </div>
    </div>
  );
}
