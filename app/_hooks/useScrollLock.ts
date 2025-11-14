import { useEffect } from 'react';

/**
 * Hook to prevent background scroll when a modal/popup is open
 * Handles both desktop and mobile (including iOS) scenarios
 *
 * @param isOpen - Whether the modal/popup is open
 */
export function useScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // Save current scroll position
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    // Store original styles
    const originalBodyOverflow = body.style.overflow;
    const originalBodyPosition = body.style.position;
    const originalBodyTop = body.style.top;
    const originalBodyWidth = body.style.width;
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyTouchAction = body.style.touchAction;
    const originalHtmlTouchAction = html.style.touchAction;

    // Apply scroll lock styles
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    html.style.overflow = 'hidden';

    // iOS Safari overscroll bounce prevention
    body.style.touchAction = 'none';
    html.style.touchAction = 'none';

    // Prevent touchmove on document to stop overscroll bounce
    const preventTouchMove = (e: TouchEvent) => {
      if (e.target === document.body || e.target === html) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventTouchMove, {
      passive: false,
    });

    // Cleanup function
    return () => {
      // Restore original styles
      body.style.overflow = originalBodyOverflow;
      body.style.position = originalBodyPosition;
      body.style.top = originalBodyTop;
      body.style.width = originalBodyWidth;
      html.style.overflow = originalHtmlOverflow;
      body.style.touchAction = originalBodyTouchAction;
      html.style.touchAction = originalHtmlTouchAction;

      // Remove event listener
      document.removeEventListener('touchmove', preventTouchMove);

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
}
