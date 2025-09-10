'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, ArrowLeft, Wifi, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StudioOverlay from '@/components/studio/StudioOverlay';

interface BillingErrorDisplayProps {
  lang: string;
  error: Error | string;
  onRetry?: () => void;
  onBack?: () => void;
}

const errorTypes = {
  network: {
    icon: Wifi,
    title: 'networkError',
    description: 'networkErrorDesc',
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
  },
  server: {
    icon: Server,
    title: 'serverError',
    description: 'serverErrorDesc',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/20',
  },
  payment: {
    icon: AlertTriangle,
    title: 'paymentError',
    description: 'paymentErrorDesc',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
  },
  default: {
    icon: AlertTriangle,
    title: 'genericError',
    description: 'genericErrorDesc',
    color: 'text-slate-400',
    bgColor: 'bg-slate-400/20',
  },
};

const getErrorType = (error: Error | string) => {
  const message = typeof error === 'string' ? error : error.message;
  
  if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
    return 'network';
  }
  if (message.toLowerCase().includes('server') || message.toLowerCase().includes('500')) {
    return 'server';
  }
  if (message.toLowerCase().includes('payment') || message.toLowerCase().includes('billing')) {
    return 'payment';
  }
  return 'default';
};

export default function BillingErrorDisplay({
  lang,
  error,
  onRetry,
  onBack,
}: BillingErrorDisplayProps) {
  const { t } = useTranslation();
  
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorType = getErrorType(error);
  const errorConfig = errorTypes[errorType];
  const ErrorIcon = errorConfig.icon;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#202020' }}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8 max-w-md mx-auto bg-slate-900 border border-slate-700 p-8 rounded-xl shadow-2xl"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`inline-flex p-6 rounded-2xl ${errorConfig.bgColor} border border-opacity-40`}
            style={{ borderColor: errorConfig.color.replace('text-', '') + '40' }}
          >
            <ErrorIcon className={`w-12 h-12 ${errorConfig.color}`} />
          </motion.div>

          {/* Error Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white">
              {t(errorConfig.title)}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t(errorConfig.description)}
            </p>
          </motion.div>

          {/* Error Details */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800 rounded-lg p-4 border border-slate-600"
            >
              <p className="text-sm text-slate-300 font-mono break-words">
                {errorMessage}
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-3"
          >
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center justify-center gap-2 bg-butter-yellow hover:bg-butter-yellow/90 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                {t('retry')}
              </button>
            )}
            
            <button
              onClick={onBack || (() => window.history.back())}
              className="flex items-center justify-center gap-2 text-slate-400 hover:text-white px-6 py-3 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('goBack')}
            </button>
          </motion.div>

          {/* Help Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-slate-500 space-y-2"
          >
            <p>{t('needHelp')}</p>
            <div className="flex justify-center gap-4">
              <button className="text-slate-400 hover:text-white transition-colors underline">
                {t('contactSupport')}
              </button>
              <button className="text-slate-400 hover:text-white transition-colors underline">
                {t('viewDocs')}
              </button>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}