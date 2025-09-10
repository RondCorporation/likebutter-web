'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Sparkles,
  Crown,
  ArrowRight,
  Gift,
  Zap,
  Star,
  Heart,
  Rocket
} from 'lucide-react';
import StudioOverlay from '@/components/studio/StudioOverlay';

interface SuccessCelebrationProps {
  lang: string;
  planName?: string;
  subscriptionId?: string;
}

const celebrationEmojis = ['🎉', '🎊', '✨', '🚀', '💫', '🌟'];
const planIcons = {
  creator: Sparkles,
  professional: Crown,
  basic: Sparkles,
  pro: Crown,
};

export default function SuccessCelebration({
  lang,
  planName = 'creator',
  subscriptionId,
}: SuccessCelebrationProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  const PlanIcon = planIcons[planName as keyof typeof planIcons] || Sparkles;

  // Confetti animation
  useEffect(() => {
    if (showConfetti) {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#FFD93B', '#FF6B35', '#A855F7', '#EC4899'];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      setTimeout(() => setShowConfetti(false), duration);
    }
  }, [showConfetti]);

  // Step progression
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1000);
    const timer2 = setTimeout(() => setCurrentStep(2), 2000);
    const timer3 = setTimeout(() => setCurrentStep(3), 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const steps = [
    {
      icon: CheckCircle2,
      title: t('paymentConfirmed'),
      subtitle: t('billingInformationSecured'),
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
    },
    {
      icon: PlanIcon,
      title: t('planActivated'),
      subtitle: t('allFeaturesUnlocked'),
      color: 'text-butter-yellow',
      bgColor: 'bg-butter-yellow/20',
    },
    {
      icon: Rocket,
      title: t('readyToCreate'),
      subtitle: t('letsBuildSomethingAmazing'),
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
    },
  ];

  const benefits = [
    { icon: Zap, text: t('unlimitedGenerations') },
    { icon: Star, text: t('prioritySupport') },
    { icon: Gift, text: t('exclusiveFeatures') },
    { icon: Heart, text: t('communityAccess') },
  ];

  const handleContinue = () => {
    router.push(`/${lang}/studio`);
  };

  const handleViewReceipt = () => {
    if (subscriptionId) {
      router.push(`/${lang}/payments/${subscriptionId}`);
    } else {
      router.push(`/${lang}/billing/history`);
    }
  };

  return (
    <StudioOverlay
      title=""
      backUrl={`/${lang}/studio`}
      className="max-w-4xl"
    >
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-butter-yellow/5 via-transparent to-purple-500/5" />
        
        <div className="relative text-center space-y-8">
          {/* Main celebration */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 10,
              duration: 0.8 
            }}
            className="relative"
          >
            <div className="inline-flex p-8 rounded-full bg-gradient-to-br from-butter-yellow to-butter-orange shadow-2xl shadow-butter-yellow/25">
              <CheckCircle2 className="w-16 h-16 text-black" />
            </div>
            
            {/* Floating emojis */}
            {celebrationEmojis.map((emoji, index) => (
              <motion.div
                key={index}
                className="absolute text-2xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                }}
                transition={{ 
                  duration: 2,
                  delay: index * 0.2 + 1,
                  ease: 'easeOut'
                }}
                style={{
                  left: '50%',
                  top: '50%',
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {t('congratulations')}! 🎉
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {t('subscriptionSuccessMessage')}
            </p>
          </motion.div>

          {/* Progress steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: currentStep >= index ? 1 : 0.3, 
                  y: currentStep >= index ? 0 : 30,
                  scale: currentStep >= index ? 1 : 0.95
                }}
                transition={{ delay: index * 0.5 + 1 }}
                className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
                  currentStep >= index 
                    ? `border-${step.color.split('-')[1]}-400 ${step.bgColor}` 
                    : 'border-slate-700 bg-slate-800/30'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl ${step.bgColor} mb-4`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400">
                  {step.subtitle}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-6">
              {t('whatYouGet')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.5 + index * 0.1 }}
                  className="flex flex-col items-center text-center space-y-3"
                >
                  <div className="p-3 rounded-xl bg-butter-yellow/20">
                    <benefit.icon className="w-5 h-5 text-butter-yellow" />
                  </div>
                  <span className="text-sm text-slate-300">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleContinue}
              className="group bg-gradient-to-r from-butter-yellow to-butter-orange text-black px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-butter-yellow/25 transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              {t('startCreating')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={handleViewReceipt}
              className="text-slate-300 hover:text-white px-6 py-3 rounded-xl border border-slate-600 hover:border-slate-500 transition-colors flex items-center gap-2"
            >
              {t('viewReceipt')}
            </button>
          </motion.div>
        </div>
      </div>
    </StudioOverlay>
  );
}