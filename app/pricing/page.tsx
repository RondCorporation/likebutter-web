// app/pricing/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const proMonthlyPrice = 20;
const proYearlyPrice = 192; // Equivalent to $16/month (20% discount)

const planFeatures = [
  { text: 'AI Cover Generations', free: '10 / month', pro: 'Unlimited' },
  { text: 'AI Fan Art Generations', free: '20 / month', pro: 'Unlimited' },
  { text: 'AI Video Generations', free: '5 / month', pro: 'Unlimited' },
  { text: 'Export Quality', free: 'Standard (720p)', pro: 'High (Up to 4K)' },
  { text: 'Generation Speed', free: 'Standard', pro: 'Priority (2x Faster)' },
  { text: 'Watermarks on Exports', free: true, pro: false }, // true = has watermarks
  { text: 'Access to Premium Voices', free: false, pro: true }, // false = no access
  {
    text: 'Virtual Talk Sessions',
    free: '5 sessions / month',
    pro: 'Unlimited',
  },
  {
    text: 'Customer Support',
    free: 'Community Forum',
    pro: 'Priority Email Support',
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const handleSubscribeClick = () => {
    alert(
      'Payment gateway integration is currently in progress. Please check back soon!'
    );
  };

  const FeatureRow = ({
    text,
    plan,
  }: {
    text: string;
    plan: 'free' | 'pro';
  }) => {
    const feature = planFeatures.find((f) => f.text === text);
    if (!feature) return null;

    const value = feature[plan];
    let isIncluded = true;
    let detail = '';

    if (typeof value === 'string') {
      detail = value;
    } else if (typeof value === 'boolean') {
      isIncluded = value;
      if (text === 'Watermarks on Exports') {
        isIncluded = !value; // Invert logic for watermarks (false means "No Watermarks" which is a positive feature)
      }
    }

    return (
      <li className="flex items-center gap-3">
        {isIncluded ? (
          <Check className="h-5 w-5 text-accent flex-shrink-0" />
        ) : (
          <X className="h-5 w-5 text-slate-600 flex-shrink-0" />
        )}
        <span className={!isIncluded ? 'text-slate-500 line-through' : ''}>
          {text === 'Watermarks on Exports' && isIncluded
            ? 'No Watermarks'
            : text}
        </span>
        {detail && <strong className="ml-auto text-white">{detail}</strong>}
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-accent">
            The Perfect Plan for Your Creativity
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Start for free and scale up as you grow. Cancel anytime.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="mt-10 flex justify-center items-center gap-4">
          <span
            className={`font-medium transition ${
              billingCycle === 'monthly' ? 'text-accent' : 'text-slate-400'
            }`}
          >
            Monthly
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={billingCycle === 'yearly'}
              onChange={() =>
                setBillingCycle(
                  billingCycle === 'monthly' ? 'yearly' : 'monthly'
                )
              }
            />
            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
          <span
            className={`font-medium transition ${
              billingCycle === 'yearly' ? 'text-accent' : 'text-slate-400'
            }`}
          >
            Yearly
            <span className="ml-2 text-xs bg-green-500/20 text-green-300 rounded-full px-2 py-0.5 font-semibold">
              Save 20%
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Free Plan */}
          <div className="border border-white/20 rounded-xl p-8 bg-neutral-900/50 flex flex-col">
            <h2 className="text-2xl font-semibold text-white">Free</h2>
            <p className="text-slate-400 mt-2 h-12">
              Perfect for getting started and exploring the platform.
            </p>
            <div className="mt-6">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-lg font-medium text-slate-400">/month</span>
            </div>
            <Link
              href="/signup"
              className="mt-6 w-full text-center rounded-md border border-accent py-2.5 text-sm font-medium text-accent hover:bg-accent/10 transition"
            >
              Get Started for Free
            </Link>
            <ul className="mt-8 text-left space-y-4 text-sm text-slate-300 flex-grow">
              {planFeatures.map((f) => (
                <FeatureRow key={f.text} text={f.text} plan="free" />
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-accent rounded-xl p-8 bg-neutral-900/50 relative flex flex-col">
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
              <span className="bg-accent text-black font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-accent">Pro</h2>
            <p className="text-slate-400 mt-2 h-12">
              For power creators who want to unlock the full potential of AI.
            </p>
            <div className="mt-6">
              <span className="text-5xl font-bold">
                $
                {billingCycle === 'monthly'
                  ? proMonthlyPrice
                  : Math.round(proYearlyPrice / 12)}
              </span>
              <span className="text-lg font-medium text-slate-400">/month</span>
              {billingCycle === 'yearly' && (
                <p className="text-sm text-slate-300 mt-1">
                  Billed as ${proYearlyPrice} per year
                </p>
              )}
            </div>
            <button
              onClick={handleSubscribeClick}
              className="mt-6 w-full rounded-md bg-accent py-2.5 text-sm font-medium text-black hover:brightness-90 transition"
            >
              Subscribe Now
            </button>
            <ul className="mt-8 text-left space-y-4 text-sm text-slate-300 flex-grow">
              {planFeatures.map((f) => (
                <FeatureRow key={f.text} text={f.text} plan="pro" />
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/studio" className="text-accent hover:underline">
            Go to the Studio &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
