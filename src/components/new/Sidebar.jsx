import React, { useState, useRef, useEffect } from "react";

// images
import LogoIcon from "../../assets/images/logo.svg";
import InactiveSendIcon from "../../assets/images/inactive-send.svg";
import ActiveSendIcon from "../../assets/images/active-send.svg";
import LeftDownIcon from "../../assets/images/left-down-arrow.svg";

// styles
import "../../assets/styles/sidebar.css";

const quickSuggestions = [
  "What are the top 5 drop-off locations?",
  "Where are college kids frequenting on weekdays?",
  "How far are riders normally traveling to get to De Nada?",
];

/* Sidebar Component */
const Sidebar = ({
  isOpen = true,
  onClose,
  onAssistantCall,
  conversationHistory = [],
  isLoading = false,
  onAssistantMessageClick = null,
}) => {
  const textareaRef = useRef(null);
  const contentSectionRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const [contentReachedLogo, setContentReachedLogo] = useState(false);

  // Scroll to bottom on initial render
  useEffect(() => {
    const contentSection = contentSectionRef.current;
    if (contentSection) {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        contentSection.scrollTop = contentSection.scrollHeight;
      });
    }
  }, []);

  // Scroll to bottom when conversation history changes
  useEffect(() => {
    const contentSection = contentSectionRef.current;
    if (contentSection && conversationHistory.length > 0) {
      // Use setTimeout with requestAnimationFrame to ensure DOM is fully updated
      // This handles both when loading completes and when message content updates
      const scrollToBottom = () => {
        requestAnimationFrame(() => {
          contentSection.scrollTop = contentSection.scrollHeight;
        });
      };

      // Small delay to ensure DOM has updated with new content
      const timeoutId = setTimeout(scrollToBottom, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [conversationHistory, isLoading]);

  // Custom scroll handler - checks if content has scrolled past logo
  useEffect(() => {
    const contentSection = contentSectionRef.current;
    if (!contentSection) return;

    const handleScroll = () => {
      const scrollTop = contentSection.scrollTop;
      // Check if content has scrolled up (scrollTop > 20 means content is being scrolled)
      setContentReachedLogo(scrollTop > 20);
    };

    contentSection.addEventListener("scroll", handleScroll);
    // Check initial state
    handleScroll();

    return () => {
      contentSection.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Auto-grow textarea and scroll content to bottom when textarea expands
  useEffect(() => {
    const textarea = textareaRef.current;
    const contentSection = contentSectionRef.current;

    if (!textarea) return;

    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
    const maxHeight = lineHeight * 5; // Maximum 5 rows

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
    if (contentSection) {
      requestAnimationFrame(() => {
        contentSection.scrollTop = contentSection.scrollHeight;
      });
    }
  }, [inputValue]);

  /* Handles input change in the textarea */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Determine if send button should be active based on input and not loading
  const isSendActive = inputValue.trim().length > 0 && !isLoading;

  /* Handles suggestion click - just sets the value in textarea */
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  /* Handles send button click */
  const handleSendClick = () => {
    if (inputValue.trim() && onAssistantCall && !isLoading) {
      onAssistantCall(inputValue.trim());
      setInputValue(""); // Clear input after sending
    }
  };

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {isOpen && onClose && (
        <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <div
        className={`sidebar-container ${
          isOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="gradient-blur">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="sidebar-wrapper">
          <div className="sidebar-wrapper-inner">
            <div
              className={`sidebar-logo-container ${
                contentReachedLogo ? "scrolled" : ""
              }`}
            >
              <img src={LogoIcon} alt="Logo" />
            </div>

            <div className="sidebar-content-container sidebar-logo-container-scroll">
              {/*===== Suggestions =====*/}
              <div ref={contentSectionRef} className="sidebar-content-section">
                {quickSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`sidebar-quick-suggestion-item ${
                      index === quickSuggestions.length - 1
                        ? "last-suggestion"
                        : ""
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="sidebar-quick-suggestion-text">
                      {suggestion}
                    </div>
                    <button className="sidebar-quick-suggestion-button">
                      <img
                        src={LeftDownIcon}
                        alt="Send"
                        className="sidebar-quick-suggestion-icon"
                      />
                    </button>
                  </div>
                ))}

                {/* Show conversation history */}
                {conversationHistory.map((msg) => (
                  <React.Fragment key={msg.id}>
                    {msg.type === "user" ? (
                      /* User Message */
                      <div className="sidebar-message sidebar-message-user">
                        <div className="sidebar-message-content seachable-text">
                          {msg.message}
                        </div>
                        <div className="msg-bottom-wrapper" data-name="Tail">
                          <div className="msg-sub-wrapper">
                            <svg
                              className="block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 39 20"
                            >
                              <path
                                d="M23.6704 18.1713C19.5945 14.8399 13.2705 10.5968 7.5 10.5968H0V6.09682H30.5C30.5 6.09682 39.4856 -2.15552 38.75 0.541693C37.25 6.0417 32.5 9.08578 28.5 10.5968C26.076 11.5125 25.8032 14.0733 26.2028 16.5466C26.4608 18.1436 26.5898 18.9421 26.5824 19.0328C26.5306 19.6678 26.0884 19.9227 25.513 19.6492C25.4307 19.6101 24.844 19.1305 23.6704 18.1714L23.6704 18.1713Z"
                                fill="var(--fill-0, #981FF5)"
                                id="Tail"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : /* Assistant Message or Loading */
                    msg.isLoading ? (
                      <div className="sidebar-message sidebar-message-assistant">
                        <div className="sidebar-message-content sidebar-message-loading">
                          <div className="sidebar-chat-loader">
                            <div className="sidebar-chat-loader-dot"></div>
                            <div className="sidebar-chat-loader-dot"></div>
                            <div className="sidebar-chat-loader-dot"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`sidebar-message sidebar-message-assistant`}
                        onClick={() => {
                          if (
                            msg.cards &&
                            msg.cards.length > 0 &&
                            onAssistantMessageClick
                          ) {
                            onAssistantMessageClick(msg.id);
                          }
                        }}
                      >
                        <div className="sidebar-message-content">
                          {msg.message}
                        </div>
                        <div
                          className="msg-bottom-wrapper left-msg-arrow"
                          data-name="Tail"
                        >
                          <div className="msg-sub-wrapper">
                            <svg
                              width="39"
                              height="20"
                              viewBox="0 0 39 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15.1226 18.1713C19.1985 14.8399 25.5225 10.5968 31.293 10.5968H38.793V6.09682H8.29297C8.29297 6.09682 -0.692635 -2.15552 0.0429688 0.541693C1.54297 6.0417 6.29297 9.08578 10.293 10.5968C12.717 11.5125 12.9898 14.0733 12.5902 16.5466C12.3322 18.1436 12.2032 18.9421 12.2106 19.0328C12.2624 19.6678 12.7045 19.9227 13.28 19.6492C13.3622 19.6101 13.949 19.1305 15.1225 18.1714L15.1226 18.1713Z"
                                fill="url(#paint0_linear_2767_26807)"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_2767_26807"
                                  x1="38.5002"
                                  y1="9.04169"
                                  x2="0.500244"
                                  y2="0.0416877"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#48485b" />
                                  <stop offset="1" stopColor="#48485b" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/*===== Ask about Austin =====*/}
              <div className="sidebar-input-container">
                <textarea
                  ref={textareaRef}
                  placeholder="Ask about Austin..."
                  className="sidebar-textarea-field"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendClick();
                    }
                  }}
                  rows={1}
                />
                <button
                  className="sidebar-send-button"
                  onClick={handleSendClick}
                  disabled={!isSendActive}
                >
                  <img
                    src={
                      isSendActive && !isLoading
                        ? ActiveSendIcon
                        : InactiveSendIcon
                    }
                    alt="Send"
                    className="sidebar-send-icon"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
