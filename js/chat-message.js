// Function to create a chat message element
function createChatMessageElement(role, content) {
    const chatBox = document.createElement('div');
    chatBox.className = `row ${role}-chat-box`;
    chatBox.id = `${role}-chat-box`;
    chatBox.style.display = 'flex';

    const chatIcon = document.createElement('div');
    chatIcon.className = 'chat-icon';
    const icon = document.createElement('img');
    icon.className = 'chatgpt-icon';
    icon.src = role === 'user' ? '/cdn/15/images/user-icon.png' : '/cdn/15/images/chatgpt-icon.png';
    chatIcon.appendChild(icon);

    const chatTxt = document.createElement('div');
    chatTxt.className = 'chat-txt';
    chatTxt.id = `${role}-message`;

    content.forEach(item => {
        if (item.type === "text") {
            const textDiv = document.createElement('div');
            textDiv.innerHTML = role === 'user' ? item.text : marked(item.text);
            chatTxt.appendChild(textDiv);
        } else if (item.type === "image_url") {
            const img = document.createElement('img');
            img.src = item.image_url.url;
            img.className = 'image-preview';
            chatTxt.appendChild(img);
        }
    });

    chatBox.appendChild(chatIcon);
    chatBox.appendChild(chatTxt);

    return chatBox;
}

// Function to create content array for message
async function createMessageContent(text, files) {
    const content = [];

    // Add text content if exists
    if (text.trim()) {
      content.push({
        type: "text",
        text: text.trim()
      });
    }

    // Add images if exist
    for (const file of files) {
      const base64Image = await fileToBase64(file);
      content.push({
        type: "image_url",
        image_url: {
          detail: "low",
          url: base64Image
        }
      });
    }

    return content;
  }

  async function handleApiCall(userMessage) {
    if (!checkAuth()) {
      return;
    }

    const accessToken = getCookie('access_token');
    const params = getParameterValues();
    const systemPrompt = document.getElementById('system-prompt').value.trim();

    // Prepare messages array
    let messages = [];

    // Add system message if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: [{
          type: "text",
          text: systemPrompt
        }]
      });
    }

    // Add previous messages
    messages = messages.concat(selectedChat.messages.slice(-params.history_limit));

    // Create content array for current message
    const currentMessageContent = await createMessageContent(userMessage, selectedFiles);

    const response = await fetch('https://api.platform.ai.vn/services/platform-ai-api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        model: params.model,
        messages: messages,
        temperature: params.temperature,
        max_tokens: params.max_tokens,
        top_p: params.top_p,
        frequency_penalty: params.frequency_penalty,
        presence_penalty: params.presence_penalty,
        stream: true
      })
    });
    if (response.status === 401) {
      showLoginModal();
      return;
    }
    // Clear selected files after sending
    selectedFiles = [];
    updateImagePreview();

    // Process response stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let gptMessage = '';
    const gptChatBox = createChatMessageElement('assistant', [{
      type: "text",
      text: "Thinking..."
    }]);
    document.getElementById('chat-content-area').appendChild(gptChatBox);
    gptChatBox.scrollIntoView({ behavior: 'smooth', block: 'end' });

    const chatContentArea = document.querySelector('.chat-content-area');
    const contentHeight = chatContentArea.scrollHeight;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        const jsonData = line.replace('data: ', '');
        if (jsonData === '[DONE]\r') break;

        const parsedData = JSON.parse(jsonData);
        const content = parsedData.choices[0].delta.content;

        gptMessage += content;

        let endBlock = isOddCodeBlocks(gptMessage) ? "```" : "";
        gptChatBox.querySelector('.chat-txt').innerHTML = marked(gptMessage + endBlock);
        Prism.highlightAll();

        const currentScrollTop = chatContentArea.scrollTop;
        if (currentScrollTop + 800 >= contentHeight) {
          gptChatBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    }

    // Add assistant's response to chat history
    selectedChat.messages.push({
      role: 'assistant',
      content: [{
        type: "text",
        text: gptMessage
      }]
    });

    saveChatHistoryToStorage();
  }