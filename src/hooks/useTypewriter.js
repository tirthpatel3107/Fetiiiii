import { useState, useEffect, useRef } from "react";

/**
 * Custom hook for animating text word-by-word (typewriter effect)
 * @param {string} text - The full text to animate
 * @param {number} speed - Delay between words in milliseconds (default: 50)
 * @param {boolean} enabled - Whether the animation is enabled (default: true)
 * @returns {string} The animated text that should be displayed
 */
const useTypewriter = (text = "", speed = 50, enabled = true) => {
  const [displayedText, setDisplayedText] = useState("");
  const wordsRef = useRef([]);
  const currentIndexRef = useRef(0);
  const timeoutRef = useRef(null);
  const previousTextRef = useRef(text);

  useEffect(() => {
    // If animation is disabled, show full text immediately
    if (!enabled || !text) {
      setDisplayedText(text);
      previousTextRef.current = text;
      return;
    }

    // Reset animation when text changes
    if (previousTextRef.current !== text) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      wordsRef.current = [];
      currentIndexRef.current = 0;
      setDisplayedText("");
      previousTextRef.current = text;
    }

    // Split text into words, preserving spaces and punctuation
    // This regex splits on word boundaries while keeping spaces
    if (wordsRef.current.length === 0 && text) {
      wordsRef.current = text.split(/(\s+)/);
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Function to display next word
    const displayNextWord = () => {
      if (currentIndexRef.current < wordsRef.current.length) {
        const wordsToShow = wordsRef.current.slice(0, currentIndexRef.current + 1);
        setDisplayedText(wordsToShow.join(""));
        currentIndexRef.current += 1;
        
        // Schedule next word
        timeoutRef.current = setTimeout(displayNextWord, speed);
      }
    };

    // Start animation if we have words to display
    if (wordsRef.current.length > 0 && currentIndexRef.current < wordsRef.current.length) {
      displayNextWord();
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return displayedText;
};

export default useTypewriter;

