import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownRight, ArrowRight, BookOpenCheck, BrainCircuit, Check, Compass,
  Map, Sparkles, TrendingUp,
} from "lucide-react";
import PublicLayout from "@/components/public/PublicLayout";
import type { ReactNode } from "react";

const capabilities = [
  { number: "01", title: "Academic intelligence", description: "See your academic picture with more clarity. Bring subjects, strengths, and learning needs into one place.", icon: BookOpenCheck },
  { number: "02", title: "AI student mentor", description: "Talk through the questions behind your next decision and get guidance shaped by your goals and context.", icon: BrainCircuit },
  { number: "03", title: "Personal learning roadmaps", description: "Turn an ambition into a sequence of useful actions, milestones, and learning priorities.", icon: Map },
  { number: "04", title: "Career intelligence", description: "Explore directions that connect your interests to the skills and experiences you can build.", icon: Compass },
  { number: "05", title: "Progress & growth", description: "Make steady progress visible, reflect on what is working, and keep your next step within reach.", icon: TrendingUp },
];

const steps = [
  { number: "01", title: "Share your context", description: "Start with your studies, interests, strengths, and the goals you are considering." },
  { number: "02", title: "Find your focus", description: "Understand what matters now across academics, learning, and future possibilities." },
  { number: "03", title: "Shape a roadmap", description: "Build a personal direction with practical steps you can make your own." },
  { number: "04", title: "Keep growing", description: "Track milestones, revisit your priorities, and adjust as your journey changes." },
];

const audiences = [
  { label: "School students", detail: "Build strong foundations and make thoughtful choices about what comes next." },
  { label: "College & university", detail: "Connect your studies with the skills, experience, and direction you want to develop." },
  { label: "Lifelong learners", detail: "Bring structure to a new interest, a fresh learning goal, or a changing career." },
];

const resources = [
  { category: "01 / Build", title: "Programming", detail: "Explore the foundations of writing and thinking in code.", icon: "{ }" },
  { category: "02 / Explore", title: "Artificial intelligence", detail: "Get oriented in a fast-moving field and its core ideas.", icon: "✳" },
  { category: "03 / Prepare", title: "Career development", detail: "Build skills and experiences with your future direction in mind.", icon: "↗" },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow"><span aria-hidden="true" />{children}</p>;
}

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="hero-shell relative overflow-hidden">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="hero-content relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:px-8 sm:py-20 lg:min-h-[720px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-5 lg:px-10 lg:py-20">
          <div className="relative z-10 max-w-[610px] animate-rise">
            <div className="hero-kicker"><Sparkles size={14} strokeWidth={1.8} /> A more personal way to move forward</div>
            <h1 className="hero-title mt-7">Your potential,<br /><span>with a plan.</span></h1>
            <p className="mt-6 max-w-[510px] text-[16px] leading-8 text-[#645c70] sm:text-lg">Academic clarity, thoughtful mentorship, and a roadmap made around you. Trialshopy helps turn the questions in your student journey into confident next steps.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/register" className="button-primary">Find your next step <ArrowRight size={16} /></Link>
              <Link href="#platform" className="button-quiet">Meet your student mentor <ArrowDownRight size={16} /></Link>
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-[#e8e1f0] pt-5 text-[12px] font-medium text-[#777080]"><span className="flex -space-x-2"><i className="avatar-dot bg-[#e7c8b8]"/><i className="avatar-dot bg-[#b9abd7]"/><i className="avatar-dot bg-[#d9d5bb]"/></span><span>Made for the whole journey<br /><b className="font-semibold text-[#332b40]">Learn · reflect · grow</b></span></div>
          </div>

          <div className="hero-art relative mx-auto h-[455px] w-full max-w-[620px] sm:h-[560px] lg:h-[600px]">
            <div className="hero-image-frame absolute inset-x-4 top-3 bottom-6 overflow-hidden rounded-[46%_46%_32px_32px] sm:inset-x-12 sm:top-2 sm:bottom-8">
              <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=88" alt="Students learning together in a bright campus space" fill priority sizes="(max-width: 768px) 92vw, 48vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20152e]/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white sm:bottom-8 sm:left-8"><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-white/75">Your journey, understood</p><p className="mt-2 max-w-[270px] font-serif text-2xl leading-tight sm:text-3xl">Make room for what comes next.</p></div>
            </div>
            <div className="hero-note absolute -left-1 top-[16%] flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[0_18px_50px_-26px_rgba(38,24,54,.4)] backdrop-blur-md sm:left-0"><span className="icon-chip"><BrainCircuit size={18}/></span><span><b className="block text-xs text-[#332b40]">A mentor in your corner</b><small className="mt-1 block text-[10px] text-[#81798a]">Guidance that starts with you</small></span></div>
            <div className="hero-roadmap absolute -right-1 bottom-[13%] w-[220px] rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_22px_55px_-28px_rgba(38,24,54,.45)] backdrop-blur-md sm:right-0 sm:w-[250px]"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-violet-700">Your learning path</span><Map size={15} className="text-violet-600"/></div><div className="mt-4 space-y-3"><div className="flex items-center gap-2.5"><span className="step-check"><Check size={11}/></span><span className="text-[11px] font-medium text-[#4d4656]">Explore what interests you</span></div><div className="flex items-center gap-2.5"><span className="step-current"/><span className="text-[11px] font-semibold text-[#3e3350]">Build a skill with purpose</span></div><div className="flex items-center gap-2.5"><span className="step-next"/><span className="text-[11px] text-[#96909c]">Choose your next milestone</span></div></div></div>
            <div className="hero-stamp absolute right-3 top-[7%] hidden h-[82px] w-[82px] items-center justify-center rounded-full border border-white/70 bg-[#e9ddf7] text-center text-[10px] font-bold uppercase leading-4 tracking-[.13em] text-[#5b427c] sm:flex">Learn<br/>with<br/>intention</div>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-6 sm:px-8 lg:px-10"><div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#e7e0ed] pt-5 text-[10px] font-bold uppercase tracking-[.16em] text-[#8d8595] sm:gap-x-12"><span>Academic intelligence</span><span>Personal mentorship</span><span>Career direction</span><span>Visible progress</span></div></div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[.78fr_1.22fr] lg:gap-24 lg:px-10">
          <div className="lg:sticky lg:top-32 lg:self-start"><Eyebrow>A clearer kind of support</Eyebrow><h2 className="section-title mt-5">The hardest part is knowing <em>where to begin.</em></h2><p className="mt-6 max-w-lg leading-7 text-[#706979]">Students have no shortage of information. What is often missing is a connected view of their own learning, useful guidance, and a next step that feels achievable.</p><Link href="/about" className="text-link mt-7">Why we built Trialshopy <ArrowRight size={15}/></Link></div>
          <div className="divide-y divide-[#ebe7ef] border-y border-[#ebe7ef]">{[["01", "A lot to consider", "Subjects, interests, goals, and advice can be difficult to weigh together."], ["02", "Learning without a thread", "Helpful resources are easier to use when they connect to what you are working toward."], ["03", "A future still taking shape", "Career exploration works better as a journey of discovery than a one-time decision."], ["04", "Growth that is hard to see", "Small milestones deserve to be visible, especially while the bigger picture is still forming."]].map(([number,title,description])=><article key={number} className="challenge-row grid gap-2 py-6 sm:grid-cols-[48px_.8fr_1fr] sm:items-start sm:gap-5"><span className="pt-1 font-mono text-[11px] text-violet-700">{number}</span><h3 className="font-semibold text-[#322d39]">{title}</h3><p className="text-sm leading-6 text-[#797381]">{description}</p></article>)}</div>
        </div>
      </section>

      <section id="platform" className="scroll-mt-24 bg-[#f7f4fa] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10"><div className="grid gap-7 lg:grid-cols-[1fr_.65fr] lg:items-end"><div><Eyebrow>Inside the platform</Eyebrow><h2 className="section-title mt-5 max-w-2xl">A connected view of <em>your next chapter.</em></h2></div><p className="max-w-lg pb-1 text-sm leading-7 text-[#706979]">Five parts of the student journey, brought together around one important question: what is a useful next step for you?</p></div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">{capabilities.map(({number,title,description,icon:Icon},index)=><article key={number} className={`capability-card group ${index===0||index===3?"lg:col-span-3":"lg:col-span-2"}`}><div className="flex items-start justify-between"><span className="font-mono text-[10px] tracking-[.15em] text-[#a49bab]">{number} / 05</span><span className="capability-icon"><Icon size={18} strokeWidth={1.7}/></span></div><h3 className="mt-8 max-w-[280px] text-xl font-semibold tracking-[-.03em] text-[#322b3a]">{title}</h3><p className="mt-3 max-w-[360px] text-sm leading-6 text-[#77707e]">{description}</p><span className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold text-violet-800 transition group-hover:gap-3">Explore the platform <ArrowRight size={13}/></span></article>)}</div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-white py-20 sm:py-28"><div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10"><div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end"><div><Eyebrow>Your journey, at your pace</Eyebrow><h2 className="section-title mt-5">From a question to <em>a way forward.</em></h2></div><p className="max-w-md pb-1 text-sm leading-7 text-[#706979]">A supportive process designed to meet you where you are and help you move with greater intention.</p></div><div className="journey-track relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">{steps.map((step)=><article key={step.number} className="relative"><div className="journey-number">{step.number}</div><h3 className="mt-5 font-semibold text-[#342e3a]">{step.title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-[#77707e]">{step.description}</p></article>)}</div></div></section>

      <section className="border-y border-[#eae5ef] bg-[#fbf9fd] py-16 sm:py-20"><div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:px-10"><div><Eyebrow>Who we support</Eyebrow><h2 className="section-title mt-5 text-[clamp(2rem,4vw,3rem)]">For every version of <em>what&apos;s next.</em></h2></div><div className="grid divide-y divide-[#e9e3ee] border-y border-[#e9e3ee] sm:grid-cols-3 sm:divide-x sm:divide-y-0">{audiences.map((audience,index)=><article key={audience.label} className="py-5 sm:px-5 sm:py-3 first:sm:pl-0 last:sm:pr-0"><span className="font-mono text-[10px] text-violet-700">0{index+1}</span><h3 className="mt-3 font-semibold text-[#393342]">{audience.label}</h3><p className="mt-2 text-sm leading-6 text-[#797381]">{audience.detail}</p></article>)}</div></div></section>

      <section className="bg-white py-20 sm:py-28"><div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Eyebrow>Resources for curious minds</Eyebrow><h2 className="section-title mt-5">A little inspiration. <em>A place to begin.</em></h2></div><Link href="/resources" className="text-link">Explore all resources <ArrowRight size={15}/></Link></div><div className="mt-10 grid gap-3 md:grid-cols-3">{resources.map((resource)=><Link href="/resources" key={resource.title} className="resource-card group"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-violet-800">{resource.category}</span><span className="resource-symbol">{resource.icon}</span></div><h3 className="mt-12 text-xl font-semibold text-[#352e3d]">{resource.title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-[#77707e]">{resource.detail}</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#746d7b] transition group-hover:text-violet-800">Browse resources <ArrowRight size={14}/></span></Link>)}</div></div></section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-24 lg:px-10"><div className="cta-panel relative mx-auto max-w-7xl overflow-hidden rounded-[30px] px-7 py-14 sm:px-14 sm:py-16 lg:px-[76px]"><div className="cta-rings" aria-hidden="true"/><div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div className="max-w-2xl"><Eyebrow>Your next chapter</Eyebrow><h2 className="mt-5 font-serif text-[clamp(2.6rem,5vw,4.5rem)] leading-[1.02] tracking-[-.045em] text-white">Make your next step <i className="font-normal text-[#cbb4ed]">your own.</i></h2><p className="mt-5 max-w-xl leading-7 text-white/70">Start with what matters to you. Build a clearer picture of where you are, where you might go, and what you can do next.</p></div><Link href="/register" className="button-light">Begin your journey <ArrowRight size={16}/></Link></div></div></section>
    </PublicLayout>
  );
}
