import { SITE_TITLE, SITE_DESCRIPTION } from '@/lib/siteMeta';
import Typewriter from '@/components/Typewriter';

export default function WavesPage() {
  const titleSpeed = 50;
  const descSpeed = 80;
  const titleDuration = SITE_TITLE.length * titleSpeed + 400;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 타이틀 및 설명 영역, 커서 애니메이션 */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-8 md:pl-16 lg:pl-24">
        <h1 className="text-4xl md:text-7xl font-bold leading-tight text-white whitespace-pre-line">
          <Typewriter text={SITE_TITLE.replace(' ', '\n')} speed={titleSpeed} />
        </h1>
        <p className="mt-4 max-w-sm text-lg md:text-xl text-slate-300">
          <Typewriter
            text={SITE_DESCRIPTION}
            speed={descSpeed}
            startDelay={titleDuration}
            keepCursor
            className="block"
          />
        </p>
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
            <stop offset="0%" stopColor="#6a11cb" />
            <stop offset="50%" stopColor="#2575fc" />
            <stop offset="100%" stopColor="#6a11cb" />
          </linearGradient>
          <path
            id="wave"
            d="M-160 44c30 0 58-18 88-18s58 18 88 18
               58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>

        {/* 컬러 레이어 */}
        <use
          href="#wave"
          fill="url(#waveGradient)"
          className="animate-wave-fast opacity-70"
        />
        <use
          href="#wave"
          fill="url(#waveGradient)"
          className="animate-wave-mid  opacity-50"
        />
        <use
          href="#wave"
          fill="url(#waveGradient)"
          className="animate-wave-slow opacity-30"
        />

        {/* 하얀 레이어 */}
        <use
          href="#wave"
          fill="#fff"
          className="animate-wave-mid  opacity-50"
        />
        <use
          href="#wave"
          fill="#fff"
          className="animate-wave-slow opacity-40"
        />
      </svg>
    </div>
  );
}
