import { useState, useEffect, useRef } from "react";

import { ANIMATION } from "../utils/constants";
import { findLoadingMessage } from "../utils/messageUtils";
import { randomArrayIndex } from "../utils/eventUtils";

/**
 * Custom hook for rotating loading messages on mobile
 * @param {boolean} isEnabled - Whether rotation is enabled (e.g., isMobile)
 * @param {Array} conversationHistory - Array of conversation messages
 * @param {Array} messages - Array of loading messages to rotate
 * @param {number} interval - Rotation interval in milliseconds (default: ANIMATION.LOADING_MESSAGE_ROTATION_INTERVAL)
 * @returns {number} Current message index
 */
const useLoadingMessageRotation = (
  isEnabled,
  conversationHistory,
  messages,
  interval = ANIMATION.LOADING_MESSAGE_ROTATION_INTERVAL
) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const loadingMessageIdRef = useRef(null);

  useEffect(() => {
    if (!isEnabled || !messages || messages.length === 0) return;

    // Find the current loading message
    const loadingMessage = findLoadingMessage(conversationHistory);

    if (!loadingMessage) {
      // No loading message, reset state
      if (loadingMessageIdRef.current !== null) {
        loadingMessageIdRef.current = null;
        setCurrentMessageIndex(0);
      }
      return;
    }

    // If this is a new loading message, initialize with random start
    if (loadingMessageIdRef.current !== loadingMessage.id) {
      loadingMessageIdRef.current = loadingMessage.id;
      const randomStartIndex = randomArrayIndex(messages);
      setCurrentMessageIndex(randomStartIndex);
    }

    // Rotate messages at specified interval
    const rotationInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, interval);

    return () => clearInterval(rotationInterval);
  }, [isEnabled, conversationHistory, messages, interval]);

  return currentMessageIndex;
};

export default useLoadingMessageRotation;

