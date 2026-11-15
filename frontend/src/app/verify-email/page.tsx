
"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import "./../auth.css";

interface VerifyEmailResponse {
  message: string;
  is_verified?: boolean;
}

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest<VerifyEmailResponse>(
        "/api/v1/auth/verify-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: cleanEmail,
            otp: otp,
          }),
        }
      );

      setSuccess(true);
      setMessage(response.message || "Email verified successfully!");

      setTimeout(() => {
        router.push("/login?verified=true");
      }, 2000);

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Email verification failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOTP() {
    setMessage("");
    setSuccess(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setResending(true);

      const response = await apiRequest<{ message: string }>(
        "/api/v1/auth/resend-otp",
        {
          method: "POST",
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      setMessage(response.message || "A new OTP has been sent to your email.");

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleVerify}>
      <h2>Verify Your Email</h2>

      <p className="auth-subtitle">
        We have sent a 6-digit verification code to your email address.
        Enter the code below to activate your account.
      </p>

      <div className="auth-field">
        <label htmlFor="email">Email Address</label>

        <input
          id="email"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="otp">Verification Code</label>

        <input
          id="otp"
          type="text"
          inputMode="numeric"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          maxLength={6}
          autoComplete="one-time-code"
          required
        />
      </div>

      <button
        className="auth-button"
        type="submit"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      {message && (
        <p
          role="status"
          className={`auth-message ${success ? "success" : ""}`}
        >
          {message}
        </p>
      )}

      <div className="auth-switch">
        Didn&apos;t receive the OTP?
        <br />

        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resending || loading}
          style={{
            background: "none",
            border: "none",
            color: "#A78BFA",
            cursor: "pointer",
            marginTop: "8px",
            fontWeight: 600,
          }}
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </div>

      <div className="auth-switch">
        Already verified?
        <br />
        <Link href="/login">Sign In</Link>
      </div>
    </form>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="auth-page">
      <div className="auth-layout login-layout">
        <section className="auth-welcome">
          <div className="auth-welcome-content">
            <div className="auth-brand">
              <div className="brand-mark">T</div>
              <span className="brand-name">Trialshopy</span>
            </div>

            <h1>ONE LAST STEP!</h1>

            <p>
              Verify your email address to activate your
              Trialshopy account and begin your personalized
              AI-powered learning journey.
            </p>
          </div>
        </section>

        <section className="auth-form-panel">
          <Suspense
            fallback={
              <div
                className="auth-form"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                }}
              >
                <p style={{ color: "#AFA5C3" }}>Loading...</p>
              </div>
            }
          >
            <VerifyEmailForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
