"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Library,
  CalendarDays,
  Bot,
  BarChart3,
  CircleHelp,
  LogOut,
  Plus,
  Search,
  Bell,
  Settings,
  Clock3,
  Star,
  Calculator,
  Languages,
  Code2,
  Sparkles,
  FileText,
  WandSparkles,
  Brain,
  ArrowRight,
  Flame,
  Menu,
  X,
  BookOpen,
  Target,
  MessageCircle,
} from "lucide-react";

type Student = {
  id?: string;
  full_name?: string;
  email?: string;
  role?: string;
};

const assignments = [
  {
    id: 1,
    title: "Python Programming Fundamentals",
    subtitle: "Due in 2 days · Module 4",
    progress: 60,
    icon: Code2,
    color: "purple",
  },
  {
    id: 2,
    title: "Database Management Practice",
    subtitle: "Due in 5 days · Unit 7",
    progress: 0,
    icon: Brain,
    color: "blue",
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    subtitle: "Due tomorrow · Learning Project",
    progress: 90,
    icon: BookOpen,
    color: "yellow",
  },
];

const sidebarItems = [
  { label: "Home", icon: Home, href: "#top" },
  { label: "My Library", icon: Library, href: "#library" },
  { label: "Lesson Planner", icon: CalendarDays, href: "#roadmap" },
  { label: "AI Tutor", icon: Bot, href: "#ai-tutor" },
  { label: "Analytics", icon: BarChart3, href: "#analytics" },
];

export default function StudentDashboard() {
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Sidebar state (Desktop: true = open, false = closed. Mobile: true = open, false = closed)
  const [menuOpen, setMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeItem, setActiveItem] = useState("Home");

  // Handle Screen Size (To differentiate Mobile vs Desktop)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    
    // Initial check
    checkMobile();
    setMenuOpen(window.innerWidth >= 1024); // Default: Open on desktop, Closed on mobile

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    try {
      setStudent(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) =>
      assignment.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const initials = student?.full_name
    ? student.full_name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "S";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    router.replace("/");
  };

  if (loading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8ff]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          <p className="mt-4 text-sm text-gray-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9fd] text-[#302344]" id="top">
      
      {/* Mobile Sidebar Overlay */}
      {menuOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[255px] flex-col border-r border-[#eee8f5] bg-white px-6 py-7 shadow-sm transition-all duration-300 ease-in-out 
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${!menuOpen ? "lg:w-0 lg:px-0 lg:py-0 lg:border-none lg:overflow-hidden" : "lg:w-[255px]"}
        `}
      >
        {/* Inner wrapper to prevent squishing during animation */}
        <div className="flex h-full w-[207px] flex-col">
          
          {/* Brand */}
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-purple-200">
                <BookOpen size={23} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-purple-700">
                  Trialshopy
                </h1>
                <p className="text-[9px] font-bold tracking-[2px] text-gray-500 whitespace-nowrap">
                  AI STUDENT MENTOR
                </p>
              </div>
            </div>
            {/* Close button (Mobile only) */}
            <button
              onClick={() => setMenuOpen(false)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setActiveItem(item.label);
                    if (isMobile) setMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition whitespace-nowrap ${
                    isActive
                      ? "bg-purple-50 text-purple-700"
                      : "text-[#655873] hover:bg-purple-50 hover:text-purple-700"
                  }`}
                >
                  <Icon size={19} className="shrink-0" />
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Sidebar Bottom */}
          <div className="mt-auto space-y-4">
            <button
              onClick={() => {
                document
                  .getElementById("roadmap")
                  ?.scrollIntoView({ behavior: "smooth" });
                if (isMobile) setMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-700 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5"
            >
              <Plus size={19} className="shrink-0" />
              <span className="whitespace-nowrap">Create Goal</span>
            </button>

            <div className="border-t border-gray-100 pt-5">
              <button className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-[#655873] hover:bg-purple-50">
                <CircleHelp size={19} className="shrink-0" />
                Help Center
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-[#655873] hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={19} className="shrink-0" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          menuOpen ? "lg:ml-[255px]" : "lg:ml-0"
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#eee8f5] bg-white/95 px-5 backdrop-blur-md sm:px-8 lg:px-9">
          
          <div className="flex items-center gap-4">
            {/* Hamburger Button (Works on Desktop & Mobile) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 text-[#655873] transition hover:bg-purple-50"
              aria-label={menuOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              {menuOpen ? <Menu size={22} /> : <Menu size={22} />}
              {/* Note: Aap chaho toh menuOpen ? <X/> : <Menu/> bhi kar sakte ho, par desktop pe Menu hi acha lagta hai */}
            </button>

            <h2 className="text-xl font-extrabold tracking-tight text-purple-700 sm:text-2xl hidden sm:block">
              Trialshopy
            </h2>

            <nav className="ml-5 hidden items-center gap-8 text-sm font-medium text-[#655873] md:flex">
              <a href="#top" className="border-b-2 border-purple-600 py-7 font-bold text-purple-700">
                Dashboard
              </a>
              <a href="#library" className="hover:text-purple-700">
                Resources
              </a>
              <a href="#community" className="hover:text-purple-700">
                Community
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative hidden w-48 lg:block xl:w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500"
              />
              <input
                type="text"
                placeholder="Search knowledge..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl bg-[#f8f2fc] py-2.5 pl-10 pr-3 text-sm outline-none ring-purple-200 transition focus:ring-2"
              />
            </div>

            <button className="relative rounded-xl p-2 text-[#655873] hover:bg-purple-50">
              <Bell size={21} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-500" />
            </button>

            <button className="rounded-xl p-2 text-[#655873] hover:bg-purple-50">
              <Settings size={21} />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-purple-200 bg-purple-100 text-sm font-bold text-purple-700"
              >
                {initials}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-60 rounded-2xl border border-purple-100 bg-white p-3 shadow-xl">
                  <div className="border-b border-gray-100 px-3 py-3">
                    <p className="font-bold">{student.full_name}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {student.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/profile");
                    }}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-purple-50"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-9">
          
          {/* ... (Baaki ka poora content jo aapke code me tha: Welcome, Overview Cards, Roadmap, AI Tutor, etc.) ... */}
          
          <section className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold text-purple-600">
                STUDENT WORKSPACE
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#302344] sm:text-4xl">
                Welcome back, {student.full_name?.split(" ")[0]}!
              </h1>

              <p className="mt-2 text-sm text-[#746781] sm:text-base">
                Your personalized learning journey starts here.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-600">
              <Flame size={19} />
              Start Your Learning Streak
            </div>
          </section>

          <div className="relative mb-6 lg:hidden">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500"
            />
            <input
              type="text"
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-purple-100 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_304px]">
            <div className="space-y-6">
              <section id="analytics" className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#e9dff1] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                      <Clock3 size={23} />
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      Learning Activity
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#655873]">
                    Study Duration
                  </p>
                  <h3 className="mt-1 text-3xl font-extrabold text-[#302344]">
                    —
                    <span className="ml-2 text-base font-semibold">hours</span>
                  </h3>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-purple-100">
                    <div className="h-full w-0 rounded-full bg-purple-500" />
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Connect your learning activity to see progress
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e9dff1] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <Star size={23} />
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      Academic Overview
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#655873]">
                    Mastery Level
                  </p>
                  <h3 className="mt-1 text-3xl font-extrabold text-[#302344]">
                    —
                    <span className="ml-2 text-base font-semibold">%</span>
                  </h3>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-indigo-100">
                    <div className="h-full w-0 rounded-full bg-indigo-500" />
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Available after recording academic progress
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-[#e9dff1] bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#302344]">
                      Learning Roadmap
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Example activities for your learning journey
                    </p>
                  </div>
                  <a
                    href="#roadmap"
                    className="flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-800"
                  >
                    View All <ArrowRight size={16} />
                  </a>
                </div>

                <div className="space-y-4">
                  {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment) => {
                      const Icon = assignment.icon;
                      return (
                        <div
                          key={assignment.id}
                          className="flex flex-col justify-between gap-4 rounded-2xl bg-[#faf5fd] p-4 transition hover:bg-[#f5eafd] sm:flex-row sm:items-center sm:px-5"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                assignment.color === "yellow"
                                  ? "bg-amber-100 text-amber-600"
                                  : assignment.color === "blue"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              <Icon size={22} />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-[#302344] sm:text-base">
                                {assignment.title}
                              </h3>
                              <p className="mt-1 text-xs text-[#746781]">
                                {assignment.subtitle}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 sm:justify-end">
                            <span className="whitespace-nowrap rounded-full border border-purple-200 bg-white px-3 py-1.5 text-xs font-bold text-purple-600">
                              {assignment.progress === 0
                                ? "Not Started"
                                : `${assignment.progress}% Done`}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="rounded-xl bg-purple-50 p-6 text-center text-sm text-gray-500">
                      No matching learning activities found.
                    </p>
                  )}
                </div>
              </section>

              <section
                id="roadmap"
                className="rounded-2xl border border-[#e9dff1] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#302344]">
                      Your Learning Goals
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Build a personalized plan for your next milestone.
                    </p>
                  </div>
                  <Target className="text-purple-500" size={26} />
                </div>
                <div className="mt-5 rounded-xl border border-dashed border-purple-200 bg-purple-50/60 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-purple-600 shadow-sm">
                    <Plus size={22} />
                  </div>
                  <h3 className="mt-3 font-bold text-[#302344]">
                    No learning goals yet
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                    Create your first goal to start building your personalized
                    learning roadmap.
                  </p>
                  <button className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-purple-700">
                    Create Your First Goal
                  </button>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section
                id="ai-tutor"
                className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-md shadow-purple-200">
                    <Bot size={23} />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#302344]">
                      Your AI Mentor
                    </h2>
                    <p className="text-xs text-gray-500">
                      Your personal learning assistant
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-[#655873]">
                  Hi {student.full_name?.split(" ")[0]}! I&apos;m here to help
                  you understand concepts, plan your studies and achieve your
                  learning goals.
                </p>
                <button
                  onClick={() => router.push("/dashboard/ai-tutor")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:opacity-90"
                >
                  Start AI Session <ArrowRight size={17} />
                </button>
              </section>

              <section className="rounded-2xl border border-[#e9dff1] bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-extrabold text-[#302344]">
                  AI Learning Assistants
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                      <Calculator size={21} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Math Assistant</h3>
                      <p className="text-xs text-gray-500">
                        Mathematics and problem solving
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <Languages size={21} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Language Assistant</h3>
                      <p className="text-xs text-gray-500">
                        Writing and communication
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                      <Code2 size={21} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Code Mentor</h3>
                      <p className="text-xs text-gray-500">
                        Python and programming
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section
                id="library"
                className="rounded-2xl border border-purple-100 bg-[#f3e7fc] p-6"
              >
                <h2 className="mb-5 text-lg font-extrabold text-[#302344]">
                  Quick AI Tools
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Summarizer", icon: WandSparkles },
                    { name: "Quiz Generator", icon: Brain },
                    { name: "Mind Map", icon: Sparkles },
                    { name: "Citations", icon: FileText },
                  ].map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.name}
                        onClick={() =>
                          router.push(
                            `/dashboard/tools?tool=${encodeURIComponent(
                              tool.name
                            )}`
                          )
                        }
                        className="flex min-h-[95px] flex-col items-center justify-center gap-2 rounded-2xl border border-purple-100 bg-white p-3 text-center transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
                      >
                        <Icon size={23} className="text-purple-600" />
                        <span className="text-xs font-bold text-[#302344]">
                          {tool.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section id="community" className="rounded-2xl bg-white p-5 shadow-sm border border-[#e9dff1]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">Student Community</h3>
                    <p className="text-xs text-gray-500">
                      Learn and grow together
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <footer className="py-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Trialshopy · AI Smart Student Mentor
          </footer>
        </div>
      </main>
    </div>
  );
}