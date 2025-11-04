/**
 * 파일을 다운로드하는 유틸리티 함수
 * 모든 플랫폼(PC, Mobile, iOS)에서 작동하는 통합된 다운로드 방식
 */
export async function downloadFile(
  url: string,
  filename: string
): Promise<void> {
  try {
    console.log('[Download] Starting download:', { url, filename });

    // 먼저 fetch로 파일을 가져와서 blob으로 변환
    // S3 CORS가 설정되어 있으면 이 방법이 가장 안정적
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const blob = await response.blob();
    console.log('[Download] Blob created:', {
      size: blob.size,
      type: blob.type,
    });

    const blobUrl = window.URL.createObjectURL(blob);

    // blob URL로 다운로드 (페이지 이동 없음)
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';

    // 링크를 DOM에 추가하고 클릭
    document.body.appendChild(link);

    // 클릭 이벤트 트리거 - 이게 실제 다운로드를 시작함
    link.click();

    console.log('[Download] Download triggered successfully');

    // 클린업
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);

  } catch (error) {
    console.error('[Download] Fetch download failed:', error);

    // fetch 실패 시 직접 URL 다운로드 시도 (모바일에서 유용)
    try {
      console.log('[Download] Trying direct download fallback');

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      link.target = '_blank'; // 새 탭에서 열기 (페이지 이동 방지)

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      console.log('[Download] Fallback download triggered');
    } catch (fallbackError) {
      console.error('[Download] Direct download failed:', fallbackError);
      throw new Error('Download failed. Please try again.');
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
