document.addEventListener('DOMContentLoaded', function () {
    checkAuth(); // Check authentication on page load

    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        if (!username || !password) {
            errorDiv.textContent = 'Please enter both username and password';
            errorDiv.style.display = 'block';
            return;
        }

        const success = await login(username, password);
        if (!success) {
            errorDiv.textContent = 'Invalid username or password';
            errorDiv.style.display = 'block';
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('loginModal');
        if (event.target === modal) {
            hideLoginModal();
        }
    });
});

// Add these function calls to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    // Existing DOMContentLoaded code remains...

    // Add user info update
    updateUserInfoButton();

    // Load saved chat history when page loads
    loadChatHistoryFromStorage();

    // Add event listener for config changes to save updated configs
    const configElements = [
        'gpt-model',
        'gpt-temperature',
        'gpt-max-len',
        'gpt-topP',
        'gpt-frequency',
        'gpt-precence',
        'gpt-history-limit',
        'system-prompt'
    ];

    configElements.forEach(elementId => {
        document.getElementById(elementId).addEventListener('change', function () {
            if (currentChat && selectedChat) {
                selectedChat.config = getCurrentConfig();
                saveChatHistoryToStorage(); // Save when config changes
            }
        });
    });

    document.getElementById('logout-button').addEventListener('click', function (event) {
        event.preventDefault();
        const confirmLogout = window.confirm('Are you sure you want to log out?');
        if (confirmLogout) {
            logout();
        }
    });

    // Update user info after successful login
    const existingLoginSuccess = login;
    login = async function (...args) {
        const success = await existingLoginSuccess.apply(this, args);
        if (success) {
            await updateUserInfoButton();
        }
        return success;
    };
});

document.addEventListener('DOMContentLoaded', function () {
    // Remove existing modal click event listener
    const modal = document.getElementById('loginModal');
    modal.addEventListener('click', (event) => {
        // Prevent modal from closing when clicking outside
        event.stopPropagation();
    });

    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        if (!username || !password) {
            errorDiv.textContent = 'Please enter both username and password';
            errorDiv.style.display = 'block';
            return;
        }

        await login(username, password);
    });
});