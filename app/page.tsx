import Footer from '@/components/Footer';
import Typewriter from '@/components/Typewriter';
import LazyYoutube from '@/components/LazyYoutube';
import { Bot, Clapperboard, Mic, Music, Palette } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

const TITLE = 'LikeButter';
const DESC = `Everything Melts with Butter.\n팬심이 녹아들어 특별한 콘텐츠가 되는 공간.`;

const FEATURES = [
  {
    icon: Bot,
    title: 'ButterTalks',
    desc: '최애와 나누고 싶은 이야기를 AI와 함께 나눠보세요. 감정을 쏟아내는 것만으로 시작돼요.',
  },
  {
    icon: Music,
    title: 'ButterBeats & Cover',
    desc: '나의 감정을 담아 세상에 하나뿐인 팬송을 만들거나, 최애의 목소리로 커버곡을 만들어보세요.',
  },
  {
    icon: Palette,
    title: 'ButterBrush',
    desc: '마음속에 떠오른 이미지를 텍스트로 입력하거나 그림을 업로드하여 AI 팬아트를 완성할 수 있어요.',
  },
  {
    icon: Clapperboard,
    title: 'ButterCuts',
    desc: '생성된 이미지와 음악, 나의 영상들을 조합하여 감각적인 팬메이드 비디오를 손쉽게 편집해보세요.',
  },
];

export const dynamic = 'force-static';

export default function Landing() {
  const { t } = useLang();
  const titleSpeed = 50;
  const descSpeed = 30;
  const titleDur = TITLE.length * titleSpeed + 400;

  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth">
      {/* ──────────────────── Hero (About) ──────────────────── */}
      <section
        id="about"
        className="relative grid h-screen snap-start items-center overflow-hidden bg-black px-8 md:grid-cols-2 md:px-24"
      >
        <div className="z-10">
          <h2 className="mb-4 whitespace-pre-line text-4xl font-bold text-accent md:text-7xl">
            <Typewriter text={TITLE} speed={titleSpeed} />
          </h2>
          <p className="max-w-sm whitespace-pre-line text-lg text-slate-300 md:text-xl">
            <Typewriter
              text={DESC}
              speed={descSpeed}
              startDelay={titleDur}
              keepCursor
            />
          </p>
          <a
            href="/studio"
            className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:brightness-90"
          >
            {t.startStudio}
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
            당신의 모든 감정이 작품이 되는 곳
          </h2>
          <p className="mb-12 text-slate-300">
            LikeButter의 AI 요정 '버터'가 당신의 팬심을 다채로운 콘텐츠로 녹여낼
            수 있도록 안내할게요.
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
            How it Works
          </h2>
          <p className="mb-8 text-slate-300">
            단 몇 번의 클릭으로 당신의 아이디어가 실현되는 과정을 확인하세요.
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
            Unlock Your Creativity
          </h2>
          <p className="mb-8 max-w-xl text-slate-300">
            무료로 시작하고, 더 전문적인 창작 활동이 필요할 때 Pro 플랜으로
            업그레이드하세요.
          </p>
          <a
            href="/pricing"
            className="rounded-md bg-accent px-8 py-3 text-base font-semibold text-black transition hover:brightness-90"
          >
            {t.viewPlans}
          </a>
        </div>
      </section>

      {/* ──────────────────── Contact ──────────────────── */}
      <section
        id="contact"
        className="flex h-screen snap-start items-center justify-center bg-black"
      >
        <form className="w-full max-w-md space-y-4 px-4">
          <h2 className="text-3xl font-semibold text-accent">Contact Us</h2>
          <input
            placeholder="Email"
            className="w-full rounded-md bg-white/10 p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <textarea
            placeholder="Message"
            rows={4}
            className="w-full rounded-md bg-white/10 p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button className="w-full rounded-md bg-accent py-2 text-sm font-medium text-black transition hover:brightness-90">
            {t.sendMessage}
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}
