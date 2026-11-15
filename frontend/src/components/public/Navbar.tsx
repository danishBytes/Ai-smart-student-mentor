"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpenCheck, Menu, X } from "lucide-react";

interface User {
  full_name: string;
  email?: string;
  role?: string;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Platform", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Refs to track values without triggering re-renders inside scroll event
  const lastScrollY = useRef(0);
  const isVisibleRef = useRef(true);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser =
      sessionStorage.getItem("user") || localStorage.getItem("user");

    if (storedUser) {
      try {
        // Browser storage is only available after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Unable to read user information");
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- BULLETPROOF SCROLL LOGIC ---
  useEffect(() => {
    // Sync ref with state initially
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we are at the very top, always show
      if (currentScrollY < 50) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
        return;
      }

      const difference = currentScrollY - lastScrollY.current;

      // Scrolling Down -> Hide
      if (difference > 5) {
        if (isVisibleRef.current) {
          isVisibleRef.current = false;
          setIsVisible(false);
          setMenuOpen(false);
          setMobileOpen(false);
        }
        lastScrollY.current = currentScrollY;
      } 
      // Scrolling Up -> Show
      else if (difference < -5) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getDashboardLink = () => {
    const role = user?.role?.toLowerCase();
    if (role === "super_admin") return "/super-admin/dashboard";
    if (role === "admin") return "/admin/dashboard";
    return "/dashboard";
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.trim()
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U"
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full border-b border-violet-100/70 bg-white/90 backdrop-blur-xl transition-transform duration-300 ease-in-out will-change-transform ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-10">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Trialshopy home">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#6f4a92] text-white shadow-[0_8px_18px_-9px_rgba(79,48,107,.7)] transition group-hover:rotate-[-4deg] group-hover:scale-105">
            <BookOpenCheck size={20} strokeWidth={1.8} />
          </div>
          <span className="text-[19px] font-semibold tracking-[-.055em] text-[#30283a]">
            Trial<span className="text-[#79569e]">shopy</span>
            <small className="mt-[-1px] block text-[9px] font-medium uppercase tracking-[.19em] text-[#8c8492]">Student mentorship</small>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-[13px] font-semibold text-slate-600 transition hover:text-violet-700">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden items-center gap-4 xl:flex" ref={menuRef}>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full border border-violet-100 p-1.5 pr-3 transition hover:bg-violet-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800">
                  {getInitials(user.full_name)}
                </div>
                <span className="max-w-28 truncate text-sm font-semibold text-slate-700">
                  {user.full_name}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-900/10">
                  <div className="border-b border-slate-100 px-3 py-3">
                    <p className="truncate text-sm font-bold text-slate-900">{user.full_name}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-violet-700">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-violet-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-800"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl border border-[#e7e1eb] p-2.5 text-[#574a63] transition hover:bg-[#f7f3fa] xl:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-[#eee8f2] bg-white px-5 py-5 shadow-xl xl:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-700"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl bg-violet-700 px-4 py-3 text-center text-sm font-bold text-white"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold">
                  Login
                </Link>
                <Link href="/register" className="flex-1 rounded-xl bg-violet-700 px-4 py-3 text-center text-sm font-bold text-white">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
