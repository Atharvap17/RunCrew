import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRunning } from "react-icons/fa";
import { forgotPassword, verifyOTP, resetPassword } from "../../services/authService";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await forgotPassword(email);
      setMessage(data.message);
      setStep(2);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await verifyOTP(email, otp);
      setResetToken(data.reset_token);
      setStep(3);
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await resetPassword({ email, reset_token: resetToken, new_password: newPassword });
      setMessage("Password reset successfully! You can now login.");
      setStep(4);
    } catch {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["", "Enter Email", "Verify OTP", "New Password", "Done"];

  return (
    <div className="auth-page">
      <div className="auth-page__visual auth-page__visual--login">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent" />
        <div className="auth-page__visual-content">
          <span className="inline-block px-3.5 py-1 rounded-full bg-brand/20 border border-brand/40 text-brand text-xs font-bold tracking-[0.25em] uppercase mb-6">
            Account Recovery
          </span>
          <h1 className="font-display text-4xl lg:text-6xl text-white leading-tight tracking-tight">
            Reset your<br />password.
          </h1>
          <p className="mt-6 max-w-lg text-sm lg:text-base text-gray-300 leading-relaxed">
            Follow the quick steps to receive an OTP and regain access to your RunCrew account securely.
          </p>
        </div>
      </div>

      <div className="auth-page__form-side">
        <div className="auth-card fade-in">
          <Link to="/" className="auth-brand group">
            <span className="w-11 h-11 rounded-xl bg-brand flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <FaRunning className="text-xl" />
            </span>
            <div>
              <span className="font-display text-2xl text-white tracking-wide block">RunCrew</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 block -mt-1">Marathon Platform</span>
            </div>
          </Link>

          <div className="auth-card__heading mt-6 mb-6">
            <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight">
              Reset Password
            </h2>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Step {step} of 3 — {stepLabels[step]}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {message && step !== 4 && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm px-4 py-3.5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm px-4 py-3.5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSendOTP} className="flex flex-col gap-5">
                <Input center label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" variant="primary" size="lg" className="w-full h-12 justify-center font-display font-semibold tracking-wider text-sm uppercase" disabled={loading} showArrow={false}>
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5">
                <Input center label="Enter OTP" placeholder="6-digit OTP code" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                <Button type="submit" variant="primary" size="lg" className="w-full h-12 justify-center font-display font-semibold tracking-wider text-sm uppercase" disabled={loading} showArrow={false}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleReset} className="flex flex-col gap-5">
                <Input center label="New Password" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <Button type="submit" variant="primary" size="lg" className="w-full h-12 justify-center font-display font-semibold tracking-wider text-sm uppercase" disabled={loading} showArrow={false}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}

            {step === 4 && (
              <div className="text-center flex flex-col gap-5">
                <p className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm px-4 py-3.5">{message}</p>
                <Button to="/login" variant="primary" size="lg" className="w-full h-12 justify-center font-display font-semibold tracking-wider text-sm uppercase" showArrow={false}>
                  Go to Login
                </Button>
              </div>
            )}
          </div>

          <p className="auth-switch mt-6">
            Remember your password?{" "}
            <Link to="/login" className="text-brand hover:underline font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
