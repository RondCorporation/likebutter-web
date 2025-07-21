'use client';

import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Typewriter from '@/components/Typewriter';
import LazyYoutube from '@/components/LazyYoutube';
import {
  Bot,
  Clapperboard,
  Music,
  Palette,
  Check,
  Sparkles,
  Mouse,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

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

// JavaScript 스크롤 제어를 위한 섹션 ID 목록
const SECTIONS = ['about', 'features', 'demo', 'pricing', 'contact'];

export default function Landing() {
  const titleSpeed = 50;
  const descSpeed = 30;
  const titleDur = TITLE.length * titleSpeed + 400;

  // --- 스크롤 텐션 로직 ---
  const mainRef = useRef<HTMLElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    // 마우스 휠 이벤트 핸들러
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // 기본 스크롤 동작 방지
      if (isScrolling) return; // 이미 스크롤 중이면 무시

      const scrollDown = e.deltaY > 0;
      setIsScrolling(true);

      if (scrollDown) {
        // 아래로 스크롤
        if (currentSection < SECTIONS.length - 1) {
          const nextSectionIndex = currentSection + 1;
          document
            .getElementById(SECTIONS[nextSectionIndex])
            ?.scrollIntoView({ behavior: 'smooth' });
          setCurrentSection(nextSectionIndex);
        }
      } else {
        // 위로 스크롤
        if (currentSection > 0) {
          const prevSectionIndex = currentSection - 1;
          document
            .getElementById(SECTIONS[prevSectionIndex])
            ?.scrollIntoView({ behavior: 'smooth' });
          setCurrentSection(prevSectionIndex);
        }
      }

      // 1초(1000ms)의 쿨다운 후 다시 스크롤 가능
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    const mainEl = mainRef.current;
    if (mainEl) {
      // { passive: false } 옵션으로 preventDefault()가 가능하도록 설정
      mainEl.addEventListener('wheel', handleWheel, { passive: false });
    }

    // 컴포넌트가 사라질 때 이벤트 리스너를 꼭 제거해줍니다.
    return () => {
      if (mainEl) {
        mainEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isScrolling, currentSection]);
  // --- 스크롤 로직 끝 ---

  // Framer Motion 애니메이션 Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 자식 요소들이 0.2초 간격으로 애니메이션
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main ref={mainRef} className="h-screen overflow-y-hidden bg-black">
      {/* 전체 페이지에 적용되는 Animated Gradient 배경 */}
      <div className="animated-gradient" />

      {/* ──────────────────── Hero (About) ──────────────────── */}
      <section
        id="about"
        className="relative flex h-screen flex-col justify-center overflow-hidden"
      >
        <div className="grid h-full items-center px-8 md:grid-cols-2 md:px-24">
          <div className="z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="mb-4 whitespace-pre-line text-4xl font-bold text-accent md:text-7xl"
            >
              <Typewriter text={TITLE} speed={titleSpeed} />
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
              className="max-w-sm whitespace-pre-line text-lg text-slate-300 md:text-xl"
            >
              <Typewriter
                text={DESC}
                speed={descSpeed}
                startDelay={titleDur}
                keepCursor
              />
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
            >
              <Link
                href="/studio"
                className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-90"
              >
                Butter Studio 시작하기
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-0 hidden items-center justify-center md:flex"
          >
            <LazyYoutube
              videoId="mPVDGOVjRQ0"
              className="w-full rounded-lg shadow-2xl shadow-accent/10"
            />
          </motion.div>
        </div>

        <div className="wave-container">
          <svg
            className="wave-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
          >
            <defs>
              <path
                id="wave"
                d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="animate-wave-slow opacity-20 blur-sm">
              <use xlinkHref="#wave" fill="var(--accent)" />
            </g>
            <g className="animate-wave-mid opacity-50 blur-sm">
              <use xlinkHref="#wave" fill="var(--accent)" />
            </g>
            <g className="animate-wave-fast opacity-70">
              <use xlinkHref="#wave" fill="var(--accent)" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-accent animate-bounce">
          <span className="text-xs">SCROLL</span>
          <Mouse size={16} />
        </div>
      </section>

      {/* ──────────────────── Features ──────────────────── */}
      <section
        id="features"
        className="relative flex h-screen items-center justify-center bg-neutral-900/80 backdrop-blur-lg"
      >
        <div className="container mx-auto max-w-5xl px-8 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="mb-4 text-3xl font-semibold text-accent"
          >
            당신의 모든 감정이 작품이 되는 곳
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            transition={{ delay: 0.1 }}
            className="mb-12 text-slate-300"
          >
            LikeButter의 AI 요정 '버터'가 당신의 팬심을 다채로운 콘텐츠로 녹여낼
            수 있도록 안내할게요.
          </motion.p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-left transition-all duration-300 hover:border-accent/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 backdrop-blur-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <f.icon className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-bold">{f.title}</h3>
                </div>
                <p className="text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────── Demo ──────────────────── */}
      <section
        id="demo"
        className="flex h-screen items-center justify-center bg-black"
      >
        <div className="w-full max-w-4xl text-center px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="mb-4 text-3xl font-semibold text-accent"
          >
            How it Works
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            transition={{ delay: 0.1 }}
            className="mb-12 text-slate-300"
          >
            단 몇 번의 클릭으로 당신의 아이디어가 실현되는 과정을 확인하세요.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            transition={{ delay: 0.2 }}
            className="h-96 w-full rounded-lg border border-white/20 bg-white/5 p-6 backdrop-blur-sm flex items-center justify-center text-slate-400"
          >
            <p className="flex items-center gap-2">
              <Sparkles size={20} className="text-accent" />
              Interactive "Scrollytelling" Demo Coming Soon!
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────── Pricing ──────────────────── */}
      <section
        id="pricing"
        className="relative flex h-screen items-center justify-center bg-neutral-900/80 text-white backdrop-blur-lg"
      >
        <div className="text-center px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="mb-4 text-3xl font-semibold text-accent"
          >
            Unlock Your Creativity
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            transition={{ delay: 0.1 }}
            className="mb-12 max-w-xl text-slate-300"
          >
            무료로 시작하고, 더 전문적인 창작 활동이 필요할 때 Pro 플랜으로
            업그레이드하세요.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-lg border border-white/10 bg-white/5"
            >
              <h3 className="text-2xl font-bold text-white">Free Plan</h3>
              <p className="text-sm text-slate-400 mt-2">
                기본 기능을 체험해보세요
              </p>
              <ul className="text-left mt-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> Monthly 300
                  Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> Standard Speed
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> Watermarked
                  Exports
                </li>
              </ul>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-lg border-2 border-accent bg-accent/5"
            >
              <h3 className="text-2xl font-bold text-accent">Creator Plan</h3>
              <p className="text-sm text-slate-400 mt-2">
                더 많은 창작 활동을 위해
              </p>
              <ul className="text-left mt-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> Monthly 4,000
                  Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> Fast Generation
                  Speed
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> No Watermarks
                </li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Link
              href="/pricing"
              className="rounded-md bg-accent px-8 py-3 text-base font-semibold text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-90"
            >
              자세한 요금제 보기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────── Contact & Footer ──────────────────── */}
      <section
        id="contact"
        className="relative flex h-screen flex-col justify-center bg-black"
      >
        <div className="flex-grow flex items-center justify-center">
          <motion.form
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="w-full max-w-md space-y-4 px-4"
          >
            <h2 className="text-3xl font-semibold text-accent">Contact Us</h2>
            <input
              placeholder="Email"
              className="w-full rounded-md bg-white/10 p-3 text-sm text-white placeholder-slate-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="w-full rounded-md bg-white/10 p-3 text-sm text-white placeholder-slate-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="w-full rounded-md bg-accent py-2 text-sm font-medium text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-90">
              Send Message
            </button>
          </motion.form>
        </div>
        <Footer />
      </section>
    </main>
  );
}
