import { useState, useEffect } from "react";

/**
 * Breakpoint constants for consistent resolution detection
 */
export const BREAKPOINTS = {
  MOBILE: 767,      // Mobile devices: <= 767px
  TABLET: 1024,     // Tablet devices: 768px - 1024px
  DESKTOP: 1025,    // Desktop devices: >= 1025px
};

/**
 * Custom hook for detecting screen resolution and device type
 * @returns {Object} Object containing isMobile, isTablet, isDesktop, and windowWidth
 */
const useResolution = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate device types based on breakpoints
  const isMobile = windowWidth <= BREAKPOINTS.MOBILE;
  const isTablet = windowWidth > BREAKPOINTS.MOBILE && windowWidth <= BREAKPOINTS.TABLET;
  const isDesktop = windowWidth >= BREAKPOINTS.DESKTOP;
  const isMobileOrTablet = windowWidth <= BREAKPOINTS.TABLET;

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,
  };
};

export default useResolution;

