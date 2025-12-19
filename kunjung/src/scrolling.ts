import { useEffect, useRef, useState } from 'react';

export enum ScrollDirection {
  Upwards,
  Downward,
}

export const useIsScrolledAtTop = (): boolean => {
  const [isAtTop, setIsAtTop] = useState<boolean>(window.scrollY < 20);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isAtTop;
};

export const useScrolledContinuosly = (
  direction: ScrollDirection,
  pixelsCount: number,
): boolean => {
  const [hasScrolledContinuously, setHasScrolledContinuously] =
    useState<boolean>(false);
  const previousY = useRef<number>(window.scrollY);
  const startY = useRef<number>(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const newY = window.scrollY;
      const diff = newY - previousY.current;

      // Check if scrolling in opposite direction - reset
      if (direction === ScrollDirection.Upwards && diff > 0) {
        // Scrolling down when we're tracking upward
        startY.current = newY;
        setHasScrolledContinuously(false);
      } else if (direction === ScrollDirection.Downward && diff < 0) {
        // Scrolling up when we're tracking downward
        startY.current = newY;
        setHasScrolledContinuously(false);
      } else {
        // Scrolling in the correct direction
        const distanceTraveled = Math.abs(newY - startY.current);

        if (distanceTraveled >= pixelsCount) {
          setHasScrolledContinuously(true);
        }
      }

      previousY.current = newY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [direction, pixelsCount]);

  return hasScrolledContinuously;
};
