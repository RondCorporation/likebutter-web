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
  '{{COMPANY_CONTACT_PHONE}}': '02-1234-5678',
  '{{DPO_NAME}}': '김동연',
  '{{DPO_DEPARTMENT}}': '론드코퍼레이션',
  '{{DPO_POSITION}}': '대표',
  '{{DPO_EMAIL}}': 'info@rondcorp.com',
  '{{DPO_PHONE}}': '+82 10 5231 1263',
  '{{CLOUD_PROVIDER_NAME}}': 'Amazon Web Services, Vercel',
};

async function getPrivacyContent(lang: 'en' | 'ko'): Promise<string> {
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'policies',
      `privacy_${lang}.md`
    );
    let text = await fs.readFile(filePath, 'utf-8');

    for (const [key, value] of Object.entries(variables)) {
      text = text.replace(new RegExp(key, 'g'), value);
    }
    return text;
  } catch (error) {
    console.error(`Failed to load privacy policy for ${lang}:`, error);
    return 'Error: Could not load the privacy policy. Please try again later.';
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);
  return {
    title: t('privacyPolicy'),
    description: t('privacyPolicySubtitle'),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const content = await getPrivacyContent(lang);
  const { t } = await initTranslations(lang, ['common']);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-32 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-accent md:text-4xl mb-4">
          {t('privacyPolicy')}
        </h1>
        <div className="border-b border-slate-700 inline-block mb-8 md:mb-12">
          <Link
            href="/en/privacy"
            className={`px-4 py-2 text-base font-semibold transition-colors duration-200 border-b-2 ${
              lang === 'en'
                ? 'text-accent border-accent'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            English
          </Link>
          <Link
            href="/ko/privacy"
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
