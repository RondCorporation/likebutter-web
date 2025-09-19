'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

// Dynamic import of react-markdown to reduce initial bundle size
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: true,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  ),
});

type ReactMarkdownProps = ComponentProps<typeof ReactMarkdown>;

export default function DynamicMarkdown(props: ReactMarkdownProps) {
  return <ReactMarkdown {...props} />;
}
