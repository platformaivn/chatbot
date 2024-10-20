function checkAuth() {
    const accessToken = getCookie('access_token');
    if (!accessToken) {
        logout(); // Call logout instead of just showing login modal
        return false;
    }
    return true;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

async function login(username, password) {
    const loginButton = document.getElementById('loginButton');
    const errorDiv = document.getElementById('loginError');

    try {
        loginButton.disabled = true;
        loginButton.classList.add('loading');
        errorDiv.style.display = 'none';

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('https://api.platform.ai.vn/services/platform-ai-api/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept': 'application/json'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        setCookie('access_token', data.access_token, 7);
        hideLoginModal();
        return true;
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Invalid username or password';
        errorDiv.style.display = 'block';
        return false;
    } finally {
        loginButton.disabled = false;
        loginButton.classList.remove('loading');
    }
}

function logout() {
    // Remove the access token
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Reset UI state
    const userButton = document.getElementById('user-info-button');
    userButton.innerHTML = '<i class="fas fa-user"></i> Guest';

    // Clear chat history
    chatHistory.length = 0;
    displayChatHistory();

    // Clear chat content area
    document.getElementById('chat-content-area').innerHTML = '';

    // clearChatHistoryStorage();

    // Show login modal
    showLoginModal();
}

async function getUserInfo() {
    const accessToken = getCookie('access_token');
    if (!accessToken) return null;

    try {
        const response = await fetch('https://api.platform.ai.vn/services/platform-ai-api/account/info', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.status === 401) {
            // Token is expired or invalid
            logout();
            return null;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
}


async function updateUserInfoButton() {
    const userInfo = await getUserInfo();
    const userButton = document.getElementById('user-info-button');

    if (userInfo) {
        userButton.innerHTML = `
              <i class="fas fa-user"></i> ${userInfo.full_name || userInfo.username}
          `;
    } else {
        userButton.innerHTML = `
              <i class="fas fa-user"></i> Guest
          `;
    }
}