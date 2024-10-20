// Constants
const STORAGE_KEY = 'platform_ai_chat_history';

// Function to save chat history to localStorage
function saveChatHistoryToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  } catch (error) {
    console.error('Error saving chat history to localStorage:', error);
  }
}

// Function to load chat history from localStorage
function loadChatHistoryFromStorage() {
  try {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      // Clear existing history
      chatHistory.length = 0;
      // Load saved history
      const parsedHistory = JSON.parse(savedHistory);
      chatHistory.push(...parsedHistory);
      
      // Display loaded history
      displayChatHistory();
      
      // If there are chats, select the first one
      if (chatHistory.length > 0) {
        selectChat(chatHistory[0]);
      }
    }
  } catch (error) {
    console.error('Error loading chat history from localStorage:', error);
  }
}

// Function to clear chat history from localStorage
function clearChatHistoryStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    chatHistory.length = 0;
    displayChatHistory();
    document.getElementById('chat-content-area').innerHTML = '';
  } catch (error) {
    console.error('Error clearing chat history from localStorage:', error);
  }
}