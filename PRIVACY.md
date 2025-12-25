# Privacy Policy — Context-Carry

Your privacy matters. This document explains clearly how Context-Carry handles data.

---

## 🔒 1. Data Collection

- No user data is collected or uploaded to any developer server
- No analytics or tracking tools are used
- All processing happens locally in the browser unless you trigger an AI request manually

---

## 💾 2. Local Storage

The extension may store the following **locally only** using `chrome.storage.local`:

- Selected text saved to the **Context Basket**
- Prompts or instructions you input
- UI preferences and settings
- API keys for third-party AI providers (OpenAI, Anthropic, Google, xAI, xAI Grok)

> These API keys are stored **only on your device**, and are **never sent to the developer or backend servers**

---

## 🔑 3. How API Keys Are Used

- Keys are used only when you press a button that triggers an AI request
- Requests go **directly from browser → AI provider (HTTPS)**
- There are **no intermediate servers**

---

## 🌐 4. Data Flow

| Connection Target | Purpose | Stored on Developer Server? |
|---|---|---|
| AI providers (HTTPS) | User-triggered AI requests | ❌ Never |
| `localhost` (e.g., Ollama / LM Studio) | Optional local LLM support | ❌ Never |
| Browser local storage | Context & settings | ❌ Never |

---

## 🧹 5. Data Retention & Cleanup

- Auto-fill or temporary text is cleared **immediately after use**
- Context Basket can be cleared **manually anytime**
- All stored data (including API keys) is removed when:
  - You uninstall the extension
  - Or clear storage from the extension settings

---

## 🧩 6. Permission Usage & Justification

| Permission | Why it’s needed |
|---|---|
| `storage` | Save settings, context, API keys locally |
| `activeTab` / `scripting` | Inject UI, auto-fill on supported AI platforms |
| `host_permissions` | Detect supported sites for user-initiated actions |
| `contextMenus` | Capture text from right-click menu |

> No permission is used to monitor, upload, or track you in the background

---

## 📌 7. Policy Updates

We may update this privacy policy for clarity or compliance.  
Updates will be posted here and on the GitHub repository.

---

## 📬 8. Contact

If you have questions, feel free to reach out:

- **GitHub Issues:** `Context-Carry repository discussion`  
- **Email:** a0983828539@gmail.com

---