import React, { useState, useEffect, useRef, useMemo } from "react";

// components
import Sidebar from "../../components/new/Sidebar";
import Header from "../../components/new/Header";
import ClearResult from "../../components/new/ClearResult";
import PlaceCardWrapper from "../../components/new/PlaceCardWrapper";
import LeafletMap from "../../components/new/LeafletMap";
import LoadingUI from "../../components/new/LoadingUI";

// hooks
import useFormatBotResponse from "../../hooks/useFormatBotResponse";

// services
import { analyzeResponseWithGemini } from "../../services/geminiAnalysisService";

// utils
import {
  findMessageWithCards,
  createUserMessage,
  createLoadingMessage,
} from "../../utils/messageUtils";
import { MESSAGE_TYPES } from "../../utils/constants";

// styles
import "../../assets/styles/dashboard.css";
console.log("hello");
/* NewDashboard Component */
const NewDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null); // Track which assistant message is selected
  const timeoutRef = useRef(null);

  // Computed: Find the current message with cards to display
  const currentMessageWithCards = useMemo(() => {
    return findMessageWithCards(conversationHistory, selectedMessageId);
  }, [conversationHistory, selectedMessageId]);

  // Computed: Cards to display on map (only those with coordinates)
  const mapPlaces = useMemo(() => {
    // Don't show any cards if loading or if no message with cards is selected
    if (isLoading || !currentMessageWithCards?.cards) return [];

    // If cards array is empty, don't show any place cards on the map
    if (currentMessageWithCards.cards.length === 0) return [];

    // Filter cards to only show those with coordinates
    return currentMessageWithCards.cards.filter((card) => card.lat && card.lng);
  }, [isLoading, currentMessageWithCards]);

  // Computed: Cards to display in card wrapper (all cards, including those without coordinates)
  const displayCards = useMemo(() => {
    if (isLoading || !currentMessageWithCards?.cards) return [];
    return currentMessageWithCards.cards;
  }, [isLoading, currentMessageWithCards]);

  // Computed: Whether to show cards section
  const shouldShowCards = useMemo(() => {
    return (
      !isLoading &&
      currentMessageWithCards &&
      currentMessageWithCards.cards?.length > 0
    );
  }, [isLoading, currentMessageWithCards]);

  // Use format bot response hook
  const formatBotResponse = useFormatBotResponse();

  /* Toggles sidebar open/closed state */
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  /* Closes the sidebar (used for overlay click on mobile/tablet) */
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  /* Handles API call when suggestion is clicked or message is sent */
  const handleAssistantCall = async (message) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Clear previous results and reset selected marker when loading starts
    setSelectedMarkerId(null);
    setSelectedMessageId(null); // Clear selected message when new query starts
    setIsLoading(true);

    // Add user message to conversation history
    const userMessage = createUserMessage(message);
    setConversationHistory((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingMessage = createLoadingMessage();
    setConversationHistory((prev) => [...prev, loadingMessage]);

    const currentMessage = message;

    try {
      const webhookPath = import.meta.env.VITE_WEBHOOK_PATH || "";
      const instanceId = import.meta.env.VITE_INSTANCE_ID || "";

      const response = await fetch(webhookPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Instance-Id": instanceId,
        },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: "web-session-" + Date.now(),
          chatInput: currentMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Format the response text
        const rawMessage =
          data?.output || data?.message || "Response received successfully.";
        const formattedMessage = formatBotResponse(rawMessage);

        // Analyze response with Gemini to extract cards from the response text
        let cards = [];

        try {
          const analysis = await analyzeResponseWithGemini(formattedMessage);

          if (
            analysis.visualizationType === "map" &&
            analysis.mapData &&
            analysis.mapData.length > 0
          ) {
            // Create cards from geocoded data
            cards = analysis.mapData.map((geo, index) => ({
              indicator: index + 1,
              visits: geo.visits || 0,
              title: geo.name || "Location",
              address: geo.formatted_address || geo.address || "",
              category: geo.category || "Location",
              lat: geo.lat,
              lng: geo.lng,
            }));
          }
        } catch (error) {
          console.error("❌ Error analyzing response with Gemini:", error);
          // Continue with empty cards if analysis fails
        }

        // Replace loading message with actual response
        let newMessageId = null;
        setConversationHistory((prev) => {
          const updated = prev.map((msg) => {
            if (msg.isLoading && msg.type === MESSAGE_TYPES.ASSISTANT) {
              newMessageId = msg.id; // Store the ID of the message being created
              return {
                ...msg,
                message: formattedMessage,
                isLoading: false,
                cards: cards,
                timestamp: new Date(),
              };
            }
            return msg;
          });
          return updated;
        });

        // Set the newly created message as selected only if it has cards
        if (newMessageId && cards.length > 0) {
          setSelectedMessageId(newMessageId);
        } else if (newMessageId && cards.length === 0) {
          // If no cards, clear the selection so no place cards are shown on map
          setSelectedMessageId(null);
        }

        setIsLoading(false);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Replace loading message with error message
      let newMessageId = null;
      setConversationHistory((prev) => {
        const updated = prev.map((msg) => {
          if (msg.isLoading && msg.type === MESSAGE_TYPES.ASSISTANT) {
            newMessageId = msg.id;
            return {
              ...msg,
              message:
                "Sorry, there was an error processing your request. Please try again.",
              isLoading: false,
              cards: [],
              timestamp: new Date(),
            };
          }
          return msg;
        });
        return updated;
      });

      setIsLoading(false);
    }
  };

  /* Handles clicking on an assistant message to display its cards */
  const handleAssistantMessageClick = (messageId) => {
    // Find the message
    const message = conversationHistory.find((msg) => msg.id === messageId);
    if (message) {
      // If message has cards, set it as selected to display them
      if (message.cards && message.cards.length > 0) {
        setSelectedMessageId(messageId);
      } else {
        // If message has no cards, clear selection so no cards are shown on map
        setSelectedMessageId(null);
      }
      // Reset marker selection when switching to a different message
      setSelectedMarkerId(null);
    }
  };

  /* Clears assistant data and resets to initial state */
  const handleClearResults = () => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setConversationHistory([]);
    setSelectedMarkerId(null);
    setSelectedMessageId(null);
    setIsLoading(false);
  };

  /* Cleanup timeout on unmount */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onAssistantCall={handleAssistantCall}
        conversationHistory={conversationHistory}
        isLoading={isLoading}
        onAssistantMessageClick={handleAssistantMessageClick}
        selectedMessageId={selectedMessageId}
      />

      {/* Cards Section - Only show when not loading and we have cards */}
      {shouldShowCards && (
        <>
          <ClearResult
            onClear={handleClearResults}
            isSidebarOpen={isSidebarOpen}
          />
          <PlaceCardWrapper
            cards={displayCards}
            onCardClick={setSelectedMarkerId}
            selectedCardIndex={selectedMarkerId}
          />
        </>
      )}

      {/* Map Section */}
      <div className="dashboard-wrapper">
        <LeafletMap
          places={mapPlaces}
          selectedMarkerId={selectedMarkerId}
          onMarkerDeselect={() => setSelectedMarkerId(null)}
          onMarkerSelect={setSelectedMarkerId}
        />
      </div>

      <LoadingUI isVisible={isLoading} />
    </>
  );
};

export default NewDashboard;
