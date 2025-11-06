import { useState, useEffect, useRef } from "react";

// utils
import { UI } from "../utils/constants";

/* Custom hook that detects if content has been scrolled past a threshold */
const useScrollDetection = (threshold = UI.SCROLL_THRESHOLD) => {
  const containerRef = useRef(null);
  const [hasScrolledPastThreshold, setHasScrolledPastThreshold] =
    useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setHasScrolledPastThreshold(scrollTop > threshold);
    };

    container.addEventListener("scroll", handleScroll);
    // Check initial state
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return {
    containerRef,
    hasScrolledPastThreshold,
  };
};

export default useScrollDetection;
