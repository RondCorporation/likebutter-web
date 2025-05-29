import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-white bg-black px-4 text-center">
      <h2 className="mb-4 text-4xl font-bold text-accent">Pricing Plans</h2>
      <p className="text-xl text-slate-300">
        Our amazing subscription plans are coming soon! Stay tuned. 🦆
      </p>
      <Link
        href="/studio"
        className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:brightness-90"
      >
        Back to Studio
      </Link>
    </div>
  );
}
