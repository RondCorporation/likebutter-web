// app/_lib/portone.ts
import type PortOne from '@portone/browser-sdk/v2';

// PortOne SDK 로딩 프로미스를 저장할 변수 (싱글톤 패턴)
let portonePromise: Promise<typeof PortOne> | null = null;

/**
 * Portone SDK를 동적으로 로드하고 초기화합니다.
 * 이 함수는 애플리케이션 전체에서 단 한 번만 SDK를 로드하도록 보장합니다.
 * @returns {Promise<typeof PortOne>} PortOne SDK 객체를 반환하는 프로미스
 */
export function loadPortone(): Promise<typeof PortOne> {
  if (portonePromise) {
    // 이미 로딩 요청이 시작되었다면 해당 프로미스를 재사용
    return portonePromise;
  }

  // 로딩 프로미스를 생성하고 변수에 할당
  portonePromise = new Promise((resolve, reject) => {
    // dynamic import를 사용하여 SDK를 비동기적으로 로드
    import('@portone/browser-sdk/v2')
      .then((module) => {
        if (module.default) {
          console.log('✅ PortOne SDK loaded successfully.');
          resolve(module.default);
        } else {
          // 모듈은 로드되었으나 default export가 없는 경우
          reject(
            new Error('Failed to load Portone SDK: Default export not found.')
          );
        }
      })
      .catch((error) => {
        console.error('PortOne SDK dynamic import failed:', error);
        portonePromise = null; // 실패 시 다음 호출에서 재시도할 수 있도록 초기화
        reject(error);
      });
  });

  return portonePromise;
}
