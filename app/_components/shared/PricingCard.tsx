'use client';

import { ReactNode } from 'react';
import { Check } from 'lucide-react';
import StudioButton from './StudioButton';
import { cn } from '@/app/_lib/utils';

interface PricingCardProps {
  name: string;
  description: string;
  price: string | number;
  period: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  isDowngrade?: boolean;
  ctaText: string;
  onCtaClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function PricingCard({
  name,
  description,
  price,
  period,
  features,
  isPopular = false,
  isCurrentPlan = false,
  isDowngrade = false,
  ctaText,
  onCtaClick,
  disabled = false,
  className
}: PricingCardProps) {
  const formatPrice = (price: string | number) => {
    if (typeof price === 'string') return price;
    return price.toLocaleString();
  };

  return (
    <div className={cn(
      "relative rounded-xl border p-6 transition-all duration-300 hover:scale-105",
      isPopular 
        ? "border-butter-yellow bg-butter-yellow/5 shadow-lg shadow-butter-yellow/20" 
        : "border-slate-700 bg-slate-800/50",
      className
    )}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-butter-yellow px-4 py-1 text-sm font-semibold text-black">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className={cn(
          "text-xl font-bold mb-2",
          isPopular ? "text-butter-yellow" : "text-white"
        )}>
          {name}
        </h3>
        
        <p className="text-slate-400 text-sm mb-6 min-h-[40px] flex items-center justify-center">
          {description}
        </p>

        <div className="mb-6">
          <div className={cn(
            "text-3xl font-bold mb-1",
            isPopular ? "text-butter-yellow" : "text-white"
          )}>
            {typeof price === 'number' && price > 0 ? `₩${formatPrice(price)}` : price}
            <span className="text-lg text-slate-400 font-normal">/{period}</span>
          </div>
        </div>

        <ul className="space-y-3 mb-8 min-h-[120px]">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-sm">
              <Check className={cn(
                "w-4 h-4 flex-shrink-0",
                isPopular ? "text-butter-yellow" : "text-green-400"
              )} />
              <span className="text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>

        <StudioButton
          onClick={onCtaClick}
          disabled={disabled || isCurrentPlan}
          variant={isPopular ? 'primary' : 'secondary'}
          className="w-full"
          size="lg"
        >
          {isCurrentPlan ? '현재 플랜' : isDowngrade ? '다운그레이드 불가' : ctaText}
        </StudioButton>
      </div>
    </div>
  );
}