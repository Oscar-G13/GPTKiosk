document.getElementById("promptForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = document.getElementById("prompt").value;
    const responseElement = document.getElementById("response");
    responseElement.textContent = "Processing...";

    try {
        const result = await fetchChatGPT(prompt);
        const responseText = result.choices[0].text.trim();
        typeText(responseElement, responseText, 50);
    } catch (error) {
        responseElement.textContent = "An error occurred. Please try again.";
    }
});

async function fetchChatGPT(prompt) {
    const apiKey = "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";
    const apiUrl = "https://api.openai.com/v1/engines/gpt-3.5-turbo/completions"; // Changed to the gpt-3.5-turbo model
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    const data = {
        "prompt": `You are an AI language model. Please provide a plain English response to the following question: "${prompt}". Your response should be clear, concise, and easy to understand, without using any code or technical jargon. Thank you!`,
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
    element.textContent = "";
    let i = 0;

    const typeWriter = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    };

    typeWriter();
}