import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiShieldCheck, HiCreditCard, HiLockClosed } from "react-icons/hi";
import { getRegistration } from "../../services/registrationService";
import { createOrder, verifyPayment } from "../../services/paymentService";
import Button from "../../components/Common/Button";

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
      <div className="loading-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="participant-page">
      <div className="participant-flow">
        
        <div className="participant-flow__header">
          <span className="flow-kicker">
            Razorpay Secure Gateway
          </span>
          <h1>Race entry payment</h1>
          <p>
            Complete your registration using Razorpay (Cards, UPI, NetBanking, Wallets).
          </p>
        </div>

        <div className="flow-panel flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-brand text-xs font-bold uppercase tracking-widest bg-brand/15 px-3 py-1 rounded-md">
              Bib Assigned: {registration.bib_number || "BIB-PENDING"}
            </span>
            <h3 className="font-display text-2xl text-white mt-2">{registration.event_title}</h3>
            <p className="text-xs text-gray-400">Date: {registration.event_date}</p>
          </div>
          <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8 shrink-0">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Total Amount</p>
            <p className="font-display text-4xl text-brand font-bold mt-1">₹{registration.event_fees}</p>
          </div>
        </div>

        <div className="flow-panel flex flex-col gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand text-3xl">
              <HiCreditCard />
            </div>
            <h2 className="font-display text-2xl text-white">Razorpay Secure Checkout</h2>
            <p className="text-xs text-gray-400 max-w-md">
              Click below to launch Razorpay modal. You can pay via UPI, Credit/Debit Cards, NetBanking, or Wallets with end-to-end encryption.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm px-5 py-4 flex items-center gap-3 text-left">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
              {error}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-4">
            <Button
              type="button"
              onClick={handleRazorpayPayment}
              variant="primary"
              size="lg"
              className="w-full h-14 justify-center font-display font-semibold tracking-wider text-base uppercase shadow-xl shadow-brand/25"
              disabled={loading}
              showArrow={false}
            >
              <HiLockClosed className="text-lg mr-2" />
              {loading ? "Initializing Razorpay..." : `Pay ₹${registration.event_fees} via Razorpay`}
            </Button>

            <p className="text-xs text-gray-400 flex items-center justify-center gap-2 mt-2">
              <HiShieldCheck className="text-brand text-base" /> Secured by Razorpay 256-Bit Encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

