"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";
import "./../auth.css";

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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setSuccess(true);
      setMessage("Email verified successfully! You can now login.");
    } else if (searchParams.get("registered") === "true") {
      setSuccess(true);
      setMessage("Account created! Please verify your email before logging in.");
    }
  }, [searchParams]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest<LoginResponse>(
        "/api/v1/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        }
      );

      // Clear previous session from both storage locations
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user");

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("access_token", data.access_token);
      storage.setItem("user", JSON.stringify(data.user));

      // Redirect all users to the Home page
      router.push("/");

    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin(credential: string) {
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const data = await apiRequest<LoginResponse>(
        "/api/v1/auth/google",
        {
          method: "POST",
          body: JSON.stringify({
            id_token: credential,
          }),
        }
      );

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user");

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("access_token", data.access_token);
      storage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2>Login</h2>

      <p className="auth-subtitle">
        Enter your credentials to access your account.
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
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password">Password</label>

        <div className="password-wrap">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
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

      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-transparent"
          />
          <span className="text-sm text-slate-300">Remember me</span>
        </label>

        <Link
          href="/forgot-password"
          className="text-sm text-[#A78BFA] hover:text-white transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </button>

      {/* ================= GOOGLE LOGIN CUSTOM BUTTON ================= */}
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
        OR CONTINUE WITH
        <span style={{ flex: 1, height: "1px", background: "#2D2440" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              handleGoogleLogin(credentialResponse.credential);
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

      {message && (
        <p
          role="alert"
          className={`auth-message ${success ? "success" : ""}`}
          style={{ marginTop: "12px" }}
        >
          {message}
        </p>
      )}

      <div className="auth-switch" style={{ marginTop: "24px" }}>
        Don&apos;t have an account?
        <br />
        <Link href="/register">Create Account</Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-layout login-layout">
        <section className="auth-welcome">
          <div className="auth-welcome-content">
            <div className="auth-brand">
              <div className="brand-mark">T</div>
              <span className="brand-name">Trialshopy</span>
            </div>

            <h1>WELCOME BACK!</h1>

            <p>
              Your learning journey continues here.
              Sign in to explore your personalized
              AI mentor and academic roadmap.
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
                <p style={{ color: "#AFA5C3", fontSize: "15px" }}>
                  Loading...
                </p>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

