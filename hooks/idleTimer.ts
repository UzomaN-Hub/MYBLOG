import { useEffect, useRef, useCallback } from 'react';

export function useIdleTimer(onIdle: () => void, idleTime = 120000) { // 120 seconds = 2 minutes
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onIdle();
    }, idleTime);
  }, [onIdle, idleTime]);

  useEffect(() => {
    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Reset timer on any activity
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    // initial timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [idleTime, resetTimer]);
}