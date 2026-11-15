"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";
import "./../auth.css";

interface RegisterResponse {
  message: string;
  email: string;
  is_verified: boolean;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    role?: string;
  };
}

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (cleanName.length < 2 || cleanName.length > 100) {
      setMessage("Name must be between 2 and 100 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setMessage("Password must be between 8 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest<RegisterResponse>(
        "/api/v1/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            full_name: cleanName,
            email: cleanEmail,
            password,
          }),
        }
      );

      setSuccess(true);
      setMessage(
        response.message || "Account created! Please verify your email."
      );

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push(
          `/verify-email?email=${encodeURIComponent(response.email || cleanEmail)}`
        );
      }, 2000);

    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";

      if (
        errorMessage.toLowerCase().includes("already registered") ||
        errorMessage.toLowerCase().includes("already exists")
      ) {
        setMessage(
          "This email is already registered. Please login or reset your password."
        );
      } else {
        setMessage(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  // --- GOOGLE SIGN-IN HANDLER ---
  async function handleGoogleAuth(credential: string) {
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const data = await apiRequest<LoginResponse>(
        "/api/v1/auth/google",
        {
          method: "POST",
          body: JSON.stringify({ id_token: credential }),
        }
      );

      // Save tokens to sessionStorage
      sessionStorage.setItem("access_token", data.access_token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to Home page
      router.push("/");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Google registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-layout register-layout">
        <section className="auth-welcome">
          <div className="auth-welcome-content">
            <div className="auth-brand">
              <div className="brand-mark">T</div>
              <span className="brand-name">Trialshopy</span>
            </div>

            <h1>WELCOME!</h1>
            <p>
              We&apos;re delighted to have you here.
              Your journey towards smarter learning
              and a brighter future starts with us.
            </p>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form">

            {/* Success UI */}
            {success ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    className="animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </div>

                <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                  Redirecting...
                </h2>

                <p className="auth-message success" style={{ marginTop: 0 }}>
                  {message}
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegister}>
                <h2>Register</h2>

                <p className="auth-subtitle">
                  Create your account and start your journey.
                </p>

                <div className="auth-field">
                  <label htmlFor="fullName">Username</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </div>

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
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="password">Password</label>

                  <div className="password-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      maxLength={128}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="auth-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>

                  <div className="password-wrap">
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <button className="auth-button" type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Register"}
                </button>

                {message && (
                  <p className="auth-message" role="alert" style={{ marginTop: "12px" }}>
                    {message}

                    {message.toLowerCase().includes("already registered") && (
                      <>
                        {" "}
                        <Link href="/login">Sign In</Link>
                        {" | "}
                        <Link href="/forgot-password">Forgot Password?</Link>
                      </>
                    )}
                  </p>
                )}

                {/* ================= GOOGLE SIGN UP CUSTOM BUTTON ================= */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    margin: "22px 0",
                    color: "#817791",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.5px"
                  }}
                >
                  <span style={{ flex: 1, height: "1px", background: "#2D2440" }} />
                  OR SIGN UP WITH
                  <span style={{ flex: 1, height: "1px", background: "#2D2440" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      if (credentialResponse.credential) {
                        handleGoogleAuth(credentialResponse.credential);
                      } else {
                        setMessage("Google did not return an ID token.");
                      }
                    }}
                    onError={() => {
                      setMessage("Google Sign-In failed. Please try again.");
                    }}
                    type="standard"
                    theme="filled_black"
                    size="large"
                    shape="rectangular"
                    text="continue_with"
                    width={320}
                  /></div>

                <div className="auth-switch" style={{ marginTop: "24px" }}>
                  Already have an account?
                  <br />
                  <Link href="/login">Sign In</Link>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

