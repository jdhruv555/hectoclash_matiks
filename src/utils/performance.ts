import { useCallback, useRef, useEffect, useState } from 'react';

// Cleanup function for game resources
export const cleanupGameResources = () => {
  // Clear any intervals
  const intervals = window.setInterval(() => {}, 0);
  for (let i = 0; i < intervals; i++) {
    window.clearInterval(i);
  }
  
  // Clear any timeouts
  const timeouts = window.setTimeout(() => {}, 0);
  for (let i = 0; i < timeouts; i++) {
    window.clearTimeout(i);
  }
  
  // Clear any animation frames
  const frame = window.requestAnimationFrame(() => {});
  for (let i = 0; i < frame; i++) {
    window.cancelAnimationFrame(i);
  }
};

// Debounce hook for performance optimization
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
};

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (lastRun.current && now - lastRun.current <= delay) {
        // If the function was called within the delay period,
        // schedule it to be called after the delay
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastRun.current = now;
          callback(...args);
        }, delay);

        return;
      }

      lastRun.current = now;
      callback(...args);
    },
    [callback, delay]
  ) as T;
};

// Memoize expensive calculations
export const useMemoizedValue = <T>(value: T, dependencies: any[]): T => {
  const [memoizedValue, setMemoizedValue] = useState<T>(value);

  useEffect(() => {
    setMemoizedValue(value);
  }, dependencies);

  return memoizedValue;
};

// Request animation frame hook for smooth animations
export const useAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback();
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
}; 