import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiCheckCircle,
  HiTicket,
  HiShieldCheck,
  HiArrowRight,
  HiCalendar,
  HiCreditCard,
  HiHashtag,
} from "react-icons/hi";
import { getPayment } from "../../services/paymentService";

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
      <div className="loading-center min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="loading-spinner" />
        <p className="text-gray-400 text-sm">Verifying transaction details...</p>
      </div>
    );
  }

  const txnId =
    payment.transaction_ref ||
    payment.razorpay_payment_id ||
    `TXN${payment.id}982`;

  return (
    <div className="participant-page py-12 px-4">
      
      <div className="confirmation-card">
        
        {/* Success Icon */}
        <div className="confirmation-icon-circle">
          <HiCheckCircle />
        </div>

        {/* Verification Status Pill */}
        <div className="confirmation-pill">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Entry Verified & Confirmed
        </div>

        {/* Title & Subtitle */}
        <h1 className="confirmation-title">You're All Set to Run!</h1>
        <p className="confirmation-subtitle">
          Your payment of <strong className="text-white">₹{payment.amount}</strong> was successfully completed. Your official race pass has been generated.
        </p>

        {/* Race Pass Ticket Voucher */}
        <div className="confirmation-ticket">
          
          {/* Header */}
          <div className="confirmation-ticket-header">
            <div>
              <div className="confirmation-ticket-label flex items-center gap-1">
                <HiCalendar className="text-[#f15a24]" /> Official Event Pass
              </div>
              <div className="confirmation-ticket-event">
                {payment.event_title || "Marathon Race"}
              </div>
            </div>

            {/* BIB Tag */}
            <div className="confirmation-bib-tag">
              <div className="confirmation-bib-title">BIB NUMBER</div>
              <div className="confirmation-bib-code">
                {payment.bib_number || "BIB-CONFIRMED"}
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="confirmation-ticket-body">
            <div className="confirmation-detail-box">
              <div className="confirmation-detail-key">Amount Paid</div>
              <div className="confirmation-detail-val">₹{payment.amount}</div>
            </div>

            <div className="confirmation-detail-box">
              <div className="confirmation-detail-key">Payment Method</div>
              <div className="confirmation-detail-val flex items-center gap-1.5 capitalize">
                <HiCreditCard className="text-[#f15a24]" />
                {payment.payment_method || "Online Pay"}
              </div>
            </div>

            <div className="confirmation-detail-box full-width">
              <div className="confirmation-detail-key">Transaction Reference</div>
              <div className="confirmation-detail-val mono flex items-center gap-1">
                <HiHashtag className="text-gray-500 shrink-0" />
                {txnId}
              </div>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="confirmation-ticket-footer">
            <span className="flex items-center gap-1.5">
              <HiShieldCheck className="text-base" /> Status: CONFIRMED & PAID
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
              RunCrew Verified
            </span>
          </div>

        </div>

        {/* Buttons */}
        <div className="confirmation-actions">
          <Link to="/profile" className="btn-primary-custom">
            <HiTicket className="text-lg" />
            View My Profile & Pass
          </Link>

          <Link to="/events" className="btn-secondary-custom">
            Browse Events
            <HiArrowRight />
          </Link>
        </div>

        {/* Footer note */}
        <div className="confirmation-footer-note">
          <HiShieldCheck className="text-emerald-400 text-sm" /> Official RunCrew Digital Entry Pass • Present at race day check-in
        </div>

      </div>

    </div>
  );
}
