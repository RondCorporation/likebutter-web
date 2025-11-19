/**
 * Download file from URL using server's Content-Disposition header
 * Works on desktop and mobile browsers without opening blank tabs
 */
export async function downloadFile(
  url: string,
  filename: string
): Promise<void> {
  try {
    console.log('[Download] Starting download:', { url, filename });

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    console.log('[Download] Download triggered successfully');

    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    console.error('[Download] Download failed:', error);
    throw new Error('Download failed. Please try again.');
  }
}

/**
 * Download blob data as a file
 * Use when you already have blob data (e.g., from API response)
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

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Blob download failed:', error);
    throw new Error('Failed to download file');
  }
}

/**
 * Fetch URL and download as blob (advanced use case)
 * Use only when you need download progress tracking or file validation
 * For simple downloads, prefer downloadFile() which uses server headers
 */
export async function downloadFromUrl(
  url: string,
  filename: string
): Promise<void> {
  try {
    console.log('[Download] Fetching file:', { url, filename });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    await downloadBlob(blob, filename);

    console.log('[Download] File downloaded successfully');
  } catch (error) {
    console.error('[Download] Fetch download failed:', error);
    throw new Error('Failed to download file');
  }
}
