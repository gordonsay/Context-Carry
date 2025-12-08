(function () {
    /* =========================================
       1. Language dictionary and settings
    ========================================= */
    const APP_CONFIG = {
        // ChatGPT
        'chatgpt.com': {
            msgSelector: 'article',
            newChatUrl: 'https://chatgpt.com/?model=gpt-4o',
            ignore: '.sr-only, button, .cb-buttons'
        },
        // Google Gemini
        'google.com': {
            msgSelector: 'user-query, model-response',
            newChatUrl: 'https://gemini.google.com/app',
            ignore: '.mat-icon, .action-button, .button-label, .botones-acciones'
        },
        // Claude (Anthropic)
        'claude.ai': {
            msgSelector: 'div[data-testid="user-message"], div.font-claude-response',
            newChatUrl: 'https://claude.ai/new',
            ignore: 'button, .copy-icon, [data-testid="chat-message-actions"], .cursor-pointer'
        },
        // Grok (x.com / grok.com)
        'grok': {
            msgSelector: '.message-bubble',
            newChatUrl: 'https://grok.com',
            ignore: 'svg, span[role="button"], .action-buttons'
        }
    };

    const LANG_DATA = {
        'zh': {
            title: 'Context-Carry',
            status_ready: '準備就緒',
            status_scanning: '正在掃描...',
            label_prefix: '自訂前綴提示詞 (Title):',
            placeholder: '在此輸入要給 AI 的前導指令...',
            btn_scan: '重新掃描頁面',
            btn_scan_done: '已重新掃描',
            btn_dl: '輸出為 .txt',
            btn_transfer: '轉移到新對話',
            msg_detected: '偵測到 {n} 則訊息',
            msg_selected: '已選取: {n} 則',
            alert_no_selection: '請先選取對話！',
            alert_copy_success: '內容已複製！\n\n即將開啟新視窗，請在新視窗對話框按「Ctrl+V」貼上。\n\n要繼續嗎？',
            alert_copy_fail: '複製失敗，請檢查瀏覽器權限',
            btn_add_title: '加入此段落',
            default_prompt: `[SYSTEM: CONTEXT TRANSFER]\n以下是使用者篩選的對話歷史，請以此為背景繼續對話：`
        },
        'en': {
            title: 'Context-Carry',
            status_ready: 'Ready',
            status_scanning: 'Scanning...',
            label_prefix: 'Custom Prefix (System Prompt):',
            placeholder: 'Enter instructions for the AI here...',
            btn_scan: 'Rescan Page',
            btn_scan_done: 'Scanned',
            btn_dl: 'Export to .txt',
            btn_transfer: 'Transfer to New Chat',
            msg_detected: 'Detected {n} messages',
            msg_selected: 'Selected: {n}',
            alert_no_selection: 'Please select messages first!',
            alert_copy_success: 'Copied!\n\nOpening new window. Press "Ctrl+V" to paste.\n\nContinue?',
            alert_copy_fail: 'Copy failed. Check permissions.',
            btn_add_title: 'Add this block',
            default_prompt: `[SYSTEM: CONTEXT TRANSFER]\nThe following is the conversation history selected by the user. Please use this as context to continue the conversation:`
        }
    };

    let curLang = 'en';

    /* =========================================
       2. Environment detection and initialization
    ========================================= */
    const host = window.location.hostname;
    let config = null;

    if (host.includes('chatgpt')) config = APP_CONFIG['chatgpt.com'];
    else if (host.includes('google')) config = APP_CONFIG['google.com'];
    else if (host.includes('claude')) config = APP_CONFIG['claude.ai'];
    else if (host.includes('x.com') || host.includes('grok.com')) config = APP_CONFIG['grok'];
    else return;

    if (document.getElementById('cc-panel')) {
        document.getElementById('cc-panel').remove();
        document.querySelectorAll('.cc-btn').forEach(e => e.remove());
        const outlines = document.querySelectorAll('*');
        outlines.forEach(el => {
            if (el.style.outline.includes('#4CAF50')) el.style.outline = 'none';
            if (el.dataset.ccPadding) { el.style.paddingLeft = ''; delete el.dataset.ccPadding; }
        });
        return;
    }

    /* =========================================
       3. Create UI panel
    ========================================= */
    const panel = document.createElement('div');
    panel.id = 'cc-panel';
    Object.assign(panel.style, {
        position: 'fixed', top: '80px', right: '20px', zIndex: '2147483647',
        background: '#1e1e1e', color: '#fff', padding: '16px', borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)', fontFamily: 'sans-serif',
        width: '260px', border: '1px solid #444', textAlign: 'left', display: 'flex', flexDirection: 'column'
    });

    const header = document.createElement('div');
    Object.assign(header.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #444', paddingBottom: '8px' });

    const title = document.createElement('div');
    title.innerText = LANG_DATA[curLang].title;
    title.style.fontWeight = 'bold';
    title.style.fontSize = '14px';

    const langBtn = document.createElement('button');
    langBtn.innerText = '🌐 中/En';
    langBtn.title = '切換語言';
    Object.assign(langBtn.style, { background: 'transparent', border: '1px solid #555', color: '#aaa', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', padding: '2px 6px' });

    header.append(title, langBtn);

    const msg = document.createElement('div');
    msg.innerText = LANG_DATA[curLang].status_scanning;
    Object.assign(msg.style, { fontSize: '12px', color: '#aaa', marginBottom: '12px' });

    const prefixLabel = document.createElement('div');
    prefixLabel.innerText = LANG_DATA[curLang].label_prefix;
    Object.assign(prefixLabel.style, { fontSize: '12px', color: '#ccc', marginBottom: '6px', fontWeight: 'bold' });

    const prefixInput = document.createElement('textarea');
    prefixInput.id = 'cc-prefix-input';
    prefixInput.value = LANG_DATA[curLang].default_prompt;
    prefixInput.placeholder = LANG_DATA[curLang].placeholder;
    Object.assign(prefixInput.style, {
        width: '100%', height: '150px', background: '#333', color: '#eee',
        border: '1px solid #555', borderRadius: '6px', padding: '8px',
        marginBottom: '12px', fontFamily: 'sans-serif', fontSize: '12px',
        resize: 'vertical', boxSizing: 'border-box'
    });

    function createBtn(textKey, id, bg, extraStyle = {}) {
        const b = document.createElement('button');
        b.id = id;
        b.innerText = LANG_DATA[curLang][textKey];
        Object.assign(b.style, {
            width: '100%', background: bg, color: '#fff', border: 'none',
            padding: '8px', borderRadius: '6px', cursor: 'pointer', marginBottom: '8px',
            fontSize: '13px', ...extraStyle
        });
        return b;
    }

    const btnDl = createBtn('btn_dl', 'cc-dl', '#2E7D32', { fontWeight: 'bold' });
    const btnTransfer = createBtn('btn_transfer', 'cc-transfer', '#1565C0', { fontWeight: 'bold' });
    const hr = document.createElement('hr');
    Object.assign(hr.style, { border: '0', borderTop: '1px solid #333', margin: '8px 0', width: '100%' });
    const btnScan = createBtn('btn_scan', 'cc-scan', '#444', { border: '1px solid #666', fontSize: '12px', padding: '6px' });

    panel.append(header, msg, prefixLabel, prefixInput, btnDl, btnTransfer, hr, btnScan);
    document.body.appendChild(panel);

    /* =========================================
       4. Language switch logic
    ========================================= */
    function flashInput(el) {
        el.style.transition = 'background 0.2s';
        el.style.background = '#555';
        setTimeout(() => el.style.background = '#333', 200);
    }

    function updateUITexts() {
        const t = LANG_DATA[curLang];
        title.innerText = t.title;

        if (!msg.innerText.includes('Selected') && !msg.innerText.includes('選取')) {
            msg.innerText = t.status_ready;
        }
        const selectedCount = document.querySelectorAll('.cc-btn[data-selected="true"]').length;
        if (selectedCount > 0) msg.innerText = t.msg_selected.replace('{n}', selectedCount);

        prefixLabel.innerText = t.label_prefix;
        prefixInput.placeholder = t.placeholder;
        btnDl.innerText = t.btn_dl;
        btnTransfer.innerText = t.btn_transfer;
        btnScan.innerText = t.btn_scan;

        document.querySelectorAll('.cc-btn').forEach(b => {
            if (b.innerText === '➕') b.title = t.btn_add_title;
        });
    }

    langBtn.onclick = function () {
        const oldLang = curLang;
        const newLang = curLang === 'zh' ? 'en' : 'zh';

        const currentInput = prefixInput.value.trim();
        const oldDefault = LANG_DATA[oldLang].default_prompt.trim();

        if (currentInput === oldDefault) {
            prefixInput.value = LANG_DATA[newLang].default_prompt;
            flashInput(prefixInput);
        }
        curLang = newLang;
        updateUITexts();
    };

    /* =========================================
       5. Core scan feature
    ========================================= */
    function performScan() {
        const els = document.querySelectorAll(config.msgSelector);
        let count = 0;
        const t = LANG_DATA[curLang];

        els.forEach(el => {
            if (el.querySelector('.cc-btn') || el.innerText.trim().length < 1) return;

            const style = window.getComputedStyle(el);
            if (style.position === 'static') {
                el.style.position = 'relative';
            }

            if (!el.dataset.ccPadding) {
                const currentPadLeft = parseInt(style.paddingLeft) || 0;
                el.style.paddingLeft = (currentPadLeft + 35) + 'px';
                el.dataset.ccPadding = 'true';
            }

            const btn = document.createElement('button');
            btn.className = 'cc-btn';
            btn.innerText = '➕';
            btn.title = t.btn_add_title;

            Object.assign(btn.style, {
                position: 'absolute',
                top: '8px',
                left: '6px',
                zIndex: '9999',
                background: '#fff',
                color: '#333',
                border: '1px solid #999',
                fontWeight: '900',
                padding: '0',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '4px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: '1'
            });

            btn.onmouseenter = () => {
                btn.style.borderColor = '#4CAF50';
                btn.style.color = '#4CAF50';
                btn.style.transform = 'scale(1.1)';
                btn.style.transition = 'all 0.1s';
            };
            btn.onmouseleave = () => {
                if (btn.dataset.selected !== 'true') {
                    btn.style.borderColor = '#999';
                    btn.style.color = '#333';
                    btn.style.transform = 'scale(1)';
                }
            };

            btn.onclick = function (e) {
                e.stopPropagation();
                const isSelected = this.dataset.selected === 'true';
                if (!isSelected) {
                    this.innerText = '✓';
                    this.style.background = '#4CAF50';
                    this.style.color = '#fff';
                    this.style.borderColor = '#4CAF50';
                    this.dataset.selected = 'true';

                    el.style.outline = '2px solid #4CAF50';
                    el.style.outlineOffset = '-2px';
                    el.dataset.originalBg = el.style.backgroundColor;
                    el.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                } else {
                    this.innerText = '➕';
                    this.style.background = '#fff';
                    this.style.color = '#333';
                    this.style.borderColor = '#999';
                    delete this.dataset.selected;

                    el.style.outline = 'none';
                    el.style.backgroundColor = el.dataset.originalBg || '';
                }
                updateStatus();
            };

            el.appendChild(btn);
            count++;
        });

        const total = document.querySelectorAll('.cc-btn').length;
        if (count > 0 || total > 0) {
            msg.innerText = t.msg_detected.replace('{n}', total);
        }
    }

    btnScan.onclick = function () {
        performScan();
        this.innerText = LANG_DATA[curLang].btn_scan_done;
        setTimeout(() => this.innerText = LANG_DATA[curLang].btn_scan, 1000);
    };

    function updateStatus() {
        const n = document.querySelectorAll('.cc-btn[data-selected="true"]').length;
        msg.innerText = LANG_DATA[curLang].msg_selected.replace('{n}', n);
    }

    function getSelectedText() {
        const selected = document.querySelectorAll('.cc-btn[data-selected="true"]');
        if (selected.length === 0) return null;

        const userPrefix = document.getElementById('cc-prefix-input').value;
        let combined = userPrefix + "\n\n====================\n\n";

        selected.forEach(btn => {
            const parent = btn.parentElement;
            const clone = parent.cloneNode(true);

            const myBtn = clone.querySelector('.cc-btn');
            if (myBtn) myBtn.remove();

            if (config.ignore) {
                clone.querySelectorAll(config.ignore).forEach(bad => bad.remove());
            }

            let textContent = clone.innerText.trim();
            combined += `--- Fragment ---\n${textContent}\n\n`;
        });
        combined += "====================\n[END OF CONTEXT]";
        return combined;
    }

    btnDl.onclick = function () {
        const t = LANG_DATA[curLang];
        const text = getSelectedText();
        if (!text) { alert(t.alert_no_selection); return; }
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-context-' + new Date().toISOString().slice(0, 10) + '.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    btnTransfer.onclick = function () {
        const t = LANG_DATA[curLang];
        const text = getSelectedText();
        if (!text) { alert(t.alert_no_selection); return; }
        navigator.clipboard.writeText(text).then(() => {
            if (confirm(t.alert_copy_success)) {
                window.open(config.newChatUrl, '_blank');
            }
        }).catch(err => alert(t.alert_copy_fail));
    };

    setTimeout(performScan, 1500);
    setInterval(performScan, 3000);

})();