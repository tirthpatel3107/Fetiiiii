import React, { useRef, useEffect, useState } from "react";

// hooks
import useTypewriter from "../../hooks/useTypewriter";

// utils
import { scrollToBottom } from "../../utils/domUtils";

// Track which messages have already been animated (persists across component instances)
const animatedMessageIds = new Set();

/* AnimatedMessage Component - Displays assistant messages with word-by-word typewriter animation */
const AnimatedMessage = ({
  message = "",
  messageId,
  speed = 50,
  scrollContainerRef,
}) => {
  const previousMessageRef = useRef("");
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const previousDisplayedTextRef = useRef("");

  // Determine if we should animate this message
  useEffect(() => {
    // Only animate if message has content, hasn't been animated before, and transitions from loading to loaded
    const hasContent = message && message.trim().length > 0;
    const wasEmpty =
      !previousMessageRef.current ||
      previousMessageRef.current.trim().length === 0;
    const isNewContent = hasContent && wasEmpty;
    const notAnimatedYet = !animatedMessageIds.has(messageId);

    if (isNewContent && notAnimatedYet) {
      setShouldAnimate(true);
      animatedMessageIds.add(messageId);
    } else if (!hasContent) {
      // Message is loading, don't animate yet
      setShouldAnimate(false);
    } else if (animatedMessageIds.has(messageId)) {
      // Already animated, show full text immediately
      setShouldAnimate(false);
    }

    previousMessageRef.current = message;
  }, [message, messageId]);

  // Use typewriter hook for animation
  const displayedText = useTypewriter(message, speed, shouldAnimate);

  // Scroll to bottom when text is being animated
  useEffect(() => {
    // Only scroll if animating, text changed, and scroll container ref exists
    if (
      shouldAnimate &&
      displayedText !== previousDisplayedTextRef.current &&
      displayedText.length > 0 &&
      scrollContainerRef?.current
    ) {
      scrollToBottom(scrollContainerRef.current);
      previousDisplayedTextRef.current = displayedText;
    }
  }, [displayedText, shouldAnimate, scrollContainerRef]);

  return <>{displayedText}</>;
};

export default AnimatedMessage;
