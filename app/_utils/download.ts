/**
 * 파일을 다운로드하는 유틸리티 함수
 * 모든 플랫폼(PC, Mobile, iOS)에서 작동하는 통합된 다운로드 방식
 */
export async function downloadFile(
  url: string,
  filename: string
): Promise<void> {
  try {
    // 방법 1: 직접 다운로드 시도 (가장 깔끔한 방법)
    // 대부분의 최신 브라우저에서 작동 (iOS Safari 제외)
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);

    // 클릭 이벤트 트리거
    link.click();

    // 클린업
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    // iOS Safari나 다른 브라우저에서 download 속성이 무시될 수 있음
    // 이 경우 브라우저는 파일을 새 탭에서 열거나 다운로드 매니저를 사용함

  } catch (error) {
    console.error('Download failed:', error);

    // 방법 2: 실패 시 현재 탭에서 URL 열기
    // iOS Safari는 이 방법으로 다운로드 매니저를 트리거함
    try {
      window.location.href = url;
    } catch (fallbackError) {
      // 방법 3: 최후의 수단 - 새 탭에서 열기
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        throw new Error(
          'Download failed. Please check your popup blocker settings.'
        );
      }
    }
  }
}

/**
 * Blob 데이터를 파일로 다운로드하는 함수
 * API 응답에서 받은 blob을 다운로드할 때 사용
 */
export async function downloadBlob(
  blob: Blob,
  filename: string
): Promise<void> {
  try {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // 클린업
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

  } catch (error) {
    console.error('Blob download failed:', error);
    throw new Error('Failed to download file');
  }
}
