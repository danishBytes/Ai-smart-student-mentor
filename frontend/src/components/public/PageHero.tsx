
import Link from "next/link";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
}

export default function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  primaryLabel = "Get Started",
  primaryHref = "/register",
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F8F6FF]">
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-300/20 blur-3xl" />
      <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
            {eyebrow}
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {title}{" "}
            <span className="text-violet-700">{highlight}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            {description}
          </p>

          <div className="mt-9">
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-3 rounded-full bg-violet-700 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-700/20 transition hover:-translate-y-1 hover:bg-violet-800"
            >
              {primaryLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
