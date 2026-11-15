
import Link from "next/link";
import PublicLayout from "./PublicLayout";
import PageHero from "./PageHero";
import FeatureCard from "./FeatureCard";

interface ContentPageProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  heading: string;
  body: string;
  cards: {
    title: string;
    description: string;
  }[];
}

export default function ContentPage({
  eyebrow,
  title,
  highlight,
  description,
  heading,
  body,
  cards,
}: ContentPageProps) {
  return (
    <PublicLayout>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        highlight={highlight}
        description={description}
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
            DISCOVER TRIALSHOPY
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {heading}
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600">
            {body}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <FeatureCard
              key={card.title}
              number={String(index + 1).padStart(2, "0")}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      <section className="bg-[#171126] px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-300">
            YOUR NEXT STEP
          </p>

          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
            Make your learning journey more intentional.
          </h2>

          <p className="mt-5 leading-8 text-slate-300">
            Create your student profile and start exploring a more structured
            approach to academic and career guidance.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex rounded-full bg-violet-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-violet-500"
          >
            Get Started →
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
