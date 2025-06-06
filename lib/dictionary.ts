export const dictionary = {
  en: {
    nav: {
      about: 'About',
      features: 'Features',
      demo: 'Demo',
      pricing: 'Pricing',
      contact: 'Contact',
    },
    login: 'Login',
    signup: 'Sign up',
    logout: 'Logout',
    settings: 'Settings',
    account: 'Account',
    general: 'General',
    subscription: 'Subscription',
    notifications: 'Notifications',
    selectLang: 'Select Language',
    english: 'English',
    korean: 'Korean',
    sendMessage: 'Send Message',
    viewPlans: 'View Plans',
    startStudio: 'Start Butter Studio',
  },
  ko: {
    nav: {
      about: '소개',
      features: '특징',
      demo: '데모',
      pricing: '요금제',
      contact: '문의하기',
    },
    login: '로그인',
    signup: '회원가입',
    logout: '로그아웃',
    settings: '설정',
    account: '계정',
    general: '일반',
    subscription: '구독',
    notifications: '알림',
    selectLang: '언어 선택',
    english: '영어',
    korean: '한국어',
    sendMessage: '메시지 보내기',
    viewPlans: '요금제 보기',
    startStudio: 'Butter Studio 시작하기',
  },
} as const;

export type Locale = keyof typeof dictionary;

export function getDictionary(lang: Locale) {
  return dictionary[lang];
}
