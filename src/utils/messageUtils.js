import { MESSAGE_TYPES } from "./constants";

/* Creates a user message object */
export const createUserMessage = (message, id = null) => ({
  id: id || Date.now(),
  type: MESSAGE_TYPES.USER,
  message: message.trim(),
  timestamp: new Date(),
});

/* Creates an assistant message object */
export const createAssistantMessage = (
  message = "",
  isLoading = false,
  cards = [],
  id = null
) => ({
  id: id || Date.now(),
  type: MESSAGE_TYPES.ASSISTANT,
  message: message,
  isLoading: isLoading,
  cards: cards || [],
  timestamp: new Date(),
});

/* Creates a loading message object */
export const createLoadingMessage = (id = null) => {
  const baseId = id || Date.now() + 1;
  return createAssistantMessage("", true, [], baseId);
};

/* Finds a message with cards from conversation history */
export const findMessageWithCards = (
  conversationHistory,
  selectedMessageId
) => {
  // If a specific message is selected, try to find it
  if (selectedMessageId) {
    const selectedMessage = conversationHistory.find(
      (msg) => msg.id === selectedMessageId && msg.cards && msg.cards.length > 0
    );
    if (selectedMessage) {
      return selectedMessage;
    }
  }

  // Fall back to latest message with cards
  return [...conversationHistory].reverse().find((msg) => msg.cards) || null;
};

/* Finds the current loading message in conversation history */
export const findLoadingMessage = (conversationHistory) => {
  return (
    conversationHistory.find(
      (msg) => msg.isLoading && msg.type === MESSAGE_TYPES.ASSISTANT
    ) || null
  );
};
