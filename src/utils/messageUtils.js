/**
 * Message utility functions for conversation handling
 */

import { MESSAGE_TYPES } from './constants';

/**
 * Creates a user message object
 * @param {string} message - The message content
 * @param {number} [id] - Optional message ID (defaults to timestamp)
 * @returns {Object} User message object
 */
export const createUserMessage = (message, id = null) => ({
  id: id || Date.now(),
  type: MESSAGE_TYPES.USER,
  message: message.trim(),
  timestamp: new Date(),
});

/**
 * Creates an assistant message object
 * @param {string} message - The message content
 * @param {boolean} [isLoading=false] - Whether the message is still loading
 * @param {Array} [cards=[]] - Optional cards array
 * @param {number} [id] - Optional message ID (defaults to timestamp)
 * @returns {Object} Assistant message object
 */
export const createAssistantMessage = (message = '', isLoading = false, cards = [], id = null) => ({
  id: id || Date.now(),
  type: MESSAGE_TYPES.ASSISTANT,
  message: message,
  isLoading: isLoading,
  cards: cards || [],
  timestamp: new Date(),
});

/**
 * Creates a loading message object
 * @param {number} [id] - Optional message ID (defaults to timestamp + 1)
 * @returns {Object} Loading message object
 */
export const createLoadingMessage = (id = null) => {
  const baseId = id || Date.now() + 1;
  return createAssistantMessage('', true, [], baseId);
};

/**
 * Finds a message with cards from conversation history
 * @param {Array} conversationHistory - Array of conversation messages
 * @param {number|null} selectedMessageId - ID of the selected message
 * @returns {Object|null} Message object with cards or null
 */
export const findMessageWithCards = (conversationHistory, selectedMessageId) => {
  // If a specific message is selected, try to find it
  if (selectedMessageId) {
    const selectedMessage = conversationHistory.find(
      msg => msg.id === selectedMessageId && msg.cards && msg.cards.length > 0
    );
    if (selectedMessage) {
      return selectedMessage;
    }
  }

  // Fall back to latest message with cards
  return [...conversationHistory]
    .reverse()
    .find(msg => msg.cards && msg.cards.length > 0) || null;
};

/**
 * Finds the current loading message in conversation history
 * @param {Array} conversationHistory - Array of conversation messages
 * @returns {Object|null} Loading message object or null
 */
export const findLoadingMessage = (conversationHistory) => {
  return conversationHistory.find(
    (msg) => msg.isLoading && msg.type === MESSAGE_TYPES.ASSISTANT
  ) || null;
};

