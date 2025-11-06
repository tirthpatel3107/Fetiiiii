import { useEffect } from "react";

// utils
import { UI } from "../utils/constants";
import { scrollToBottom } from "../utils/domUtils";

/* Custom hook that automatically scrolls a container to bottom when content changes */
const useScrollToBottom = (containerRef, dependencies = [], options = {}) => {
  const { delay = UI.SCROLL_DELAY, scrollOnMount = true } = options;

  // Scroll to bottom on initial render
  useEffect(() => {
    if (scrollOnMount && containerRef?.current) {
      scrollToBottom(containerRef.current);
    }
  }, [scrollOnMount, containerRef]);

  // Scroll to bottom when dependencies change
  useEffect(() => {
    if (
      containerRef?.current &&
      dependencies.some((dep) => dep !== null && dep !== undefined)
    ) {
      scrollToBottom(containerRef.current, delay);
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useScrollToBottom;
