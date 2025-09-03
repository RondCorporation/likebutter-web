import { promises as fs } from 'fs';
import path from 'path';
import { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { AnchorHTMLAttributes, ClassAttributes } from 'react';
import { ExtraProps } from 'react-markdown';
import initTranslations from '@/lib/i18n-server';

type Props = {
  params: Promise<{ lang: 'en' | 'ko' }>;
};

const variables = {
  '{{EFFECTIVE_DATE}}': 'July 1, 2025',
  '{{COMPANY_NAME}}': '론드코퍼레이션(Rond Corporation)',
  '{{COMPANY_ADDRESS}}': '서울특별시 강남구 테헤란로70길 12, H타워',
  '{{COMPANY_CONTACT_EMAIL}}': 'info@rondcorp.com',
  '{{COMPANY_CONTACT_PHONE}}': '+82 10-5231-1263',
  '{{SERVICE_NAME}}': 'LikeButter',
  '{{SERVICE_URL}}': 'https://likebutter.ai',
  '{{REFUND_PERIOD}}': '14일',
  '{{CANCELLATION_PERIOD}}': '서비스 제공 7일 전',
};

async function getTermsContent(lang: 'en' | 'ko'): Promise<string> {
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'policies',
      `terms_${lang}.md`
    );
    let text = await fs.readFile(filePath, 'utf-8');

    for (const [key, value] of Object.entries(variables)) {
      text = text.replace(new RegExp(key, 'g'), value);
    }
    return text;
  } catch (error) {
    return 'Error: Could not load the terms of service. Please try again later.';
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);
  return {
    title: t('termsOfService'),
    description: '서비스 이용약관 및 환불 정책',
  };
}

export default async function TermsPage({ params }: Props) {
  const { lang } = await params;
  const content = await getTermsContent(lang);
  const { t } = await initTranslations(lang, ['common']);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-32 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-accent md:text-4xl mb-4">
          {t('termsOfService')}
        </h1>
        <div className="border-b border-slate-700 inline-block mb-8 md:mb-12">
          <Link
            href="/en/terms"
            className={`px-4 py-2 text-base font-semibold transition-colors duration-200 border-b-2 ${
              lang === 'en'
                ? 'text-accent border-accent'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            English
          </Link>
          <Link
            href="/ko/terms"
            className={`px-4 py-2 text-base font-semibold transition-colors duration-200 border-b-2 ${
              lang === 'ko'
                ? 'text-accent border-accent'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            한국어
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
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
      </div>
    </div>
  );
}
