
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import "./../auth.css";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleForgotPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    const cleanEmail = email.trim().toLowerCase();

    try {
      await apiRequest("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email: cleanEmail,
        }),
      });

      setSuccess(true);
      setMessage(
        "A 6-digit password reset OTP has been sent to your registered email."
      );

      // Redirect to OTP and password reset page
      router.push(
        `/reset-password?email=${encodeURIComponent(cleanEmail)}`
      );

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to send reset OTP. Please try again."
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

            <h1>RECOVER ACCOUNT</h1>
            <p>
              Don&apos;t worry, it happens to the best of us.
              Enter your email and we&apos;ll send you a
              verification code to reset your password.
            </p>
          </div>
        </section>

        <section className="auth-form-panel">
          <form className="auth-form" onSubmit={handleForgotPassword}>
            <h2>Forgot Password</h2>

            <p className="auth-subtitle">
              Enter your registered email address to receive a 6-digit OTP.
            </p>

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send Reset OTP"}
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
