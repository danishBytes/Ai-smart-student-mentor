import PublicLayout from "@/components/public/PublicLayout";

export default function TermsPage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-widest text-violet-700">
          LEGAL
        </p>
        <h1 className="mt-4 text-4xl font-extrabold text-slate-950">
          Terms & Conditions
        </h1>
        <p className="mt-6 leading-8 text-slate-600">
          This page will describe the conditions for using Trialshopy,
          account responsibilities, acceptable use, AI-generated guidance
          limitations and platform responsibilities.
        </p>
        <p className="mt-6 text-sm text-slate-500">
          Terms must be reviewed and approved before public launch.
        </p>
      </section>
    </PublicLayout>
  );
}