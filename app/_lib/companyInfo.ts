/**
 * 론드코퍼레이션 회사 정보
 * PG사 승인 요건 및 법적 고지사항용 상수
 */

export const COMPANY_INFO = {
  // 기본 정보
  name: {
    ko: '론드코퍼레이션 주식회사',
    en: 'Rond Corporation Inc.',
  },
  ceo: '김동연',
  businessNumber: '645-86-03935',

  // 주소 정보
  address: {
    full: '서울특별시 강남구 테헤란로70길 12, 402-제이143호(대치동, H 타워)',
    short: '서울특별시 강남구 테헤란로70길 12, H타워',
    zipCode: '06193',
  },

  // 연락처
  contact: {
    business: 'biz@rondcorp.ai',
    support: 'info@rondcorp.com',
    phone: '+82 10-5231-1263',
  },

  // 사업 정보
  business: {
    type: '영리법인의 본점',
    sector: '정보통신업',
    description: '인공지능, 응용 소프트웨어 개발 및 공급',
    taxType: '부가가치세 일반과세자',
    status: '계속사업자',
  },

  // 서비스 정보
  service: {
    name: 'LikeButter',
    domain: 'likebutter.ai',
  },
} as const;

// 국제화 키와 매핑
export const COMPANY_I18N_KEYS = {
  companyName: 'companyName',
  companyAddress: 'companyAddress',
  footerBusinessInquiries: 'footerBusinessInquiries',
  footerGeneralSupport: 'footerGeneralSupport',
} as const;
