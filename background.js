chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.remove(['cc_basket', 'cc_transfer_payload'], () => {
        console.log("Context-Carry: Storage cleared on install/update.");
    });

    chrome.contextMenus.create({
        id: "cc-add-to-basket",
        title: "Add to Context Basket",
        contexts: ["selection"]
    });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.remove(['cc_basket', 'cc_transfer_payload'], () => {
        console.log("Context-Carry: Privacy cleanup done. Storage cleared on startup.");
    });
});

async function ensureContentScript(tabId) {
    try {
        await chrome.tabs.sendMessage(tabId, { action: "PING" });
    } catch (err) {
        console.log("Injecting content script for tab:", tabId);
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"]
        });
    }
}

chrome.action.onClicked.addListener(async (tab) => {
    const url = tab.url || "";
    if (url.startsWith("chrome://") || url.startsWith("edge://") || url.startsWith("about:") || url.startsWith("chromewebstore")) {
        return;
    }

    try {
        await ensureContentScript(tab.id);
        chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_INTERFACE" });
    } catch (e) {
        console.error("Failed to inject or toggle:", e);
    }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "cc-add-to-basket" && info.selectionText) {
        if (tab && tab.id && !tab.url.startsWith("chrome://")) {
            try { await ensureContentScript(tab.id); } catch (e) { }
        }

        addToBasketFromBackground(info.selectionText, tab);
    }
});

function addToBasketFromBackground(text, tab) {
    chrome.storage.local.get(['cc_basket'], (result) => {
        const basket = result.cc_basket || [];

        const newItem = {
            text: text.trim(),
            timestamp: Date.now(),
            source: tab.url || "External Source"
        };

        basket.push(newItem);

        chrome.storage.local.set({ 'cc_basket': basket }, () => {
            console.log("Context-Carry: Item added via Context Menu.");
            chrome.action.setBadgeText({ text: basket.length.toString() });
            chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });

            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, { action: "BASKET_UPDATED" }).catch(() => {
                });
            }
        });
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const targetDomains = ["chatgpt.com", "claude.ai", "gemini.google.com", "grok.com", "x.com"];
        const isTarget = targetDomains.some(domain => tab.url.includes(domain));

        if (isTarget) {
            chrome.storage.local.get(['cc_transfer_payload'], (result) => {
                if (result.cc_transfer_payload) {
                    const isFresh = (Date.now() - result.cc_transfer_payload.timestamp < 30000);

                    if (isFresh) {
                        console.log(`Context-Carry: Detected target LLM (${tab.url}) with pending payload. Injecting...`);
                        ensureContentScript(tabId);
                    }
                }
            });
        }
    }
});