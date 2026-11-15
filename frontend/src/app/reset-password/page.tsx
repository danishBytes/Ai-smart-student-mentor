
"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import "./../auth.css";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
  }, []);

  async function handleResetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!/^[0-9]{6}$/.test(otp)) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      setMessage("Password must be between 8 and 128 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword,
        }),
      });

      setSuccess(true);
      setMessage("Password reset successfully! Redirecting to login...");

      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-layout login-layout">
        <section className="auth-welcome">
          <div className="auth-welcome-content">
            <div className="auth-brand">
              <div className="brand-mark">T</div>
              <span className="brand-name">Trialshopy</span>
            </div>

            <h1>NEW PASSWORD</h1>
            <p>
              Secure your account with a new password.
              Verify your email and get back to your
              personalized learning journey.
            </p>
          </div>
        </section>

        <section className="auth-form-panel">
          <form className="auth-form" onSubmit={handleResetPassword}>
            <h2>Reset Password</h2>

            <p className="auth-subtitle">
              Enter the OTP sent to your email and create a new password.
            </p>

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
              />
            </div>

            <div className="auth-field">
              <label htmlFor="otp">6-Digit OTP</label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter your OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading || success || !email}
            >
              {loading
                ? "Resetting Password..."
                : success
                  ? "Password Updated!"
                  : "Reset Password"}
            </button>

            {message && (
              <p className={`auth-message ${success ? "success" : ""}`}>
                {message}
              </p>
            )}

            <div className="auth-switch">
              Remember your password?
              <br />
              <Link href="/login">Back to Login</Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
