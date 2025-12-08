chrome.action.onClicked.addListener((tab) => {
    const url = tab.url || "";

    if (url.includes("chatgpt.com") ||
        url.includes("gemini.google.com") ||
        url.includes("claude.ai") ||
        url.includes("grok.com") ||
        url.includes("x.com")) {

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        });

    } else {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => alert("Context Carry supports：\n ChatGPT\n Gemini\n Claude\n Grok (X)")
        });
    }
});