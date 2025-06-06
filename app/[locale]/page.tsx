import Footer from '@/components/Footer';
import Typewriter from '@/components/Typewriter';
import LazyYoutube from '@/components/LazyYoutube';
import { Bot, Clapperboard, Mic, Music, Palette } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-static';

export default async function Landing({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'LandingPage' });

  const translatedTITLE = t('Title');
  const translatedDESC = t('Description');

  const titleSpeed = 50;
  const descSpeed = 30;
  const titleDur = translatedTITLE.length * titleSpeed + 400;

  const FEATURES = [
    {
      icon: Bot,
      title: t('FeatureButterTalksTitle'),
      desc: t('FeatureButterTalksDescription'),
    },
    {
      icon: Music,
      title: t('FeatureButterBeatsTitle'),
      desc: t('FeatureButterBeatsDescription'),
    },
    {
      icon: Palette,
      title: t('FeatureButterBrushTitle'),
      desc: t('FeatureButterBrushDescription'),
    },
    {
      icon: Clapperboard,
      title: t('FeatureButterCutsTitle'),
      desc: t('FeatureButterCutsDescription'),
    },
  ];

  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth">
      {/* ──────────────────── Hero (About) ──────────────────── */}
      <section
        id="about"
        className="relative grid h-screen snap-start items-center overflow-hidden bg-black px-8 md:grid-cols-2 md:px-24"
      >
        <div className="z-10">
          <h2 className="mb-4 whitespace-pre-line text-4xl font-bold text-accent md:text-7xl">
            <Typewriter text={translatedTITLE} speed={titleSpeed} />
          </h2>
          <p className="max-w-sm whitespace-pre-line text-lg text-slate-300 md:text-xl">
            <Typewriter
              text={translatedDESC}
              speed={descSpeed}
              startDelay={titleDur}
              keepCursor
            />
          </p>
          <a
            href="/studio" // Middleware will handle locale redirection
            className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:brightness-90"
          >
            {t('StartButton')}
          </a>
        </div>

        <div className="hidden items-center justify-center md:flex">
          <LazyYoutube videoId="mPVDGOVjRQ0" />
        </div>

        {/* --- 파도 애니메이션 --- */}
        <svg
          className="wave-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="50%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
            <path
              id="wave"
              d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          {[
            { cls: 'animate-wave-fast opacity-70', fill: 'gradient' },
            { cls: 'animate-wave-mid opacity-50', fill: 'gradient' },
            { cls: 'animate-wave-slow opacity-30', fill: 'gradient' },
            { cls: 'animate-wave-mid opacity-50', fill: 'white' },
            { cls: 'animate-wave-slow opacity-40', fill: 'white' },
          ].map(({ cls, fill }, idx) => (
            <g key={idx} className={cls}>
              <use
                xlinkHref="#wave"
                fill={fill === 'gradient' ? 'url(#waveGradient)' : '#fff'}
              />
              <use
                xlinkHref="#wave"
                x="150"
                fill={fill === 'gradient' ? 'url(#waveGradient)' : '#fff'}
              />
            </g>
          ))}
        </svg>
      </section>

      {/* ──────────────────── Features ──────────────────── */}
      <section
        id="features"
        className="flex min-h-screen snap-start items-center justify-center bg-neutral-900 py-20"
      >
        <div className="container mx-auto max-w-5xl px-8 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-accent">
            {t('FeaturesTitle')}
          </h2>
          <p className="mb-12 text-slate-300">
            {t('FeaturesDescription')}
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-left"
              >
                <div className="mb-4 flex items-center gap-3">
                  <f.icon className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-bold">{f.title}</h3>
                </div>
                <p className="text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── Demo ──────────────────── */}
      <section
        id="demo"
        className="flex h-screen snap-start items-center justify-center bg-black"
      >
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-semibold text-accent">
            {t('HowItWorksTitle')}
          </h2>
          <p className="mb-8 text-slate-300">
            {t('HowItWorksDescription')}
          </p>
          <div className="h-72 w-[500px] max-w-[90vw] rounded-lg border border-white/20 bg-white/5 backdrop-blur" />
        </div>
      </section>

      {/* ──────────────────── Pricing ──────────────────── */}
      <section
        id="pricing"
        className="flex h-screen snap-start items-center justify-center bg-neutral-900 text-white"
      >
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-semibold text-accent">
            {t('UnlockCreativityTitle')}
          </h2>
          <p className="mb-8 max-w-xl text-slate-300">
            {t('UnlockCreativityDescription')}
          </p>
          <a
            href="/pricing" // Middleware will handle locale redirection
            className="rounded-md bg-accent px-8 py-3 text-base font-semibold text-black transition hover:brightness-90"
          >
            {t('ViewPricingButton')}
          </a>
        </div>
      </section>

      {/* ──────────────────── Contact ──────────────────── */}
      <section
        id="contact"
        className="flex h-screen snap-start items-center justify-center bg-black"
      >
        <form className="w-full max-w-md space-y-4 px-4">
          <h2 className="text-3xl font-semibold text-accent">{t('ContactUsTitle')}</h2>
          <input
            placeholder={t('EmailPlaceholder')}
            className="w-full rounded-md bg-white/10 p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <textarea
            placeholder={t('MessagePlaceholder')}
            rows={4}
            className="w-full rounded-md bg-white/10 p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button className="w-full rounded-md bg-accent py-2 text-sm font-medium text-black transition hover:brightness-90">
            {t('SendMessageButton')}
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}
