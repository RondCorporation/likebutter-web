'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const proMonthlyPrice = 20;
const proYearlyPrice = 192; // Equivalent to $16/month (20% discount)

const planFeatures = [
  { text: 'Butter Cover Generations', free: '10 / month', pro: 'Unlimited' },
  { text: 'Butter Art Generations', free: '20 / month', pro: 'Unlimited' },
  { text: 'Butter Cuts Generations', free: '5 / month', pro: 'Unlimited' },
  { text: 'Export Quality', free: 'Standard (720p)', pro: 'High (Up to 4K)' },
  { text: 'Generation Speed', free: 'Standard', pro: 'Priority (2x Faster)' },
  { text: 'Watermarks on Exports', free: true, pro: false },
  { text: 'Access to Premium Voices', free: false, pro: true },
  {
    text: 'ButterTalks Sessions',
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
    alert('결제 시스템 연동은 현재 준비 중입니다. 곧 다시 확인해주세요!');
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

    const value = feature[plan as keyof typeof feature];
    let isIncluded = true;
    let detail = '';

    if (typeof value === 'string') {
      detail = value;
    } else if (typeof value === 'boolean') {
      isIncluded = value;
      if (text === 'Watermarks on Exports') {
        isIncluded = !value;
      }
    }

    return (
      <li className="flex items-center gap-3">
        {isIncluded ? (
          <Check className="h-5 w-5 flex-shrink-0 text-accent" />
        ) : (
          <X className="h-5 w-5 flex-shrink-0 text-slate-600" />
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
    <div className="min-h-screen bg-black px-4 pb-20 pt-28 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-accent md:text-5xl">
            Find the Plan to Melt Your Creativity
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            무료로 시작하고 필요에 따라 확장하세요. 언제든 취소할 수 있습니다.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <span
            className={`font-medium transition ${
              billingCycle === 'monthly' ? 'text-accent' : 'text-slate-400'
            }`}
          >
            Monthly
          </span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={billingCycle === 'yearly'}
              onChange={() =>
                setBillingCycle(
                  billingCycle === 'monthly' ? 'yearly' : 'monthly'
                )
              }
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
          <span
            className={`font-medium transition ${
              billingCycle === 'yearly' ? 'text-accent' : 'text-slate-400'
            }`}
          >
            Yearly
            <span className="ml-2 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-300">
              Save 20%
            </span>
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          {/* Free Plan */}
          <div className="flex flex-col rounded-xl border border-white/20 bg-neutral-900/50 p-8">
            <h2 className="text-2xl font-semibold text-white">Free</h2>
            <p className="mt-2 h-12 text-slate-400">
              플랫폼을 탐색하고 시작하기에 완벽한 플랜입니다.
            </p>
            <div className="mt-6">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-lg font-medium text-slate-400">/month</span>
            </div>
            <Link
              href="/signup"
              className="mt-6 w-full rounded-md border border-accent py-2.5 text-center text-sm font-medium text-accent transition hover:bg-accent/10"
            >
              Get Started for Free
            </Link>
            <ul className="mt-8 flex-grow space-y-4 text-left text-sm text-slate-300">
              {planFeatures.map((f) => (
                <FeatureRow key={f.text} text={f.text} plan="free" />
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col rounded-xl border-2 border-accent bg-neutral-900/50 p-8">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
                Most Popular
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-accent">Pro</h2>
            <p className="mt-2 h-12 text-slate-400">
              AI의 모든 잠재력을 발휘하고 싶은 파워 크리에이터를 위한
              플랜입니다.
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
                <p className="mt-1 text-sm text-slate-300">
                  Billed as ${proYearlyPrice} per year
                </p>
              )}
            </div>
            <button
              onClick={handleSubscribeClick}
              className="mt-6 w-full rounded-md bg-accent py-2.5 text-sm font-medium text-black transition hover:brightness-90"
            >
              Subscribe Now
            </button>
            <ul className="mt-8 flex-grow space-y-4 text-left text-sm text-slate-300">
              {planFeatures.map((f) => (
                <FeatureRow key={f.text} text={f.text} plan="pro" />
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/studio" className="text-accent hover:underline">
            Go to the Studio →
          </Link>
        </div>
      </div>
    </div>
  );
}
