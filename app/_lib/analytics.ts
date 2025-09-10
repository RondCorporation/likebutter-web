'use client';

// Google Analytics 추적 ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

// gtag 타입 정의
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | Record<string, any>,
      config?: Record<string, any>
    ) => void;
  }
}

/**
 * Google Analytics가 로드되었는지 확인
 */
function isGALoaded(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    !!GA_TRACKING_ID &&
    process.env.NODE_ENV === 'production'
  );
}

/**
 * 페이지 뷰 추적
 */
export function trackPageView(url: string, title?: string): void {
  if (!isGALoaded()) return;

  window.gtag('config', GA_TRACKING_ID!, {
    page_title: title || document.title,
    page_location: url,
    send_page_view: true,
  });
}

/**
 * 사용자 이벤트 추적
 */
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export function trackEvent({
  action,
  category,
  label,
  value,
  custom_parameters = {},
}: GAEvent): void {
  if (!isGALoaded()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...custom_parameters,
  });
}

/**
 * 사용자 속성 설정
 */
export function setUserProperties(properties: Record<string, any>): void {
  if (!isGALoaded()) return;

  window.gtag('set', properties);
}

/**
 * 커스텀 차원/메트릭 설정
 */
export function setCustomDimensions(dimensions: Record<string, string>): void {
  if (!isGALoaded()) return;

  window.gtag('config', GA_TRACKING_ID!, {
    ...dimensions,
  });
}

// 미리 정의된 이벤트 추적 함수들

/**
 * 회원가입 추적
 */
export function trackSignup(method: string): void {
  trackEvent({
    action: 'sign_up',
    category: 'engagement',
    label: method,
  });
}

/**
 * 로그인 추적
 */
export function trackLogin(method: string): void {
  trackEvent({
    action: 'login',
    category: 'engagement',
    label: method,
  });
}

/**
 * 구매 추적
 */
export function trackPurchase(
  transactionId: string,
  value: number,
  currency = 'KRW'
): void {
  trackEvent({
    action: 'purchase',
    category: 'ecommerce',
    custom_parameters: {
      transaction_id: transactionId,
      currency: currency,
    },
    value: value,
  });
}

/**
 * AI 도구 사용 추적
 */
export function trackAIToolUsage(toolName: string, taskType?: string): void {
  trackEvent({
    action: 'ai_tool_used',
    category: 'studio',
    label: toolName,
    custom_parameters: {
      tool_name: toolName,
      task_type: taskType,
    },
  });
}

/**
 * 파일 다운로드 추적
 */
export function trackFileDownload(fileName: string, fileType: string): void {
  trackEvent({
    action: 'file_download',
    category: 'engagement',
    label: fileName,
    custom_parameters: {
      file_name: fileName,
      file_type: fileType,
    },
  });
}

/**
 * 검색 추적
 */
export function trackSearch(searchTerm: string, category?: string): void {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    custom_parameters: {
      search_term: searchTerm,
      search_category: category,
    },
  });
}

/**
 * 비디오 재생 추적
 */
export function trackVideoPlay(
  videoTitle: string,
  videoDuration?: number
): void {
  trackEvent({
    action: 'video_play',
    category: 'engagement',
    label: videoTitle,
    custom_parameters: {
      video_title: videoTitle,
      video_duration: videoDuration,
    },
  });
}

/**
 * 폼 제출 추적
 */
export function trackFormSubmit(formName: string, formType?: string): void {
  trackEvent({
    action: 'form_submit',
    category: 'engagement',
    label: formName,
    custom_parameters: {
      form_name: formName,
      form_type: formType,
    },
  });
}

/**
 * 페이지 스크롤 추적 (90% 스크롤 시)
 */
export function trackScrollDepth(pageTitle: string): void {
  trackEvent({
    action: 'scroll',
    category: 'engagement',
    label: '90%',
    custom_parameters: {
      page_title: pageTitle,
      scroll_depth: 90,
    },
  });
}

/**
 * 오류 추적
 */
export function trackError(
  errorMessage: string,
  errorCategory = 'javascript_error'
): void {
  trackEvent({
    action: 'exception',
    category: 'error',
    label: errorMessage,
    custom_parameters: {
      error_category: errorCategory,
      fatal: false,
    },
  });
}

/**
 * 사용자 세션 시작 시 호출할 초기화 함수
 */
export function initializeAnalytics(userId?: string): void {
  if (!isGALoaded()) return;

  if (userId) {
    window.gtag('config', GA_TRACKING_ID!, {
      user_id: userId,
    });
  }

  // 사용자 속성 설정
  setUserProperties({
    app_version: '1.0.0',
    platform: 'web',
  });
}
