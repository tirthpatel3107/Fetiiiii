import { useCallback } from "react";

/**
 * Hook that provides a function to format bot response text for better readability
 * @returns {Function} formatBotResponse - Function that formats bot response text
 */
const useFormatBotResponse = () => {
  const formatBotResponse = useCallback((text) => {
    if (!text) return "";

    // Remove markdown formatting
    let formatted = text
      .replace(/\*\*/g, "") // Remove markdown asterisks
      .replace(/\*/g, "") // Remove single asterisks
      .trim();

    // Check if this looks like a numbered list response
    if (formatted.includes("1.") && formatted.includes("2.")) {
      // Split into sentences and rebuild with proper formatting
      const parts = formatted.split(/(\d+\.\s)/);

      let result = "";

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // If this is a number marker (1., 2., etc.)
        if (/^\d+\.\s$/.test(part)) {
          result += "\n\n" + part;
        }
        // If this is content after a number
        else if (i > 0 && /^\d+\.\s$/.test(parts[i - 1])) {
          result += part;
        }
        // First part (before any numbers)
        else if (i === 0) {
          result += part;
        }
        // Other parts
        else {
          result += part;
        }
      }

      formatted = result.replace(/^\n+/, "").trim();
    }

    // Normalize all newlines: convert any sequence of 1+ newlines to exactly one newline
    // This ensures \n\n and \n both create exactly one blank line
    formatted = formatted.replace(/\n+/g, "\n\n");

    // Clean up: remove leading/trailing newlines
    formatted = formatted.replace(/^\n+/, "").replace(/\n+$/, "");

    return formatted;
  }, []);

  return formatBotResponse;
};

export default useFormatBotResponse;

