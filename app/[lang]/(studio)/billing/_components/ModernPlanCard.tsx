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
      className={`relative rounded-lg border-2 transition-all duration-200 hover:shadow-lg bg-slate-800/50 ${
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

      <div className="p-6">
        {/* Studio Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>

        {/* Studio Pricing */}
        <div className="text-center mb-6 h-[100px] flex flex-col justify-center">
          <div className="flex items-baseline justify-center gap-1">
            {typeof price === 'string' ? (
              <span className="text-3xl font-bold text-butter-yellow">
                {price}
              </span>
            ) : (
              <>
                <span className="text-sm text-slate-400">{currency}</span>
                <span className="text-4xl font-bold text-white">
                  {formatPrice(price)}
                </span>
                <span className="text-slate-400 text-lg">
                  /{billingCycle === 'monthly' ? t('billing:month') : t('billing:year')}
                </span>
              </>
            )}
          </div>

          {originalPrice &&
            typeof price === 'number' &&
            billingCycle === 'yearly' && (
              <div className="flex items-center justify-center gap-2 text-sm mt-2">
                <span className="text-slate-500 line-through">
                  {currency}
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-green-400 font-medium">20% off</span>
              </div>
            )}
        </div>

        {/* Studio Features Only - Max 3 */}
        <div className="space-y-3 mb-6 h-[96px] flex flex-col justify-start">
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-butter-yellow/20 border border-butter-yellow/40 flex items-center justify-center">
                <Check className="w-3 h-3 text-butter-yellow" />
              </div>
              <span className="text-slate-300 text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Studio CTA Button */}
        <button
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            planKey === 'free'
              ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
              : isPopular
                ? 'bg-butter-yellow hover:bg-butter-yellow/90 text-black'
                : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
          } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          disabled={disabled || loading}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              {t('billing:plans.processing')}
            </div>
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
