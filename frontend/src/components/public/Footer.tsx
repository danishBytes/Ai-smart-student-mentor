"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const footerLinks = {
  Platform: [
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Student Stories", href: "/success-stories" },
  ],
  Resources: [
    { label: "Learning Resources", href: "/resources" },
    { label: "Contact Us", href: "/contact" },
    { label: "Login", href: "/login" },
    { label: "Get Started", href: "/register" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    // Resolve the year after hydration so static prerendering stays deterministic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="bg-[#21192b] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-8">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#79569e] font-serif text-xl text-white">
                t
              </div>

              <span className="text-xl font-extrabold">
                Trial<span className="text-violet-400">shopy</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Helping students understand their potential, build meaningful
              skills and make informed academic and career decisions through
              AI-powered mentorship.
            </p>

            <Link
              href="/register"
              className="mt-6 inline-flex rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
            >
              Start Your Journey
            </Link>
          </div>

          {/* Navigation */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-bold text-white">{heading}</h3>

              <ul className="mt-5 space-y-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-violet-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            {/* Using the state here with a fallback while it loads */}
            © {currentYear ?? "2026"} Trialshopy. All rights reserved.
          </p>

          <p>Built to support every student&apos;s journey.</p>
        </div>
      </div>
    </footer>
  );
}




