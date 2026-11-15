
interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  points?: string[];
}

export default function FeatureCard({
  number,
  title,
  description,
  points = [],
}: FeatureCardProps) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-900/5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-sm font-extrabold text-violet-700">
        {number}
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>

      {points.length > 0 && (
        <ul className="mt-5 space-y-3">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <span className="mt-1 text-violet-600">✓</span>
              {point}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
