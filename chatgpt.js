let conversationHistory = [];

document.getElementById("promptForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = document.getElementById("prompt").value;
    const responseContainer = document.getElementById("responseContainer");
    const responseElement = document.createElement("p");
    responseContainer.appendChild(responseElement);
    responseElement.textContent = "> " + prompt;

    try {
        const result = await fetchChatGPT(prompt, conversationHistory);
        const responseText = result.choices[0].text.trim();
        conversationHistory.push({ prompt, responseText });
        typeText(responseElement, "< " + responseText, 50);
    } catch (error) {
        responseElement.textContent = "An error occurred. Please try again.";
    }

    document.getElementById("prompt").value = "";
    document.getElementById("prompt").focus();
});

async function fetchChatGPT(prompt, conversationHistory) {
    const apiKey = "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";
    const apiUrl = "https://api.openai.com/v1/engines/gpt-3.5-turbo/completions";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    let promptText = `You are an AI language model. Please provide a plain English response to the following question: "${prompt}". Your response should be clear, concise, and easy to understand, without using any code or technical jargon. Thank you!`;

    if (conversationHistory.length > 0) {
        promptText += " Previous inputs and outputs:\n";
        conversationHistory.forEach((item) => {
            promptText += `\nInput: ${item.prompt}\nOutput: ${item.responseText}\n`;
        });
    }

    const data = {
        "prompt": promptText,
        "max_tokens": 500,
        "n": 1,
        "stop": null,
        "temperature": 0.8
    };

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to fetch ChatGPT response");
    }

    return await response.json();
}

function typeText(element, text, speed) {
    let i = 0;

    const typeWriter = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    };

    typeWriter();
}
