/**
 * iOS 기기 감지
 */
function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  // iPad, iPhone, iPod 감지
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    return true;
  }

  // iPad Pro (iPadOS 13+)는 MacIntel로 표시됨
  // @ts-ignore - platform은 deprecated지만 iOS 감지에 여전히 필요
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return true;
  }

  return false;
}

/**
 * 이미지를 iOS에서 다운로드 (fetch + base64 방식)
 */
async function downloadImageForiOS(
  url: string,
  filename: string
): Promise<void> {
  try {
    // 이미지를 fetch로 가져오기
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const blob = await response.blob();

    // Blob을 base64로 변환
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;

      // 새 탭에서 이미지 열기
      const newWindow = window.open('', '_blank');

      if (newWindow) {
        // HTML 컨텐츠를 작성
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${filename}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body {
                  margin: 0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background: #000;
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
                .instructions {
                  color: white;
                  padding: 20px;
                  text-align: center;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  font-size: 14px;
                }
                .instructions p {
                  margin: 5px 0;
                }
              </style>
            </head>
            <body>
              <div class="instructions">
                <p>📥 이미지를 길게 눌러서 저장하세요</p>
                <p>📥 Long press the image to save</p>
              </div>
              <img src="${base64data}" alt="${filename}" />
            </body>
          </html>
        `;

        // @ts-ignore - document.write는 deprecated지만 새 창에 컨텐츠를 쓰는데 필요
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      } else {
        throw new Error('Failed to open new window. Please allow popups.');
      }
    };
    reader.onerror = () => {
      throw new Error('Failed to read blob');
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('iOS image download failed:', error);
    throw error;
  }
}

/**
 * 오디오 파일을 새 탭에서 열기 (iOS용)
 */
async function downloadAudioForiOS(url: string): Promise<void> {
  // iOS에서는 오디오를 새 탭에서 열어서 사용자가 직접 다운로드하도록 함
  const newWindow = window.open(url, '_blank');

  if (!newWindow) {
    throw new Error('Failed to open new window. Please allow popups.');
  }
}

/**
 * 파일을 다운로드하는 유틸리티 함수
 */
export async function downloadFile(
  url: string,
  filename: string
): Promise<void> {
  try {
    const isIOSDevice = isIOS();

    // 파일 확장자 확인
    const extension = filename.split('.').pop()?.toLowerCase();
    const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(
      extension || ''
    );
    const isAudio = ['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '');

    // iOS 기기인 경우 특수 처리
    if (isIOSDevice) {
      if (isImage) {
        // 이미지는 fetch + base64 방식으로 처리
        await downloadImageForiOS(url, filename);
        return;
      } else if (isAudio) {
        // 오디오는 새 탭에서 열기
        await downloadAudioForiOS(url);
        return;
      }
    }

    // 일반적인 다운로드 방식 (데스크톱, Android)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;

    // Safari를 위한 timeout 추가
    document.body.appendChild(link);

    // setTimeout을 사용하여 Safari의 비동기 처리 지원
    setTimeout(() => {
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
    }, 0);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}
