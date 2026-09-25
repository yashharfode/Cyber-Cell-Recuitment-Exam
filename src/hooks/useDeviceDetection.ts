import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    const isTouch = typeof window !== 'undefined' ? ('ontouchstart' in window || navigator.maxTouchPoints > 0) : false;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    return {
      isMobile,
      isTablet,
      isTouch,
      viewportWidth: width,
      viewportHeight: height,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      setDeviceInfo({
        isMobile,
        isTablet,
        isTouch,
        viewportWidth: width,
        viewportHeight: height,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}
