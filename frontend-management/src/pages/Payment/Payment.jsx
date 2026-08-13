import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiShieldCheck, HiCreditCard, HiLockClosed, HiCalendar, HiTicket } from "react-icons/hi";
import { getRegistration } from "../../services/registrationService";
import { createOrder, verifyPayment } from "../../services/paymentService";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Payment() {
  const { registrationId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getRegistration(registrationId)
      .then(({ data }) => setRegistration(data))
      .catch(() => navigate("/events"));
  }, [registrationId, navigate]);

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError("");

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setError("Razorpay SDK failed to load. Please check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await createOrder(Number(registrationId));

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "RunCrew Marathon",
        description: `Registration for ${data.event}`,
        order_id: data.order_id,
        handler: async function (response) {
          setLoading(true);
          try {
            await verifyPayment({
              payment_id: data.payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setLoading(false);
            navigate(`/payment/confirmation/${data.payment_id}`);
          } catch (err) {
            setLoading(false);
            setError(
              err.response?.data?.error || "Payment verification failed. Please contact support."
            );
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        prefill: {
          name: registration?.full_name || registration?.user_name || "",
          email: registration?.email || registration?.user_email || "",
          contact: registration?.phone || "",
        },
        theme: {
          color: "#FA5A2A",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(response.error.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.error || err.response?.data?.detail || "Failed to initialize Razorpay payment"
      );
    }
  };

  if (!registration) {
    return (
      <div className="loading-center min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="loading-spinner" />
        <p className="text-gray-400 text-sm">Preparing checkout session...</p>
      </div>
    );
  }

  return (
    <div className="participant-page py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f15a24]/10 border border-[#f15a24]/30 text-[#f15a24] text-xs font-bold uppercase tracking-wider">
            <HiShieldCheck className="text-base" /> Razorpay 256-Bit Secure Checkout
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Race Entry Checkout
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Complete your registration using Cards, UPI, NetBanking, or Wallets.
          </p>
        </div>

        {/* Event Summary Box */}
        <div className="bg-[#12141d] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f15a24]/15 border border-[#f15a24]/30 text-[#f15a24] text-xs font-bold font-mono">
              <HiTicket /> BIB: {registration.bib_number || "BIB-ASSIGNED"}
            </div>
            <h3 className="font-display text-xl font-bold text-white mt-1">
              {registration.event_title}
            </h3>
            <p className="text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
              <HiCalendar className="text-gray-500" /> Event Date: {registration.event_date}
            </p>
          </div>

          <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8 shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Total Entry Fee</p>
            <p className="font-display text-3xl text-[#f15a24] font-extrabold mt-0.5">
              ₹{registration.event_fees}
            </p>
          </div>
        </div>

        {/* Payment Action Panel */}
        <div className="bg-[#12141d] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f15a24]/20 to-[#f15a24]/5 border border-[#f15a24]/30 text-[#f15a24] flex items-center justify-center text-3xl shadow-lg shadow-[#f15a24]/10">
              <HiCreditCard />
            </div>
            <h2 className="font-display text-xl font-bold text-white">Instant Payment Authorization</h2>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              Clicking below will launch the official Razorpay gateway. Upon successful payment, your entry pass and bib confirmation will be issued immediately.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm p-4 flex items-center gap-3 text-left">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
              {error}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleRazorpayPayment}
              disabled={loading}
              className="w-full h-14 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f15a24] to-[#d04313] text-white font-bold text-base uppercase tracking-wider shadow-lg shadow-[#f15a24]/25 hover:shadow-xl hover:shadow-[#f15a24]/35 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <HiLockClosed className="text-xl" />
              {loading ? "Launching Gateway..." : `Pay ₹${registration.event_fees} Now`}
            </button>

            <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <HiShieldCheck className="text-emerald-400 text-sm" /> 100% Encrypted & Safe Payment Gateway
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
