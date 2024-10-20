// Function to get current parameter values
function getCurrentConfig() {
    return {
        model: document.getElementById('gpt-model').value,
        temperature: parseFloat(document.getElementById('gpt-temperature').value),
        max_tokens: parseInt(document.getElementById('gpt-max-len').value),
        top_p: parseFloat(document.getElementById('gpt-topP').value),
        frequency_penalty: parseFloat(document.getElementById('gpt-frequency').value),
        presence_penalty: parseFloat(document.getElementById('gpt-precence').value),
        history_limit: parseInt(document.getElementById('gpt-history-limit').value),
        system_prompt: document.getElementById('system-prompt').value
    };
}

// Function to apply config to UI
function applyConfig(config) {
    document.getElementById('gpt-model').value = config.model;
    document.getElementById('gpt-temperature').value = config.temperature;
    document.getElementById('gpt-max-len').value = config.max_tokens;
    document.getElementById('gpt-topP').value = config.top_p;
    document.getElementById('gpt-frequency').value = config.frequency_penalty;
    document.getElementById('gpt-precence').value = config.presence_penalty;
    document.getElementById('gpt-history-limit').value = config.history_limit;
    document.getElementById('system-prompt').value = config.system_prompt;

    // Update all range input displays
    document.querySelectorAll('input[type="range"]').forEach(updateOutput);
}

// Function to update the output value
function updateOutput(input) {
    const output = input.parentElement.nextElementSibling.querySelector('output');
    output.value = input.value;
}