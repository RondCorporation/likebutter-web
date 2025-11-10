/**
 * 파일을 다운로드하는 유틸리티 함수
 */
export async function downloadFile(
  url: string,
  filename: string
): Promise<void> {
  try {
    console.log('[Download] Starting download:', { url, filename });

    // 링크 생성 및 클릭
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    link.target = '_blank'; // 새 탭에서 열기 (iOS Safari에서 더 안정적)
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    console.log('[Download] Download triggered successfully');

    // 클린업
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    console.error('[Download] Download failed:', error);
    throw new Error('Download failed. Please try again.');
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
