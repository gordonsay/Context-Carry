const translations = {
    'en': {
        langLabel: '中文',
        title: 'System Update',
        status: 'STABLE MODULES INSTALLED.',
        targets: 'Targets: ChatGPT / Claude / Gemini / Grok / Ollama / LM-Studio',
        storage: 'Storage: Local (Browser)',

        qs_title: 'Quick Start',
        qs_item1_title: 'Collect to Basket',
        qs_item1_desc: 'Drag & drop Context into the UI or use right-click “Add to Context Basket”.',
        qs_item2_title: 'Hotkeys',
        qs_item2_desc: `<span class="kbd">Alt+C</span> Area Paint &nbsp;·&nbsp; 
                        <span class="kbd">Alt+L</span> Language &nbsp;·&nbsp; 
                        <span class="kbd">Alt+M</span> Toggle UI`,

        f1_title: 'Rapid Capture',
        f1_desc: 'Enhanced <span class="highlight">Drag & Drop</span> and <span class="highlight">Area Paint</span> selection for instant context gathering.',
        f1_label1: 'Drag & Drop',
        f1_label2: 'Area Paint',

        f2_title: 'Seamless Connectivity',
        f2_desc: 'Bridge the gap between <span class="highlight">Local Files</span> and <span class="highlight">Cross-Window</span> contexts.',
        f2_label1: 'Local File Import',
        f2_label2: 'Cross-Window Transfer',

        f3_title: 'BYO-Key AI Engine',
        f3_desc: 'Unlock direct access to top LLMs (OpenAI, Claude, Gemini, Local) with <span class="highlight">Workflow Mode</span> multitasking.',
        f3_label1: 'PIP Window',
        f3_label2: 'Workflow Mode',
        f3_note: '⚠️ HOW TO UNLOCK:<br>-> Standard UI : Click "AI Settings" in Advanced Options<br>-> Mech UI : Click the Antenna',

        f4_title: 'Mech UI & Smart Drone',
        f4_desc: 'Visual upgrade to <span class="highlight">Mech Mode</span> with a persistent Drone that remembers position.',
        f4_label1: 'Mech Transformation',
        f4_label2: 'Smart Drone & i18n',

        footer: 'Please reload your working tabs to activate Context-Carry.',
        footer_note: 'This update page opens automatically after install/update and sets a <b>NEW</b> badge on the extension icon.',
        btn_start: 'Close Window | Start Using'
    },
    'zh': {
        langLabel: 'English',
        title: '系統更新通知',
        status: '穩定模組已裝載',
        targets: '支援：ChatGPT / Claude / Gemini / Grok / Ollama / LM-Studio',
        storage: '儲存：本機 (瀏覽器)',

        qs_title: '快速上手',
        qs_item1_title: '收集到採集籃',
        qs_item1_desc: '拖曳Context到介面，或右鍵選取文字「Add to Context Basket」。',
        qs_item2_title: '快捷鍵',
        qs_item2_desc: `<span class="kbd">Alt+C</span> 圈選 &nbsp;·&nbsp; 
                        <span class="kbd">Alt+L</span> 語言 &nbsp;·&nbsp; 
                        <span class="kbd">Alt+M</span> 切換介面`,

        f1_title: '極速採集系統',
        f1_desc: '強化 <span class="highlight">拖曳加入</span> 與 <span class="highlight">筆刷圈選</span>，直覺快速地收集上下文。',
        f1_label1: '智慧拖曳',
        f1_label2: '筆刷圈選',

        f2_title: '無縫串聯',
        f2_desc: '打破界限，支援 <span class="highlight">本地文件直接讀取</span> 與 <span class="highlight">跨視窗 (A to B)</span> 內容傳送。',
        f2_label1: '本地檔案匯入',
        f2_label2: '跨視窗傳送',

        f3_title: '自備金鑰 AI 引擎',
        f3_desc: '解鎖 AI 潛能 (OpenAI, Claude, Gemini, Local)，體驗 <span class="highlight">工作流模式</span> 多工協作。',
        f3_label1: 'PIP 視窗',
        f3_label2: '工作流模式',
        f3_note: '⚠️ 解鎖方式：<br>-> 標準UI : 點擊進階選項中的AI設定<br>-> 機甲UI : 點擊天線',

        f4_title: '機甲 UI & 智慧運輸機',
        f4_desc: '視覺全面升級。從介面 <span class="highlight">變形 (Transform)</span> 為機甲模式，並搭載會記憶位置的智慧小飛機。',
        f4_label1: '機甲變形',
        f4_label2: '智慧飛機 & 在地化',

        footer: '請重新整理您目前的工作分頁以載入 Context-Carry',
        footer_note: '此更新頁會在安裝/更新後自動開啟，並在擴充功能圖示上顯示 <b>NEW</b> 徽章。',
        btn_start: '關閉視窗 | 開始使用'
    }
};

const systemLang = (chrome.i18n && chrome.i18n.getUILanguage) ? chrome.i18n.getUILanguage() : navigator.language;
let currentLang = systemLang.startsWith('zh') ? 'zh' : 'en';

function updateContent() {
    const t = translations[currentLang];

    const langLabel = document.getElementById('lang-label');
    if (langLabel) langLabel.innerText = t.langLabel;

    document.title = t.title || 'Context-Carry Update';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerHTML = t[key];
    });

    document.documentElement.lang = currentLang;
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    updateContent();
}

document.addEventListener('DOMContentLoaded', () => {
    updateContent();

    const langSwitchBtn = document.getElementById('btn-lang-switch');
    if (langSwitchBtn) {
        langSwitchBtn.addEventListener('click', toggleLanguage);
    }

    const closeBtn = document.getElementById('btn-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.close();
        });
    }

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('active');
        });
    });
});