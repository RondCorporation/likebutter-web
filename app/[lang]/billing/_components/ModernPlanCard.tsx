'use client';

import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PlanFeature {
  text: string;
  highlighted?: boolean;
}

interface ModernPlanCardProps {
  planKey: string;
  name: string;
  description: string;
  price: number | string;
  originalPrice?: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: PlanFeature[];
  isPopular?: boolean;
  isPremium?: boolean;
  onSelect: (planKey: string, billingCycle: 'monthly' | 'yearly') => void;
  loading?: boolean;
  disabled?: boolean;
  isCurrentPlan?: boolean;
}

export default function ModernPlanCard({
  planKey,
  name,
  description,
  price,
  originalPrice,
  currency,
  billingCycle,
  features,
  isPopular = false,
  isPremium = false,
  onSelect,
  loading = false,
  disabled = false,
  isCurrentPlan = false,
}: ModernPlanCardProps) {
  const { t } = useTranslation(['billing', 'common']);

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    return price.toLocaleString();
  };

  const handleSelect = () => {
    if (!disabled && !loading) {
      onSelect(planKey, billingCycle);
    }
  };

  return (
    <div
      style={{ backgroundColor: '#25282c' }}
      className={`relative rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
        isPopular
          ? 'border-butter-yellow shadow-butter-yellow/20 shadow-lg'
          : 'border-slate-700 hover:border-slate-600'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleSelect}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-butter-yellow text-black px-3 py-1 rounded-full text-xs font-semibold">
            {t('billing:mostPopular')}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {/* Studio Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
            {name}
          </h3>
          <p
            className="text-slate-400 text-xs sm:text-sm"
            style={{ wordBreak: 'keep-all' }}
          >
            {description}
          </p>
        </div>

        {/* Studio Pricing */}
        <div className="text-center mb-4 sm:mb-6 min-h-[90px] sm:h-[100px] flex flex-col justify-center">
          <div className="flex items-baseline justify-center gap-1">
            {typeof price === 'string' ? (
              <span className="text-2xl sm:text-3xl font-bold text-butter-yellow">
                {price}
              </span>
            ) : (
              <>
                <span className="text-xs sm:text-sm text-slate-400">
                  {currency}
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {formatPrice(price)}
                </span>
                <span className="text-slate-400 text-base sm:text-lg">
                  /{t('billing:month')}
                </span>
              </>
            )}
          </div>

          {originalPrice &&
            typeof price === 'number' &&
            billingCycle === 'yearly' && (
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm mt-2">
                <span className="text-slate-500 line-through">
                  {currency}
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-green-400 font-medium">20% off</span>
              </div>
            )}
        </div>

        {/* Studio Features Only - Max 3 */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 min-h-[80px] sm:h-[96px] flex flex-col justify-start">
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full bg-butter-yellow/20 border border-butter-yellow/40 flex items-center justify-center">
                <Check className="w-3 h-3 text-butter-yellow" />
              </div>
              <span
                className="text-slate-300 text-xs sm:text-sm"
                style={{ wordBreak: 'keep-all' }}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Studio CTA Button */}
        <button
          className={`w-full py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 ${
            isCurrentPlan
              ? 'bg-green-500/20 border border-green-500/40 text-green-400 cursor-default'
              : planKey === 'free'
              ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
              : isPopular
                ? 'bg-butter-yellow hover:bg-butter-yellow/90 text-black'
                : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
          } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          disabled={disabled || loading || isCurrentPlan}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-xs sm:text-sm">
                {t('billing:plans.processing')}
              </span>
            </div>
          ) : isCurrentPlan ? (
            t('billing:currentPlan')
          ) : planKey === 'free' ? (
            t('billing:plans.free.name')
          ) : (
            t('billing:plans.startButton')
          )}
        </button>
      </div>
    </div>
  );
}
