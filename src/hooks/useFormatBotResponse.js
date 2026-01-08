import { useCallback } from "react";

/**
 * Hook that formats bot responses while preserving simple markdown (headings/bold).
 * Returns an HTML-safe string so the UI can render bold titles/headings.
 */
const useFormatBotResponse = () => {
  const escapeHtml = (str) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const formatBotResponse = useCallback((text) => {
    if (!text) return "";

    let formatted = text.trim();

    // Check if this looks like a numbered list response and add spacing
    if (formatted.includes("1.") && formatted.includes("2.")) {
      const parts = formatted.split(/(\d+\.\s)/);
      let result = "";

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (/^\d+\.\s$/.test(part)) {
          result += "\n\n" + part;
        } else if (i > 0 && /^\d+\.\s$/.test(parts[i - 1])) {
          result += part;
        } else if (i === 0) {
          result += part;
        } else {
          result += part;
        }
      }

      formatted = result.replace(/^\n+/, "").trim();
    }

    // Normalize newlines
    formatted = formatted.replace(/\n+/g, "\n\n");
    formatted = formatted.replace(/^\n+/, "").replace(/\n+$/, "");
    formatted = formatted.replace(/^\d+\.\s*$/gm, "");

    // Convert simple markdown to HTML after escaping to avoid XSS
    const toHtml = (value) => {
      const escaped = escapeHtml(value);

      // Headings (#, ##, etc.) -> bold
      const withHeadings = escaped.replace(
        /^(#{1,6})\s*(.+)$/gm,
        (_match, _hashes, title) => `<strong>${title}</strong>`
      );

      // Bold markers (**text** or __text__)
      const withBold = withHeadings
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>");

      // Preserve spacing with <br />
      return withBold
        .replace(/\n\n/g, "<br /><br />")
        .replace(/\n/g, "<br />");
    };

    return toHtml(formatted);
  }, []);

  return formatBotResponse;
};

export default useFormatBotResponse;

