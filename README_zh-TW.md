# Context-Carry — 一鍵在 ChatGPT、Claude、Grok、Gemini 之間轉移完整對話上下文

> [🔙 返回英文版本（English Version）](README.md)

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Available-blue?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/okjnafabngnahdppmbnmefofokpegccm?utm_source=item-share-cb)
[![Language](https://img.shields.io/badge/Language-English-blue)](README.md)
![Version](https://img.shields.io/badge/version-1.4.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

<details>
  <summary>目錄（點擊展開）</summary>

- [快速上手](#快速上手)
- [典型使用情境](#典型使用情境typical-use-cases)
- [核心功能](#核心功能key-features)
- [操作截圖](#操作截圖)
- [安裝方式](#安裝方式)
- [使用方式](#使用方式)
- [隱私說明](#隱私說明)
- [免責聲明](#免責聲明)
- [更新日誌](#更新日誌)
- [授權](#授權)

</details>

**停止重複撰寫相同提示詞，一鍵在不同 AI 平台之間轉移完整上下文。**

Context-Carry 是一款輕量、專為進階使用者打造的 Chrome 擴充功能，讓你可以：

- ✅ 從 ChatGPT、Claude、Gemini、Grok 擷取對話紀錄  
- ✅ **從任何網站擷取重要文字**（StackOverflow、Gmail、文件）透過通用採集模式  
- ✅ **拖曳 (Drag & Drop)** 選取文字直接丟入採集籃  
- ✅ 透過畫筆工具 **視覺化圈選** 網頁文字  
- ✅ 重新排序並建構乾淨、具邏輯的上下文內容  
- ✅ 一鍵自動填入到新的 AI 對話視窗  
- ✅ 即時 Token 預估（跨分頁同步），避免超出上下文長度限制

這款工具專為**開發者、研究人員與高頻 AI 使用者**設計，  
適合每天在多個 AI 平台之間切換、又討厭不斷重建 prompt 的你。

> 如果你每天都在使用多個 AI 工具，Context-Carry 每週能幫你節省數小時的重複操作時間。

---

## 快速上手

1. 開啟 **ChatGPT / Claude / Gemini**
2. 點擊右側的 **Context-Carry 懸浮面板**
3. 點擊 **➕** 擷取對話  
   （或使用 **Shift + 點擊** 進行多段選取）
4. 開啟另一個 AI 平台分頁
5. 點擊 **New Chat** → ✅ 自動填入完成

全程無需複製貼上、無需重新排版。

---

## 典型使用情境（Typical Use Cases）

- 🔁 將長篇 ChatGPT 討論一鍵轉移到 Claude 進行深度推理  
- 🧪 在不同 LLM 之間交叉比對 Debug 對話  
- 📚 **研究模式 (Research Mode)**：將 GitHub 的程式碼、StackOverflow 的錯誤訊息、Gmail 的需求規格拖曳整合到同一個 Prompt 上下文中。
- 🧠 重複使用結構良好的提示詞，而不是每次重貼  
- 📏 透過 Token 預估避免 Context Window 爆掉  

---

## 核心功能（Key Features）

- **拖曳採集 (Drag-and-Drop Capture) 📥【New!】**
  看到有用的內容？直接選取網頁上的文字，將其**拖曳**到 Context-Carry 面板上。當出現綠色 **"Drop to Add"** 覆蓋層時放開，即可瞬間加入採集籃。

- **通用採集模式 (Universal Collector Mode) 🌐【New!】**
  介面現在會自動適應環境。在非 AI 網站（如 Gmail, StackOverflow, GitLab）上，會自動切換為專注的「採集模式」，讓你專心收集跨網頁的研究資料。

- **畫筆圈選擷取 (Visual Area Selection) 🖌️**
  啟動圈選模式後，可自由在任何網站畫出區域，系統會自動擷取並清理該區域內的所有文字，並顯示即時預覽。

- **智慧匯出選項 (Smart Export Options)**
  當同時擁有「採集籃內容」與「當前頁面選取」時，擴充功能會智慧詢問您要匯出 **僅採集籃**、**僅頁面**、或是 **合併兩者**。

- **乾淨上下文架構 (Clean Context Architecture)**
  System Prompt（前綴提示詞）現在與內容完全分離管理。加入採集籃的資料是「乾淨」的，避免在合併多個來源時混入重複的 System Prompt。

- **跨視窗 Context Basket (採集籃)**
  終極的暫存區。你可以同時從多個分頁（AI、文件、論壇、技術文章）收集片段，最後一次整理後轉移。

- **跨視窗 Token 同步 (Cross-Window Token Sync)**
  Token 預估數量現在會在所有分頁間即時同步。在分頁 A 加入項目，分頁 B 的預估值也會立即更新。

- **拖曳排序 (Drag-and-Drop Reordering)**
  上下文的順序很重要。在採集籃預覽中，你可以自由拖曳調整順序，重組 AI 理解的敘事流程。

- **Magic Auto-Fill 自動填入**
  自動開啟目標 AI 網站並填入整理好的內容，完全免貼上。

- **Markdown 格式轉換**
  自動將 HTML 轉為乾淨 Markdown（標題、粗體、程式碼區塊），提升 AI 閱讀理解力。

- **可拖曳懸浮介面**
  面板位置可自由拖移，不會遮擋畫面。

---

## 操作截圖

![Demo](screenshots/demo.gif)

![Demo](screenshots/circle.gif)

![Demo](screenshots/drag.gif)

![標準 UI](screenshots/screenshot_gpt.png)

![進階 UI](screenshots/ui.png)

---

## 快捷鍵（Keyboard Shortcuts）

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| **Alt + M** | 開關面板 | 快速顯示 / 隱藏 Context-Carry |
| **Alt + Z** | 啟動圈選 | 進入畫筆圈選模式 |
| **Alt + L** | 切換語言 | 中 / 英介面切換 |

---

## 安裝方式

### Chrome 線上應用程式商店
[在擴充商店下載](https://chromewebstore.google.com/detail/okjnafabngnahdppmbnmefofokpegccm?utm_source=item-share-cb)

### 手動安裝（開發者模式）

1. 下載最新原始碼或 clone 本專案
2. 在 Chrome 開啟：`chrome://extensions/`
3. 開啟右上角「開發者模式」
4. 點擊「載入未封裝項目」
5. 選擇此擴充功能所在資料夾

---

## 使用方式

### 方法一：擷取 AI 對話

1. 開啟 ChatGPT / Claude / Gemini / Grok
2. 點擊 **Context-Carry 懸浮面板**
3. 點擊 **➕** 選取單則訊息  
   或使用 **Shift + 點擊** 進行區段選取
4. 點擊 **Add (+)** 加入 Basket

---

### 方法二：畫筆圈選模式（Area Select）

1. 點擊 Context-Carry 面板上的 **🖌️ 畫筆圖示**  
   或按下快捷鍵 **Alt + Z**
2. 在畫面上自由畫出要擷取的區域
3. 系統會顯示即時文字預覽視窗
4. 點擊「加入採集籃（Add to Basket）」即可儲存

---

### 方法三：從任何網站擷取文字

1. 在任意網站選取文字（文件、技術文章、新聞等）
2. **滑鼠右鍵**
3. 點擊 **「Add to Context Basket (+)」**
4. 擴充功能圖示會顯示目前項目數量

---

### 方法四：拖曳採集 (Drag-and-Drop)
1. 在網頁上選取任何文字
2. 將選取的文字**拖曳**至 Context-Carry 面板方向
3. 當看到綠色的 **"Drop to Add"** 覆蓋層時放開滑鼠即可

---

### 方法五：匯出與轉移
1. **檢視**：開啟 Basket 預覽並依需求拖曳排序
2. **匯出**：點擊「輸出為 .txt」或「複製到剪貼簿」
   - *智慧選擇*：若同時有 Basket 與頁面選取，系統會詢問匯出範圍
3. **轉移**：點擊平台圖示（如 Claude 🧠）開啟新分頁並自動填入內容

---

## 隱私說明

- 所有功能皆在本機執行
- 僅使用 `chrome.storage` 作為跨分頁暫存用途
- **不會蒐集、儲存、或傳送任何使用者資料到外部伺服器**
- 詳細請參考 [PRIVACY.md](PRIVACY.md)

---

## 開發說明

歡迎提交 Pull Request。  
若為重大改動，請先建立 Issue 討論。

  ```bash
    git clone https://github.com/gordonsay/Context-Carry.git
  ``` 

---

## 免責聲明

本擴充功能與 OpenAI、Anthropic、Google、xAI 無任何隸屬或合作關係。 所有產品名稱、商標與品牌皆屬於其各自擁有者。

## 更新日誌

請參閱 [CHANGELOG.md](CHANGELOG.md) 以獲取更新日誌。


## 授權

本專案採用 MIT 授權 - 詳細內容請參考 [LICENSE](LICENSE) 檔案。


## 連絡方式

如需任何幫助，請在 [GitHub repository](https://github.com/gordonsay/Context-Carry) 上建立 Issue。


## 注意事項

由於瀏覽器安全性限制，檔案附件（PDF/圖片）無法自動轉移。


## 關鍵字

ChatGPT Chrome 擴充功能、Claude 上下文工具、Gemini Prompt 轉移、LLM 上下文管理工具、Prompt 工程、AI 工作流程工具、跨 LLM 對話轉移
