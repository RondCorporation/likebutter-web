'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

// Dynamic import of framer-motion to reduce initial bundle size
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  {
    ssr: false,
    loading: () => <div className="opacity-0" />, // Fallback while loading
  }
);

type MotionDivProps = ComponentProps<typeof MotionDiv>;

export default function DynamicMotionDiv(props: MotionDivProps) {
  return <MotionDiv {...props} />;
}
