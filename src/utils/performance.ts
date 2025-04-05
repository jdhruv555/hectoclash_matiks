import { useCallback, useRef, useEffect } from 'react';

// Debounce hook for performance optimization
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
  );
};

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const lastRun = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  );
};

// Memoize expensive calculations
export const useMemoizedValue = <T>(value: T, dependencies: any[]) => {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, dependencies);

  return ref.current;
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

// Cleanup utility for game resources
export const cleanupGameResources = () => {
  // Cancel any pending animations
  const animations = document.getAnimations();
  animations.forEach(animation => animation.cancel());

  // Clear any intervals
  const highestIntervalId = window.setInterval(() => {}, 0);
  for (let i = 0; i < highestIntervalId; i++) {
    window.clearInterval(i);
  }

  // Clear any timeouts
  const highestTimeoutId = window.setTimeout(() => {}, 0);
  for (let i = 0; i < highestTimeoutId; i++) {
    window.clearTimeout(i);
  }
}; 