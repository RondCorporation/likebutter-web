import { Metadata } from 'next';
import initTranslations from '@/lib/i18n-server';
import LoginClient from './_components/LoginClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);
  return {
    title: t('loginTitle'),
  };
}

export default async function LoginPage({ params }: Props) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);

  const translations = {
    loginTitle: t('loginTitle'),
    loginEmailPlaceholder: t('loginEmailPlaceholder'),
    loginPasswordPlaceholder: t('loginPasswordPlaceholder'),
    loginButton: t('loginButton'),
    loginButtonLoggingIn: t('loginButtonLoggingIn'),
    loginSignupPrompt: t('loginSignupPrompt'),
    loginSignupLink: t('loginSignupLink'),
    loginOrContinueWith: t('loginOrContinueWith'),
    loginRecentlyUsed: t('loginRecentlyUsed'),
    loginSessionExpired: t('loginSessionExpired'),
    loginErrorInvalidEmail: t('loginErrorInvalidEmail'),
    loginErrorInvalidPassword: t('loginErrorInvalidPassword'),
  };

  return <LoginClient lang={lang} translations={translations} />;
}
