import React, { useState, useMemo, useRef } from "react";


// components
import Sidebar from "../../components/new/Sidebar";
import Header from "../../components/new/Header";
import ClearResult from "../../components/new/ClearResult";
import PlaceCardWrapper from "../../components/new/PlaceCardWrapper";
import LeafletMap from "../../components/new/LeafletMap";
import LoadingUI from "../../components/new/LoadingUI";

// hooks
import useFormatBotResponse from "../../hooks/useFormatBotResponse";
import useUserCity from "../../hooks/useUserCity";
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

const NewDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const sessionIdRef = useRef("web-session-" + crypto.randomUUID());

  const userCity = useUserCity();
  const formatBotResponse = useFormatBotResponse();

  /* =========================
     Derived state
  ========================= */

  const currentMessageWithCards = useMemo(
    () => findMessageWithCards(conversationHistory, selectedMessageId),
    [conversationHistory, selectedMessageId]
  );

  const mapPlaces = useMemo(() => {
    if (isLoading || !currentMessageWithCards?.cards) return [];
    return currentMessageWithCards.cards.filter((c) => c.lat && c.lng);
  }, [isLoading, currentMessageWithCards]);

  const displayCards = useMemo(() => {
    if (isLoading || !currentMessageWithCards?.cards) return [];
    return currentMessageWithCards.cards;
  }, [isLoading, currentMessageWithCards]);

  const shouldShowCards = useMemo(
    () =>
      !isLoading &&
      currentMessageWithCards &&
      currentMessageWithCards.cards?.length > 0,
    [isLoading, currentMessageWithCards]
  );

  /* =========================
     UI handlers
  ========================= */

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);
  const closeSidebar = () => setIsSidebarOpen(false);

  /* =========================
     STREAMING
     Loading ends on FIRST token
  ========================= */

const handleAssistantCall = async (message) => {
  const sessionId = sessionIdRef.current;


  setSelectedMarkerId(null);
  setSelectedMessageId(null);
  setIsLoading(true);

  const assistantMessageId = crypto.randomUUID();
  let accumulated = "";
  let buffer = "";
  let firstToken = true;

  setConversationHistory((prev) => [
    ...prev,
    createUserMessage(message),
    {
      id: assistantMessageId,
      type: MESSAGE_TYPES.ASSISTANT,
      message: "",
      isLoading: true,
      cards: [],
      timestamp: new Date(),
    },
  ]);

  try {
    const response = await fetch(import.meta.env.VITE_WEBHOOK_PATH || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Instance-Id": import.meta.env.VITE_INSTANCE_ID || "",
      },
      body: JSON.stringify({
        action: "sendMessage",
        sessionId,
        chatInput: message,
        user_city: userCity || "Austin",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body (streaming unsupported)");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Split safely on newlines (SSE-friendly)
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep incomplete fragment

      for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        let token = "";

        // CASE 1: SSE format → data: ...
        if (line.startsWith("data:")) {
          token = line.slice(5).trim();
        }
        // CASE 2: JSON chunk
        else if (line.startsWith("{")) {
          try {
            const parsed = JSON.parse(line);
            token = parsed.content || parsed.delta || "";
          } catch {
            continue;
          }
        }
        // CASE 3: Plain text
        else {
          token = line;
        }

        if (!token) continue;

        accumulated += token;

        if (firstToken) {
          firstToken = false;
          setIsLoading(false);
        }

        setConversationHistory((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  message: formatBotResponse(accumulated),
                  isLoading: false,
                  timestamp: new Date(),
                }
              : msg
          )
        );
      }
    }
    const analysis = await analyzeResponseWithGemini(accumulated);

  if (
    analysis.visualizationType === "map" &&
    analysis.mapData?.length
  ) {
    setConversationHistory((prev) =>
      prev.map((msg) =>
        msg.id === assistantMessageId
          ? {
              ...msg,
              cards: analysis.mapData.map((item,index) => ({
                title: item.name,
                address: item.formatted_address || item.address,
                lat: item.lat,
                lng: item.lng,
                visits: item.visits,
                category: item.category,
                indicator: index + 1,
              })),
              timestamp: new Date(),
            }
          : msg
      )
    );
  }
  } catch (error) {
    console.error("Streaming error:", error);

    setConversationHistory((prev) =>
      prev.map((msg) =>
        msg.id === assistantMessageId
          ? {
              ...msg,
              message:
                "Sorry, there was an error processing your request. Please try again.",
              isLoading: false,
              cards: [],
              timestamp: new Date(),
            }
          : msg
      )
    );

    setIsLoading(false);
  }
};



  /* =========================
     Message selection
  ========================= */

  const handleAssistantMessageClick = (messageId) => {
    const msg = conversationHistory.find((m) => m.id === messageId);
    setSelectedMessageId(msg?.cards?.length ? messageId : null);
    setSelectedMarkerId(null);
  };

  const handleClearResults = () => {
    setConversationHistory([]);
    setSelectedMarkerId(null);
    setSelectedMessageId(null);
    setIsLoading(false);
  };

  /* =========================
     Render
  ========================= */

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
