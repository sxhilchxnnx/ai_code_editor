// Simple Ollama Web UI - User Instructions:
// 1. Ensure Ollama is running:
//    - Install Ollama from https://ollama.com/
//    - Make sure the Ollama application is running on your computer.
//    - By default, Ollama serves its API at http://localhost:11434. This script assumes that.
//      If your Ollama setup is different (e.g., running on a different host or port),
//      you'll need to update the `ollamaEndpoint` variable in the `sendToOllama` function below.
//
// 2. Configure the Model Name:
//    - In the `sendToOllama` function below, find the line:
//      `model: "your-ollama-coding-model-name",`
//    - Replace `"your-ollama-coding-model-name"` with the actual name of the Ollama model
//      you have pulled and want to use (e.g., "codellama", "llama3", "mistral", etc.).
//      You can see your pulled models by running `ollama list` in your terminal.
//
// 3. How to Use:
//    - Open the `index.html` file in a web browser (e.g., by double-clicking it).
//    - Type or paste your code/prompt into the text area.
//    - Click the "Run Code" button.
//    - The output from Ollama will appear in the area below the button.

document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('codeInput');
    const runButton = document.getElementById('runButton');
    const outputArea = document.getElementById('outputArea');

    // Function to send code to the Ollama API
    async function sendToOllama(code) {
        // IMPORTANT: User may need to change this endpoint depending on their Ollama setup
        const ollamaEndpoint = 'http://localhost:11434/api/generate';

        // IMPORTANT: User MUST replace "your-ollama-coding-model-name" with the actual model they are using
        const requestBody = {
            model: "your-ollama-coding-model-name", // Replace with your model name
            prompt: code,
            stream: false // Set to true if you want to handle streaming responses
        };

        outputArea.textContent = "Sending to Ollama..."; // Provide feedback to the user

        try {
            const response = await fetch(ollamaEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Ollama response data:", data);
                displayOutput(data); // Function to display the Ollama response
            } else {
                const errorText = await response.text(); // Get more detailed error if possible
                console.error('Ollama API Error:', response.status, errorText);
                displayOutput({ error: `Ollama API Error: ${response.status} ${errorText}` });
            }
        } catch (error) {
            console.error('Error sending to Ollama:', error);
            displayOutput({ error: `Network or other error: ${error.message}` });
        }
    }

    // Function to display Ollama's response or errors in the outputArea
    function displayOutput(data) {
        console.log("Ollama's conceptual response:", data); // Log for debugging

        if (data && data.error) {
            // If data contains an error property, display it
            outputArea.textContent = `Error: ${data.error}`;
        } else if (data && data.response) {
            // If data contains a response property, display it
            // This is the expected field for successful Ollama /api/generate (non-streaming)
            outputArea.textContent = data.response;
        } else if (typeof data === 'string') {
            // If data itself is a string, display it (e.g. a simple error message)
            outputArea.textContent = data;
        }
        else {
            // Fallback for unexpected data structure
            outputArea.textContent = "Received data from Ollama, but not in the expected format. Check console for details.";
        }
    }

    runButton.addEventListener('click', () => {
        const code = codeInput.value;
        if (code.trim() === "") {
            outputArea.textContent = "Please enter some code.";
            return;
        }
        sendToOllama(code);
    });
});
