import React, { useState } from "react";

// images
import LogoIcon from "../../assets/images/fiora-fetii-smaller.svg";
import InactiveSendIcon from "../../assets/images/inactive-send.svg";
import ActiveSendIcon from "../../assets/images/active-send.svg";

// hooks
import useResolution from "../../hooks/useResolution";
import useAutoGrowTextarea from "../../hooks/useAutoGrowTextarea";
import useScrollToBottom from "../../hooks/useScrollToBottom";
import useScrollDetection from "../../hooks/useScrollDetection";
import useLoadingMessageRotation from "../../hooks/useLoadingMessageRotation";

// components
import AnimatedMessage from "./AnimatedMessage";

// utils
import {
  LOADING_MESSAGES,
  UI,
  MESSAGE_TYPES,
} from "../../utils/constants";

// styles
import "../../assets/styles/sidebar.css";

/* Sidebar Component */
const Sidebar = ({
  isOpen = true,
  onClose,
  onAssistantCall,
  conversationHistory = [],
  isLoading = false,
  onAssistantMessageClick = null,
}) => {
  const [inputValue, setInputValue] = useState("");

  // Use common resolution detection hook
  const { isMobile, isDesktop } = useResolution();

  // Use scroll detection hook for logo styling
  const {
    containerRef: contentSectionRef,
    hasScrolledPastThreshold: contentReachedLogo,
  } = useScrollDetection(UI.SCROLL_THRESHOLD);

  // Use scroll to bottom hook for conversation history
  useScrollToBottom(contentSectionRef, [conversationHistory, isLoading], {
    scrollOnMount: true,
  });

  // Use loading message rotation hook for mobile
  const currentLoadingMessageIndex = useLoadingMessageRotation(
    isMobile,
    conversationHistory,
    LOADING_MESSAGES.SIDEBAR
  );

  // Use auto-grow textarea hook
  const textareaRef = useAutoGrowTextarea(inputValue, {
    scrollContainerRef: contentSectionRef,
  });

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
                {/* Show suggestions on desktop always, or on mobile/tablet only when no messages */}
                {/* Show intro placeholder only when no messages */}
                  {conversationHistory.length === 0 && (
                      <div className="sidebar-quick-suggestion-item last-suggestion intro-placeholder">
                        <div className="sidebar-quick-suggestion-text" style={{ pointerEvents: "none" }}>
                          Hi, I’m Fiora!
                          <br /><br />
                          I use Fetii’s real-world travel insights to show you the most popular places to go and the best things to do around town.
                          <br /><br />
                          You can ask me about bars, restaurants, or anything else, even by age, day of the week, or cuisine.
                          <br /><br />
                          Just tell me what you’re looking for, and I’ll take care of the rest!
                        </div>
                      </div>
                    )}


                {/* Show conversation history */}
                {conversationHistory.map((msg) => (
                  <React.Fragment key={msg.id}>
                    {msg.type === MESSAGE_TYPES.USER ? (
                      /* User Message */
                      <div className="sidebar-message sidebar-message-user">
                        <div className="sidebar-message-content seachable-text">
                          <span>{msg.message}</span>
                          {msg.isLoading && (
                            <span className="user-message-loading-dots">
                              <span className="user-message-loading-dot"></span>
                              <span className="user-message-loading-dot"></span>
                              <span className="user-message-loading-dot"></span>
                            </span>
                          )}
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
                          {/* Desktop/Tablet loader */}
                          <div className="sidebar-chat-loader">
                            <div className="sidebar-chat-loader-dot"></div>
                            <div className="sidebar-chat-loader-dot"></div>
                            <div className="sidebar-chat-loader-dot"></div>
                          </div>
                          {/* Mobile loader with messages */}
                          <div className="sidebar-message-loading-mobile">
                            <div className="sidebar-message-loading-mobile-text">
                              {
                                LOADING_MESSAGES.SIDEBAR[
                                  currentLoadingMessageIndex
                                ]
                              }
                            </div>
                            <div className="sidebar-message-loading-mobile-dots">
                              <div className="sidebar-message-loading-mobile-dot"></div>
                              <div className="sidebar-message-loading-mobile-dot"></div>
                              <div className="sidebar-message-loading-mobile-dot"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`sidebar-message sidebar-message-assistant`}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          // Allow clicking on all assistant messages
                          // Handler will determine if cards should be shown or cleared
                          if (onAssistantMessageClick) {
                            onAssistantMessageClick(msg.id);
                          }
                        }}
                      >
                        <div className="sidebar-message-content">
                          <AnimatedMessage
                            message={msg.message}
                            messageId={msg.id}
                            speed={50}
                            scrollContainerRef={contentSectionRef}
                          />
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
                  placeholder="Ask Fiora anything..."
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
