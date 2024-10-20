// Constants
const STORAGE_KEY = 'platform_ai_chat_history';
const chatHistory = [];

// Function to create a new AI tool
function createNewChat() {
    const chatName = prompt("Enter a name for the new AI tool:");
    if (chatName) {
        const newChat = {
            id: crypto.randomUUID(),
            name: chatName,
            messages: [],
            config: getCurrentConfig()
        };
        chatHistory.push(newChat);
        displayChatHistory();
        selectChat(newChat);
        saveChatHistoryToStorage(); // Save after creating new chat
    }
}

// Function to display chat history
function displayChatHistory() {
    const chatHistoryDiv = document.querySelector('.chat-history');
    chatHistoryDiv.innerHTML = '';

    chatHistory.forEach((chat, index) => {
        const chatItem = document.createElement('li');
        chatItem.className = `select-chat nav-item d-flex justify-content-between ${chat.id === currentChat ? 'active' : ''}`;
        chatItem.dataset.index = index;
        chatItem.dataset.id = chat.id;
        chatItem.innerHTML = `
        <a style="width: 100%;" class="select-chat nav-link text-white" href="javascript:{}" data-index="${index}">
          <i class="fas fa-comment"></i> ${chat.name}
        </a>
        <a class="nav-link text-white" data-index="${index}" href="javascript:{}">
          <i class="delete-chat fas fa-trash-alt"></i>
        </a>
      `;
        chatHistoryDiv.appendChild(chatItem);
    });
}

// Function to select a chat
function selectChat(chat) {
    document.getElementById('chat-content-area').innerHTML = `<div id="welcome-screen"
              class="h-100 flex-column align-items-center justify-content-center text-center p-4">
              <img src="https://cdn.jsdelivr.net/gh/platformaivn/web@1.0.68/dist/img/logo_icon.png" alt="Platform AI Logo"
                class="welcome-logo mb-4">
              <h2 class="text-light mb-2">Welcome to Platform AI</h2>
              <p>Start a conversation to begin</p>
            </div>`;
    currentChat = chat.id;
    selectedChat = chatHistory.find(chat => chat.id === currentChat);
    // Apply chat's configuration or default if none exists
    const config = chat.config || defaultConfig;
    applyConfig(config);

    chat.messages.forEach(message => {
        const messageElement = createChatMessageElement(message.role, message.content);
        document.getElementById('chat-content-area').appendChild(messageElement);
    });

    // Update active state in chat history
    document.querySelectorAll('.chat-history li').forEach(li => {
        li.classList.remove('active');
    });
    document.querySelector(`.chat-history li[data-id="${chat.id}"]`).classList.add('active');
}


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