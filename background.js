chrome.action.onClicked.addListener(async (tab) => {
    const url = tab.url || "";
    const isSupported = url.includes("chatgpt.com") ||
                        url.includes("gemini.google.com") ||
                        url.includes("claude.ai") ||
                        url.includes("grok.com") ||
                        url.includes("x.com");

    if (isSupported) {
        try {
            await chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_INTERFACE" });
            console.log("Toggle signal sent.");
        } catch (err) {
            console.log("First time click, injecting content script...");
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"]
            });
        }

    } else {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => alert("Context Carry supports：\n ChatGPT\n Gemini\n Claude\n Grok (X)")
        });
    }
});


chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.remove(['cc_basket', 'cc_transfer_payload'], () => {
        console.log("Context-Carry: Privacy cleanup done. Storage cleared on startup.");
    });
});