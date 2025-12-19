import { useEffect, useState } from 'react';

import { Box } from '@mui/material';

import {
  ScrollDirection,
  useIsScrolledAtTop,
  useScrolledContinuosly,
} from '../scrolling';
import './TopBar.css';

const useTopbarHeight = (): number | null => {
  const [topbarHeight, setTopbarHeight] = useState<number | null>(null);

  useEffect(() => {
    const fn = () => {
      const topbar = document.getElementById('topbar');
      if (topbar) {
        setTopbarHeight(topbar.offsetHeight);
      }
    };

    fn();

    const ro = new ResizeObserver((_) => {
      fn();
    });

    ro.observe(document.documentElement);

    return () => {
      ro.disconnect();
    };
  }, []);

  return topbarHeight;
};

const useTopbarIsVisible = (): boolean => {
  const [isVisible, setIsVisible] = useState(true);

  const isScrolledAtTop = useIsScrolledAtTop();
  const scrolledContinuoslyUpwards = useScrolledContinuosly(
    ScrollDirection.Upwards,
    280,
  );
  const scrolledContinuoslyDownward = useScrolledContinuosly(
    ScrollDirection.Downward,
    1,
  );
  useEffect(() => {
    if (isScrolledAtTop || scrolledContinuoslyUpwards) {
      setIsVisible(true);
    } else if (scrolledContinuoslyDownward) {
      setIsVisible(false);
    }
  }, [isScrolledAtTop, scrolledContinuoslyUpwards]);

  return isVisible;
};

export const TopBar = () => {
  const topbarHeight = useTopbarHeight();
  const topbarIsVisible = useTopbarIsVisible();

  console.log(topbarHeight)

  return (
    <>
      <Box
        id="topbar"
        className={topbarIsVisible ? 'topbar-visible' : 'topbar-hidden'}
      >
        <img src="/logo-1500.png" alt="Logo" className="topbar-logo" />
      </Box>
      {topbarHeight && (
        <Box
          id="topbar-spacer"
          sx={{
            height: `${topbarHeight}px`,
          }}
        ></Box>
      )}
    </>
  );
};
