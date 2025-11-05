import React, { useState, useEffect, useRef, useMemo } from "react";

// components
import Sidebar from "../../components/new/Sidebar";
import Header from "../../components/new/Header";
import ClearResult from "../../components/new/ClearResult";
import PlaceCardWrapper from "../../components/new/PlaceCardWrapper";
import LeafletMap from "../../components/new/LeafletMap";
import LoadingUI from "../../components/new/LoadingUI";

// hooks
import useResolution from "../../hooks/useResolution";

// utils
import { findMessageWithCards, createUserMessage, createLoadingMessage } from "../../utils/messageUtils";
import { MESSAGE_TYPES } from "../../utils/constants";

// data
import mockData from "../../data/mockData.json";

// styles
import "../../assets/styles/dashboard.css";

/* NewDashboard Component */
const NewDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null); // Track which assistant message is selected
  const timeoutRef = useRef(null);

  // Computed: Find the current message with cards to display
  const currentMessageWithCards = useMemo(() => {
    return findMessageWithCards(conversationHistory, selectedMessageId);
  }, [conversationHistory, selectedMessageId]);

  // Computed: Cards to display on map
  const mapPlaces = useMemo(() => {
    return isLoading ? [] : (currentMessageWithCards?.cards || []);
  }, [isLoading, currentMessageWithCards]);

  // Computed: Whether to show cards section
  const shouldShowCards = useMemo(() => {
    return !isLoading && currentMessageWithCards && currentMessageWithCards.cards?.length > 0;
  }, [isLoading, currentMessageWithCards]);

  // Use common resolution detection hook
  const { isDesktop } = useResolution();

  /* Handle window resize - on desktop, sidebar should always be open - Automatically opens sidebar on desktop screens */
  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

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
    }

    // Clear previous results and reset selected marker when loading starts
    setSelectedMarkerId(null);
    setSelectedMessageId(null); // Clear selected message when new query starts
    setIsLoading(true);

    // Add user message to conversation history
    const userMessage = createUserMessage(message);
    setConversationHistory(prev => [...prev, userMessage]);

    // Add loading message
    const loadingMessage = createLoadingMessage();
    setConversationHistory(prev => [...prev, loadingMessage]);

    // Set 7 second interval before showing mock response
    timeoutRef.current = setTimeout(() => {
      // Pick a random mock data item from the array
      const randomIndex = Math.floor(Math.random() * mockData.length);
      const randomData = mockData[randomIndex];
      const mockResponse = {
        userMessage: message,
        message: randomData.message,
        isLoading: false,
        cards: randomData.cards,
      };

      // Replace loading message with actual response
      let newMessageId = null;
      setConversationHistory(prev => {
        const updated = prev.map(msg => {
          if (msg.isLoading && msg.type === MESSAGE_TYPES.ASSISTANT) {
            newMessageId = msg.id; // Store the ID of the message being created
            return {
              ...msg,
              message: mockResponse.message,
              isLoading: false,
              cards: mockResponse.cards || [],
              timestamp: new Date(),
            };
          }
          return msg;
        });
        return updated;
      });
      
      // Set the newly created message as selected
      if (newMessageId) {
        setSelectedMessageId(newMessageId);
      }

      setIsLoading(false);
      timeoutRef.current = null;
    }, 7000); // 7 seconds
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
        onAssistantMessageClick={setSelectedMessageId}
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
            cards={currentMessageWithCards.cards}
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
