import PublicLayout from "@/components/public/PublicLayout";

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-widest text-violet-700">
          LEGAL
        </p>
        <h1 className="mt-4 text-4xl font-extrabold text-slate-950">
          Privacy Policy
        </h1>
        <p className="mt-6 leading-8 text-slate-600">
          This page will explain how Trialshopy collects, uses, stores and
          protects student information, including account data, academic
          information and AI-related interactions.
        </p>
        <p className="mt-6 text-sm text-slate-500">
          Privacy policy content must be reviewed and approved before launch.
        </p>
      </section>
    </PublicLayout>
  );
}