import React, { useState, useEffect, useContext } from "react";
import { X, CheckCircle, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../context/ToastContext";

export default function ResetPasswordPage() {
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const API_BASE = "http://localhost:4000/api/auth"; // Replace with your full API path

  // Timer for OTP
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, step]);

  const handleRequestCode = async () => {
    if (!email) return setError("Email is required.");
    setLoading(true);
    setError("");
    setMessage("");
    setCanResend(false);
    setTimer(60);

    try {
      const res = await fetch(`${API_BASE}/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return setError("Code is required.");
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/password-reset/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setMessage(data.message);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return setError("Please fill in all fields.");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/password-reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage(data.message);
      showToast(`${message}`, "success");

      navigate("/login");
      setStep(1);
      setEmail("");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    handleRequestCode();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reset Password</h1>

      {error && (
        <div className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded mb-4 w-full max-w-md">
          <X className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {message && (
        <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded mb-4 w-full max-w-md">
          <CheckCircle className="w-5 h-5 mr-2" />
          {message}
        </div>
      )}

      {/* Step 1: Request Code */}
      {step === 1 && (
        <div className="space-y-4 w-full max-w-md">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Email</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Mail className="w-5 h-5 mx-2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleRequestCode}
            disabled={loading}
            className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-800 transition-colors"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </div>
      )}

      {/* Step 2: Verify Code */}
      {step === 2 && (
        <div className="space-y-4 w-full max-w-md">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Verification Code
            </label>
            <input
              type="text"
              placeholder="Enter the code sent to your email"
              className="w-full border p-2 rounded-lg outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Expires in: {timer}s</span>
            {canResend && (
              <button
                className="text-indigo-700 hover:underline"
                onClick={handleResend}
              >
                Resend Code
              </button>
            )}
          </div>
          <button
            onClick={handleVerifyCode}
            disabled={loading}
            className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-800 transition-colors"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </div>
      )}

      {/* Step 3: Reset Password */}
      {step === 3 && (
        <div className="space-y-4 w-full max-w-md">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              New Password
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Lock className="w-5 h-5 mx-2 text-gray-400" />
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full p-2 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Lock className="w-5 h-5 mx-2 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full p-2 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-800 transition-colors"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}

      <p className="text-gray-500 text-sm text-center mt-6">
        Remember your password?{" "}
        <span
          className="text-indigo-700 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
