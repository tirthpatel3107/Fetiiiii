import { useEffect, useRef } from "react";

// utils
import { UI } from "../utils/constants";
import { scrollToBottom, getComputedStyleInt } from "../utils/domUtils";

/* Custom hook for auto-growing textarea that adjusts height based on content */
const useAutoGrowTextarea = (value, options = {}) => {
  const textareaRef = useRef(null);
  const {
    maxRows = UI.TEXTAREA_MAX_ROWS,
    defaultLineHeight = UI.TEXTAREA_DEFAULT_LINE_HEIGHT,
    scrollContainerRef = null,
  } = options;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const lineHeight = getComputedStyleInt(
      textarea,
      "lineHeight",
      defaultLineHeight,
    );
    const maxHeight = lineHeight * maxRows;

    // Set height based on content, with max constraint
    if (scrollHeight <= maxHeight) {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    } else {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto";
    }

    // When textarea height changes, scroll content section to bottom
    // This makes content appear to move up as textarea expands
    if (scrollContainerRef?.current) {
      scrollToBottom(scrollContainerRef.current);
    }
  }, [value, maxRows, defaultLineHeight, scrollContainerRef]);

  return textareaRef;
};

export default useAutoGrowTextarea;
