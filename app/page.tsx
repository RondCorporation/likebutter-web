import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Typewriter from '@/components/Typewriter';
import LazyYoutube from '@/components/LazyYoutube';

const TITLE = 'LikeButter Studio';
const DESC = `덕질을 위한, 오리를 품은 AI 콘텐츠 플랫폼\n귀엽고 아기자기하지만, 여전히 세련되게`;

export const dynamic = 'force-static';

export default function Landing() {
  const titleSpeed = 50;
  const descSpeed = 80;
  const titleDur = TITLE.length * titleSpeed + 400;

  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth">
      <Header />

      {/* ──────────────────── About ──────────────────── */}
      <section
        id="about"
        className="relative grid h-screen snap-start items-center px-8 md:px-24 bg-black md:grid-cols-[minmax(0,1fr)_640px]"
      >
        {/* ─── 왼쪽 타이틀 ─── */}
        <div>
          <h2 className="mb-4 whitespace-pre-line text-4xl md:text-7xl font-bold text-accent">
            <Typewriter text={TITLE.replace(' ', '\n')} speed={titleSpeed} />
          </h2>

          <p className="max-w-sm whitespace-pre-line text-lg md:text-xl text-slate-300">
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
            LikeButter Studio 체험하기
          </a>
        </div>

        {/* ─── 오른쪽 영상 ─── */}
        <div className="hidden md:flex justify-center">
          <LazyYoutube
            videoId="mPVDGOVjRQ0"
            className="w-full max-w-[800px] md:max-w-[960px] rounded-lg shadow-lg"
          />
        </div>

        {/* 파도 애니메이션 */}
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
            { cls: 'animate-wave-mid  opacity-50', fill: 'gradient' },
            { cls: 'animate-wave-slow opacity-30', fill: 'gradient' },
            { cls: 'animate-wave-mid  opacity-50', fill: 'white' },
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
        className="flex h-screen snap-start items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-neutral-800"
      >
        <div className="max-w-2xl text-center text-white">
          <h2 className="mb-6 text-3xl font-semibold text-accent">Features</h2>
          <p className="mb-8 text-slate-300">
            AI 자동 믹싱 · 실시간 음성 합성 · 팬덤 전용 NFT 민팅 · 커뮤니티 위젯
            …
          </p>
        </div>
      </section>

      {/* ──────────────────── Demo ──────────────────── */}
      <section
        id="demo"
        className="flex h-screen snap-start items-center justify-center bg-black"
      >
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-semibold text-accent">Demo</h2>
          <div className="h-64 w-80 rounded-lg border border-white/20 bg-white/5 backdrop-blur" />
        </div>
      </section>

      {/* ──────────────────── Pricing ──────────────────── */}
      <section
        id="pricing"
        className="flex h-screen snap-start items-center justify-center bg-neutral-900 text-white"
      >
        <div className="grid gap-8 md:grid-cols-3">
          {['Free', 'Pro', 'Enterprise'].map((tier, i) => (
            <div
              key={tier}
              className="rounded-xl border border-white/20 p-8 backdrop-blur"
            >
              <h3 className="mb-2 text-xl font-semibold text-accent">{tier}</h3>
              <p className="mb-6 text-sm text-slate-300">더미 설명 {i + 1}</p>
              <button className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-black hover:brightness-90">
                시작하기
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────── Contact ──────────────────── */}
      <section
        id="contact"
        className="flex h-screen snap-start items-center justify-center bg-black"
      >
        <form className="w-full max-w-md space-y-4">
          <h2 className="text-3xl font-semibold text-accent">Contact Us</h2>
          <input
            placeholder="Email"
            className="w-full rounded-md bg-white/10 p-3 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <textarea
            placeholder="Message"
            rows={4}
            className="w-full rounded-md bg-white/10 p-3 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button className="w-full rounded-md bg-accent py-2 text-sm font-medium text-black hover:brightness-90">
            Send
          </button>
        </form>
      </section>

      {/* ──────────────────── Footer ──────────────────── */}
      <Footer />
    </main>
  );
}
