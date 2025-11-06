import { useState, useEffect, useRef } from "react";

// utils
import { ANIMATION } from "../utils/constants";
import { findLoadingMessage } from "../utils/messageUtils";
import { randomArrayIndex } from "../utils/eventUtils";

/* Custom hook for rotating loading messages on mobile */
const useLoadingMessageRotation = (
  isEnabled,
  conversationHistory,
  messages,
  interval = ANIMATION.LOADING_MESSAGE_ROTATION_INTERVAL,
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
