'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnchorHTMLAttributes, ClassAttributes } from 'react';
import { ExtraProps } from 'react-markdown';

export default function PrivacyPage() {
  const [language, setLanguage] = useState<'en' | 'ko'>('en');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const variables = {
    '{{EFFECTIVE_DATE}}': 'July 1, 2025',
    '{{COMPANY_NAME}}': '론드코퍼레이션(Rond Corporation)',
    '{{COMPANY_ADDRESS}}': '서울특별시 강남구 테헤란로70길 12, H타워',
    '{{COMPANY_CONTACT_EMAIL}}': 'info@rondcorp.com',
    '{{COMPANY_CONTACT_PHONE}}': '02-1234-5678',
    '{{DPO_NAME}}': '김동연',
    '{{DPO_DEPARTMENT}}': '론드코퍼레이션',
    '{{DPO_POSITION}}': '대표',
    '{{DPO_EMAIL}}': 'info@rondcorp.com',
    '{{DPO_PHONE}}': '+82 10 5231 1263',
    '{{CLOUD_PROVIDER_NAME}}': 'Amazon Web Services, Vercel',
  };

  useEffect(() => {
    const fetchAndProcessMarkdown = async () => {
      setIsLoading(true);
      try {
        // public 폴더에 있는 마크다운 파일을 fetch 합니다.
        const response = await fetch(`/policies/privacy_${language}.md`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let text = await response.text();

        // 변수들을 실제 값으로 치환합니다.
        for (const [key, value] of Object.entries(variables)) {
          text = text.replace(new RegExp(key, 'g'), value);
        }

        setContent(text);
      } catch (error) {
        console.error('Failed to load privacy policy:', error);
        setContent(
          'Error: Could not load the privacy policy. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessMarkdown();
  }, [language]); // 언어가 변경될 때마다 이 effect를 다시 실행합니다.

  return (
    <div className="container mx-auto p-4 md:p-8 bg-black text-white min-h-screen pt-24 md:pt-28">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-accent mb-4">
          Privacy Policy
        </h1>
        <div className="border-b border-slate-700 inline-block mb-8 md:mb-12">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 text-base font-semibold transition-colors duration-200 border-b-2 ${
              language === 'en'
                ? 'text-accent border-accent'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ko')}
            className={`px-4 py-2 text-base font-semibold transition-colors duration-200 border-b-2 ${
              language === 'ko'
                ? 'text-accent border-accent'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            한국어
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        {isLoading ? (
          <p className="text-center text-slate-400">Loading...</p>
        ) : (
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                a: ({
                  node,
                  ...props
                }: ClassAttributes<HTMLAnchorElement> &
                  AnchorHTMLAttributes<HTMLAnchorElement> &
                  ExtraProps) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
