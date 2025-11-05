import React, { useRef, useEffect, useState } from "react";
import useTypewriter from "../../hooks/useTypewriter";
import { scrollToBottom } from "../../utils/domUtils";

// Track which messages have already been animated (persists across component instances)
const animatedMessageIds = new Set();

/**
 * Component that displays assistant messages with word-by-word typewriter animation
 * @param {string} message - The message text to display
 * @param {number} messageId - Unique ID of the message (used to trigger animation)
 * @param {number} speed - Animation speed in milliseconds per word (default: 50)
 * @param {React.RefObject} scrollContainerRef - Ref to the scrollable container for auto-scroll
 */
const AnimatedMessage = ({ message = "", messageId, speed = 50, scrollContainerRef }) => {
  const previousMessageRef = useRef("");
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const previousDisplayedTextRef = useRef("");

  // Determine if we should animate this message
  useEffect(() => {
    // Only animate if:
    // 1. Message has content (not empty)
    // 2. Message ID hasn't been animated before
    // 3. Message content has changed from empty to non-empty (transitions from loading to loaded)
    const hasContent = message && message.trim().length > 0;
    const wasEmpty = !previousMessageRef.current || previousMessageRef.current.trim().length === 0;
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

  // Scroll to bottom when text is being animated (displayedText changes)
  useEffect(() => {
    // Only scroll if:
    // 1. We're currently animating (shouldAnimate is true)
    // 2. The displayed text has actually changed
    // 3. We have a scroll container ref
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

