(function () {
    /* =========================================
       0. Global State Management & Guard
    ========================================= */
    if (typeof window.ccManager === 'undefined') {
        window.ccManager = {
            active: false,
            interval: null,
            lang: 'en',
            config: null,
            lastCheckedIndex: null,
            isPreviewOpen: false
        };
    } else {
        if (window.ccManager.toggleFn) {
            window.ccManager.toggleFn();
        }
        return;
    }

    /* =========================================
       1. Language dictionary and settings
    ========================================= */
    const PLATFORMS = [
        { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/?model=gpt-4o', icon: '🤖' },
        { id: 'claude', name: 'Claude', url: 'https://claude.ai/new', icon: '🧠' },
        { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app', icon: '💎' },
        { id: 'grok', name: 'Grok', url: 'https://grok.com', icon: '✖️' }
    ];

    const APP_CONFIG = {
        'chatgpt.com': {
            msgSelector: 'article',
            inputSelector: '#prompt-textarea',
            ignore: '.sr-only, button, .cb-buttons'
        },
        'google.com': {
            msgSelector: 'user-query, model-response',
            inputSelector: 'div[contenteditable="true"], .rich-textarea, textarea',
            ignore: '.mat-icon, .action-button, .button-label, .botones-acciones'
        },
        'claude.ai': {
            msgSelector: 'div[data-testid="user-message"], div.font-claude-response',
            inputSelector: 'div[contenteditable="true"]',
            ignore: 'button, .copy-icon, [data-testid="chat-message-actions"], .cursor-pointer'
        },
        'grok': {
            msgSelector: '.message-bubble',
            inputSelector: 'textarea, div[contenteditable="true"]',
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
            btn_select_all: '全選所有訊息',
            btn_unselect_all: '取消全選',
            btn_dl: '輸出為 .txt',
            btn_copy: '複製到剪貼簿',
            label_transfer: '轉移並開啟 (Cross-LLM):',
            msg_detected: '偵測到 {n} 則訊息',
            msg_selected: '已選取: {n} 則',
            alert_no_selection: '請先選取對話或加入採集籃！',
            alert_copy_done: '內容已複製！',
            alert_fail: '操作失敗，請檢查權限',
            btn_add_title: '加入此段落 (Shift 可連選)',
            toast_autofill: 'Context-Carry: 已自動填入內容 ✨',
            default_prompt: `[SYSTEM: CONTEXT TRANSFER]\n以下是使用者篩選的對話歷史，請以此為背景繼續對話：`,
            label_basket: '🧺 跨視窗採集籃 (Basket):',
            btn_add_basket: '加入 (+)',
            btn_clear_basket: '清空',
            btn_paste_basket: '填入此視窗',
            basket_status: '目前有 {n} 筆資料 (點擊預覽 ▼)',
            basket_status_empty: '採集籃是空的',
            toast_basket_add: '已加入採集籃 🧺',
            toast_basket_clear: '採集籃已清空 🗑️',
            preview_del_tooltip: '刪除此筆資料',
            preview_drag_hint: '可拖曳排序 ⇅ (懸停可看詳情)'
        },
        'en': {
            title: 'Context-Carry',
            status_ready: 'Ready',
            status_scanning: 'Scanning...',
            label_prefix: 'Custom Prefix (System Prompt):',
            placeholder: 'Enter instructions for the AI here...',
            btn_scan: 'Rescan Page',
            btn_select_all: 'Select All',
            btn_unselect_all: 'Unselect All',
            btn_scan_done: 'Scanned',
            btn_dl: 'Export to .txt',
            btn_copy: 'Copy to Clipboard',
            label_transfer: 'Transfer to (Cross-LLM):',
            msg_detected: 'Detected {n} messages',
            msg_selected: 'Selected: {n}',
            alert_no_selection: 'Please select messages or add to basket first!',
            alert_copy_done: 'Content copied!',
            alert_fail: 'Operation failed. Check permissions.',
            btn_add_title: 'Add this block (Shift for range)',
            toast_autofill: 'Context-Carry: Content Auto-filled ✨',
            default_prompt: `[SYSTEM: CONTEXT TRANSFER]\nThe following is the conversation history selected by the user. Please use this as context to continue the conversation:`,
            label_basket: '🧺 Context Basket:',
            btn_add_basket: 'Add (+)',
            btn_clear_basket: 'Clear',
            btn_paste_basket: 'Paste Here',
            basket_status: '{n} items in basket (Click to View ▼)',
            basket_status_empty: 'Basket is empty',
            toast_basket_add: 'Added to Basket 🧺',
            toast_basket_clear: 'Basket Cleared 🗑️',
            preview_del_tooltip: 'Remove item',
            preview_drag_hint: 'Drag to reorder ⇅ (Hover for details)'
        }
    };

    /* =========================================
       2. Environment detection
    ========================================= */
    const host = window.location.hostname;
    let config = null;

    if (host.includes('chatgpt')) config = APP_CONFIG['chatgpt.com'];
    else if (host.includes('google')) config = APP_CONFIG['google.com'];
    else if (host.includes('claude')) config = APP_CONFIG['claude.ai'];
    else if (host.includes('x.com') || host.includes('grok.com')) config = APP_CONFIG['grok'];

    window.ccManager.config = config;

    if (!config) return;

    /* =========================================
       3. Main Functions: Open / Close / Toggle
    ========================================= */

    function openInterface() {
        if (window.ccManager.active) return;
        window.ccManager.active = true;

        console.log("Context-Carry: Enabled");
        createPanel();
        performScan();
        window.ccManager.interval = setInterval(performScan, 3000);
        checkAutoFill();
        updateBasketUI(); 
    }

    function closeInterface() {
        if (!window.ccManager.active) return;
        window.ccManager.active = false;

        console.log("Context-Carry: Disabled");
        if (window.ccManager.interval) {
            clearInterval(window.ccManager.interval);
            window.ccManager.interval = null;
        }
        const panel = document.getElementById('cc-panel');
        if (panel) panel.remove();
        
        const tooltip = document.getElementById('cc-tooltip');
        if (tooltip) tooltip.remove();

        document.querySelectorAll('.cc-btn').forEach(e => e.remove());
        const processedElements = document.querySelectorAll('[data-cc-padding]');

        processedElements.forEach(el => {
            el.style.paddingLeft = '';
            const isSelected = el.dataset.ccSelected === 'true';
            if (isSelected || el.style.outline.includes('4CAF50')) {
                el.style.outline = '';
                el.style.outlineOffset = '';
                el.style.backgroundColor = el.dataset.originalBg || '';
            }
            delete el.dataset.ccPadding;
            delete el.dataset.ccSelected;
            delete el.dataset.originalBg;
        });
        window.ccManager.lastCheckedIndex = null;
    }

    function toggleInterface() {
        if (window.ccManager.active) {
            closeInterface();
        } else {
            openInterface();
        }
    }
    window.ccManager.toggleFn = toggleInterface;

    /* =========================================
       4. UI Construction
    ========================================= */
    let title, msg, prefixLabel, prefixInput, btnDl, btnCopy, btnScan, transferLabel, transferContainer, btnSelectAll, btnUnselectAll;
    let basketLabel, basketStatus, btnAddBasket, btnClearBasket, btnPasteBasket, basketPreviewList;
    let tooltip; // [New] Tooltip Element

    function createPanel() {
        if (document.getElementById('cc-panel')) return;

        const curLang = window.ccManager.lang;
        const t = LANG_DATA[curLang];

        // [New] Create Shared Tooltip
        tooltip = document.createElement('div');
        tooltip.id = 'cc-tooltip';
        Object.assign(tooltip.style, {
            position: 'fixed', display: 'none', zIndex: '2147483648',
            background: 'rgba(20, 20, 20, 0.95)', color: '#fff',
            padding: '8px 12px', borderRadius: '6px', fontSize: '12px',
            maxWidth: '300px', maxHeight: '200px', overflowY: 'auto',
            border: '1px solid #555', boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            pointerEvents: 'none', // Allow clicking through it
            whiteSpace: 'pre-wrap', fontFamily: 'monospace'
        });
        document.body.appendChild(tooltip);

        const panel = document.createElement('div');
        panel.id = 'cc-panel';
        Object.assign(panel.style, {
            position: 'fixed', top: '80px', right: '20px', zIndex: '2147483647',
            background: '#1e1e1e', color: '#fff', padding: '16px', borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)', fontFamily: 'sans-serif',
            width: '280px', border: '1px solid #444', textAlign: 'left', display: 'flex', flexDirection: 'column'
        });

        // Draggable Logic
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        const header = document.createElement('div');
        Object.assign(header.style, { 
            display: 'flex', alignItems: 'center', marginBottom: '12px', 
            borderBottom: '1px solid #444', paddingBottom: '8px',
            cursor: 'move', userSelect: 'none' 
        });

        header.onmousedown = (e) => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            
            panel.style.right = 'auto';
            panel.style.left = rect.left + 'px';
            panel.style.top = rect.top + 'px';
        };

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX - dragOffsetX) + 'px';
                panel.style.top = (e.clientY - dragOffsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        title = document.createElement('div');
        title.innerText = t.title;
        title.style.fontWeight = 'bold';
        title.style.fontSize = '14px';
        title.style.flexGrow = '1';

        const langBtn = document.createElement('button');
        langBtn.innerText = '🌐 中/En';
        Object.assign(langBtn.style, { background: 'transparent', border: '1px solid #555', color: '#aaa', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', padding: '2px 6px', marginRight: '8px' });

        langBtn.onclick = function () {
            const oldLang = window.ccManager.lang;
            const newLang = oldLang === 'zh' ? 'en' : 'zh';
            const currentInput = prefixInput.value.trim();
            const oldDefault = LANG_DATA[oldLang].default_prompt.trim();
            if (currentInput === oldDefault) {
                prefixInput.value = LANG_DATA[newLang].default_prompt;
                flashInput(prefixInput);
            }

            window.ccManager.lang = newLang;
            updateUITexts();
        };

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        Object.assign(closeBtn.style, {
            background: 'transparent', border: 'none', color: '#888',
            cursor: 'pointer', fontSize: '18px', padding: '0 4px', lineHeight: '1'
        });
        closeBtn.onclick = closeInterface;

        header.append(title, langBtn, closeBtn);

        // Status Message
        msg = document.createElement('div');
        msg.innerText = t.status_scanning;
        Object.assign(msg.style, { fontSize: '12px', color: '#aaa', marginBottom: '12px' });

        // Prompt Input
        prefixLabel = document.createElement('div');
        prefixLabel.innerText = t.label_prefix;
        Object.assign(prefixLabel.style, { fontSize: '12px', color: '#ccc', marginBottom: '6px', fontWeight: 'bold' });

        prefixInput = document.createElement('textarea');
        prefixInput.id = 'cc-prefix-input';
        prefixInput.value = t.default_prompt;
        prefixInput.placeholder = t.placeholder;
        Object.assign(prefixInput.style, {
            width: '100%', height: '80px', background: '#333', color: '#eee',
            border: '1px solid #555', borderRadius: '6px', padding: '8px',
            marginBottom: '12px', fontFamily: 'sans-serif', fontSize: '12px',
            resize: 'vertical', boxSizing: 'border-box'
        });

        // Buttons Helper
        function createBtn(textKey, bg, onClick) {
            const b = document.createElement('button');
            b.innerText = t[textKey];
            b.dataset.key = textKey;
            Object.assign(b.style, {
                flex: '1', background: bg, color: '#fff', border: 'none',
                padding: '8px', borderRadius: '6px', cursor: 'pointer',
                fontSize: '12px', fontWeight: 'bold'
            });
            b.onclick = onClick;
            return b;
        }

        const selectionRow = document.createElement('div');
        Object.assign(selectionRow.style, { display: 'flex', gap: '8px', marginBottom: '8px' });
        btnSelectAll = createBtn('btn_select_all', '#1976D2', handleSelectAll);
        btnUnselectAll = createBtn('btn_unselect_all', '#555', handleUnselectAll);
        selectionRow.append(btnSelectAll, btnUnselectAll);

        const actionRow = document.createElement('div');
        Object.assign(actionRow.style, { display: 'flex', gap: '8px', marginBottom: '12px' });
        btnDl = createBtn('btn_dl', '#2E7D32', handleDownload);
        btnCopy = createBtn('btn_copy', '#555', handleCopyOnly);
        actionRow.append(btnDl, btnCopy);

        // --- Basket UI ---
        const basketContainer = document.createElement('div');
        Object.assign(basketContainer.style, { 
            background: '#2d2d2d', padding: '10px', borderRadius: '8px', 
            marginBottom: '12px', border: '1px solid #444', display: 'flex', flexDirection: 'column'
        });

        const basketHeader = document.createElement('div');
        basketHeader.style.display = 'flex';
        basketHeader.style.justifyContent = 'space-between';
        
        basketLabel = document.createElement('div');
        basketLabel.innerText = t.label_basket;
        basketLabel.style.fontSize = '12px';
        basketLabel.style.fontWeight = 'bold';
        basketLabel.style.marginBottom = '4px';

        basketHeader.append(basketLabel);

        basketStatus = document.createElement('div');
        basketStatus.innerText = t.basket_status_empty;
        Object.assign(basketStatus.style, {
            fontSize: '11px', color: '#aaa', marginBottom: '8px',
            cursor: 'pointer', userSelect: 'none', padding: '2px 0'
        });
        basketStatus.onmouseover = () => basketStatus.style.color = '#fff';
        basketStatus.onmouseout = () => {
             getBasket(b => {
                 if(b.length === 0) basketStatus.style.color = '#aaa';
                 else basketStatus.style.color = '#4CAF50';
             });
        };
        basketStatus.onclick = toggleBasketPreview;

        const basketBtnRow = document.createElement('div');
        basketBtnRow.style.display = 'flex';
        basketBtnRow.style.gap = '6px';

        btnAddBasket = createBtn('btn_add_basket', '#E65100', handleAddToBasket);
        btnPasteBasket = createBtn('btn_paste_basket', '#1565C0', handlePasteBasket);
        
        btnClearBasket = document.createElement('button');
        btnClearBasket.innerText = '🗑️';
        btnClearBasket.title = t.btn_clear_basket;
        Object.assign(btnClearBasket.style, {
            background: '#444', color: '#fff', border: 'none', borderRadius: '6px',
            cursor: 'pointer', padding: '0 10px', fontSize: '14px'
        });
        btnClearBasket.onclick = handleClearBasket;

        basketBtnRow.append(btnAddBasket, btnPasteBasket, btnClearBasket);

        // Preview List Container
        basketPreviewList = document.createElement('div');
        Object.assign(basketPreviewList.style, {
            marginTop: '8px', borderTop: '1px solid #444', paddingTop: '4px',
            maxHeight: '150px', overflowY: 'auto', display: 'none' 
        });

        basketContainer.append(basketHeader, basketStatus, basketBtnRow, basketPreviewList);

        transferLabel = document.createElement('div');
        transferLabel.innerText = t.label_transfer;
        Object.assign(transferLabel.style, { fontSize: '12px', color: '#ccc', marginBottom: '6px', fontWeight: 'bold' });

        transferContainer = document.createElement('div');
        Object.assign(transferContainer.style, { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '8px' });

        PLATFORMS.forEach(p => {
            const btn = document.createElement('button');
            btn.innerHTML = `${p.icon} <br/> ${p.name}`;
            btn.title = `Transfer to ${p.name}`;
            Object.assign(btn.style, {
                background: '#333', border: '1px solid #555', color: '#fff',
                padding: '6px 2px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
            });
            btn.onmouseover = () => btn.style.borderColor = '#1565C0';
            btn.onmouseout = () => btn.style.borderColor = '#555';
            btn.onclick = () => handleCrossTransfer(p.url);
            transferContainer.appendChild(btn);
        });

        const hr = document.createElement('hr');
        Object.assign(hr.style, { border: '0', borderTop: '1px solid #333', margin: '8px 0', width: '100%' });

        btnScan = createBtn('btn_scan', '#444', function () {
            performScan();
            this.innerText = LANG_DATA[window.ccManager.lang].btn_scan_done;
            setTimeout(() => this.innerText = LANG_DATA[window.ccManager.lang].btn_scan, 1000);
        });
        btnScan.style.border = '1px solid #666';

        panel.append(header, msg, prefixLabel, prefixInput, selectionRow, actionRow, basketContainer, transferLabel, transferContainer, hr, btnScan);
        document.body.appendChild(panel);
    }

    /* =========================================
       5. Logic & Utilities
    ========================================= */
    function flashInput(el) {
        el.style.transition = 'background 0.2s';
        el.style.background = '#555';
        setTimeout(() => el.style.background = '#333', 200);
    }

    function updateUITexts() {
        const curLang = window.ccManager.lang;
        const t = LANG_DATA[curLang];

        if (title) title.innerText = t.title;

        if (msg) {
            if (!msg.innerText.includes('Selected') && !msg.innerText.includes('選取')) {
                msg.innerText = t.status_ready;
            }
            const selectedCount = document.querySelectorAll('.cc-btn[data-selected="true"]').length;
            if (selectedCount > 0) msg.innerText = t.msg_selected.replace('{n}', selectedCount);
        }

        if (prefixLabel) prefixLabel.innerText = t.label_prefix;
        if (prefixInput) prefixInput.placeholder = t.placeholder;
        if (btnSelectAll) btnSelectAll.innerText = t.btn_select_all;
        if (btnUnselectAll) btnUnselectAll.innerText = t.btn_unselect_all;
        if (btnDl) btnDl.innerText = t.btn_dl;
        if (btnCopy) btnCopy.innerText = t.btn_copy;
        
        if (basketLabel) basketLabel.innerText = t.label_basket;
        if (btnAddBasket) btnAddBasket.innerText = t.btn_add_basket;
        if (btnPasteBasket) btnPasteBasket.innerText = t.btn_paste_basket;
        if (btnClearBasket) btnClearBasket.title = t.btn_clear_basket;
        
        updateBasketUI();

        if (transferLabel) transferLabel.innerText = t.label_transfer;
        if (btnScan) btnScan.innerText = t.btn_scan;

        document.querySelectorAll('.cc-btn').forEach(b => {
            if (b.innerText === '➕') b.title = t.btn_add_title;
        });
    }

    function performScan() {
        if (!window.ccManager.active) return;

        const els = document.querySelectorAll(config.msgSelector);
        let count = 0;
        const curLang = window.ccManager.lang;
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
                position: 'absolute', top: '8px', left: '6px', zIndex: '9999',
                background: '#fff', color: '#333', border: '1px solid #999',
                fontWeight: '900', padding: '0', fontSize: '14px', cursor: 'pointer',
                borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'
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
                
                const allBtns = Array.from(document.querySelectorAll('.cc-btn'));
                const currentIndex = allBtns.indexOf(this);
                const lastIndex = window.ccManager.lastCheckedIndex;

                if (e.shiftKey && lastIndex !== null && lastIndex !== -1) {
                    const start = Math.min(currentIndex, lastIndex);
                    const end = Math.max(currentIndex, lastIndex);
                    const shouldSelect = (this.dataset.selected !== 'true');

                    for (let i = start; i <= end; i++) {
                        if (shouldSelect) selectBtn(allBtns[i]);
                        else unselectBtn(allBtns[i]);
                    }
                } else {
                    if (this.dataset.selected !== 'true') selectBtn(this);
                    else unselectBtn(this);
                }

                window.ccManager.lastCheckedIndex = currentIndex;
                updateStatus();
            };

            el.appendChild(btn);
            count++;
        });

        const total = document.querySelectorAll('.cc-btn').length;
        if ((count > 0 || total > 0) && msg) {
            msg.innerText = t.msg_detected.replace('{n}', total);
        }
    }

    function selectBtn(btn) {
        if (!btn || btn.dataset.selected === 'true') return;
        const el = btn.parentElement;
        btn.innerText = '✓';
        btn.style.background = '#4CAF50';
        btn.style.color = '#fff';
        btn.style.borderColor = '#4CAF50';
        btn.dataset.selected = 'true';
        el.dataset.ccSelected = 'true';
        el.style.outline = '2px solid #4CAF50';
        el.style.outlineOffset = '-2px';
        if (!el.dataset.originalBg) el.dataset.originalBg = el.style.backgroundColor;
        el.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    }

    function unselectBtn(btn) {
        if (!btn || btn.dataset.selected !== 'true') return;
        const el = btn.parentElement;
        btn.innerText = '➕';
        btn.style.background = '#fff';
        btn.style.color = '#333';
        btn.style.borderColor = '#999';
        delete btn.dataset.selected;
        delete el.dataset.ccSelected;
        el.style.outline = 'none';
        el.style.backgroundColor = el.dataset.originalBg || '';
    }

    function updateStatus() {
        if (!msg) return;
        const curLang = window.ccManager.lang;
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

    function handleDownload() {
        const curLang = window.ccManager.lang;
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
    }

    function handleCopyOnly() {
        const curLang = window.ccManager.lang;
        const t = LANG_DATA[curLang];
        const text = getSelectedText();
        if (!text) { alert(t.alert_no_selection); return; }
        navigator.clipboard.writeText(text).then(() => {
            alert(t.alert_copy_done);
        }).catch(err => alert(t.alert_fail));
    }

    /* =========================================
       Basket & Cross-Transfer Logic
    ========================================= */
    function getBasket(cb) {
        chrome.storage.local.get(['cc_basket'], (result) => {
            const basket = result.cc_basket || [];
            cb(basket);
        });
    }

    function updateBasketUI() {
        if (!basketStatus) return;
        getBasket((basket) => {
            const count = basket.length;
            const t = LANG_DATA[window.ccManager.lang];
            
            if (count === 0) {
                basketStatus.innerText = t.basket_status_empty;
                basketStatus.style.color = '#aaa';
                if(basketPreviewList) basketPreviewList.style.display = 'none';
                window.ccManager.isPreviewOpen = false;
            } else {
                basketStatus.innerText = t.basket_status.replace('{n}', count);
                basketStatus.style.color = '#4CAF50';
                
                if (window.ccManager.isPreviewOpen) {
                    renderBasketPreview(basket);
                }
            }
        });
    }

    function toggleBasketPreview() {
        if (!basketPreviewList) return;
        const isHidden = basketPreviewList.style.display === 'none';
        
        getBasket((basket) => {
            if (basket.length === 0) return;

            if (isHidden) {
                basketPreviewList.style.display = 'block';
                window.ccManager.isPreviewOpen = true;
                renderBasketPreview(basket);
            } else {
                basketPreviewList.style.display = 'none';
                window.ccManager.isPreviewOpen = false;
            }
        });
    }

    function renderBasketPreview(basket) {
        basketPreviewList.innerHTML = '';
        const t = LANG_DATA[window.ccManager.lang];
        const currentPrefix = document.getElementById('cc-prefix-input').value;

        // Hint text
        const hint = document.createElement('div');
        hint.innerText = t.preview_drag_hint;
        hint.style.fontSize = '10px';
        hint.style.color = '#666';
        hint.style.textAlign = 'right';
        hint.style.marginBottom = '4px';
        basketPreviewList.append(hint);

        basket.forEach((item, index) => {
            const row = document.createElement('div');
            
            // Enable Drag
            row.draggable = true;
            row.dataset.index = index;

            Object.assign(row.style, {
                background: '#383838', padding: '6px', marginBottom: '4px',
                borderRadius: '4px', fontSize: '11px', display: 'flex', 
                justifyContent: 'space-between', alignItems: 'center',
                cursor: 'grab', border: '1px solid transparent', transition: 'all 0.2s',
                position: 'relative'
            });

            // [New] Tooltip Events
            row.onmouseenter = (e) => {
                if(!tooltip) return;
                
                // Prepare clean full text for tooltip
                let fullClean = item.text;
                if (currentPrefix && fullClean.startsWith(currentPrefix)) {
                    fullClean = fullClean.replace(currentPrefix, '');
                }
                fullClean = fullClean
                    .replace(/={5,}/g, '') 
                    .replace(/--- Fragment ---/g, '') 
                    .replace(/\[END OF CONTEXT\]/g, '')
                    .trim();
                
                // Truncate for tooltip if excessively long (e.g. > 500 chars)
                if (fullClean.length > 500) {
                    fullClean = fullClean.substring(0, 500) + "\n\n(......)";
                }

                tooltip.innerText = `[Source: ${item.source}]\n\n${fullClean}`;
                tooltip.style.display = 'block';
                
                // Position logic: Show on LEFT of mouse
                updateTooltipPosition(e);
            };

            row.onmousemove = (e) => {
                updateTooltipPosition(e);
            };

            row.onmouseleave = () => {
                if(tooltip) tooltip.style.display = 'none';
            };

            // Drag Events
            row.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', index);
                row.style.opacity = '0.5';
                if(tooltip) tooltip.style.display = 'none'; // Hide tooltip on drag
            };
            
            row.ondragend = (e) => {
                row.style.opacity = '1';
                document.querySelectorAll('#cc-panel [draggable="true"]').forEach(el => {
                    el.style.borderTop = '1px solid transparent';
                    el.style.borderBottom = '1px solid transparent';
                });
            };

            row.ondragover = (e) => { e.preventDefault(); };
            row.ondragenter = (e) => {
                e.preventDefault();
                row.style.border = '1px dashed #4CAF50';
            };
            row.ondragleave = (e) => {
                row.style.border = '1px solid transparent';
            };
            row.ondrop = (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = index;
                if (fromIndex !== toIndex) {
                    handleReorderBasket(fromIndex, toIndex);
                }
            };

            // Snippet Generation (for list view)
            let cleanText = item.text;
            if (currentPrefix && cleanText.startsWith(currentPrefix)) {
                cleanText = cleanText.replace(currentPrefix, '');
            }
            cleanText = cleanText.replace(/={5,}/g, '').replace(/--- Fragment ---/g, '').replace(/\[END OF CONTEXT\]/g, '').trim();
            let snippet = cleanText.substring(0, 60).replace(/[\r\n]+/g, ' ');
            if (cleanText.length > 60) snippet += '...';
            if (snippet.length === 0) snippet = "(System Prompt Only)";

            const info = document.createElement('div');
            info.style.overflow = 'hidden';
            info.style.pointerEvents = 'none'; 
            info.innerHTML = `
                <span style="color:#aaa; font-size:9px; font-weight:bold;">${index + 1}. [${item.source}]</span><br/>
                <span style="color:#ddd; opacity:0.9;">${snippet}</span>
            `;

            const delBtn = document.createElement('button');
            delBtn.innerText = '×';
            delBtn.title = t.preview_del_tooltip;
            Object.assign(delBtn.style, {
                background: 'transparent', border: 'none', color: '#ff5252',
                fontWeight: 'bold', cursor: 'pointer', marginLeft: '8px', fontSize: '14px',
                minWidth: '20px'
            });
            delBtn.onclick = (e) => {
                e.stopPropagation(); 
                handleDeleteSingleItem(index);
            };

            row.append(info, delBtn);
            basketPreviewList.append(row);
        });
    }

    function updateTooltipPosition(e) {
        if (!tooltip) return;
        // Position to the left of the cursor by approx tooltip width (300px) + offset
        const x = e.clientX - 315; 
        const y = e.clientY + 10;
        
        // Simple boundary check: if it goes off-screen left, flip to right
        if (x < 10) {
            tooltip.style.left = (e.clientX + 15) + 'px';
        } else {
            tooltip.style.left = x + 'px';
        }
        
        // Check bottom boundary
        if (y + tooltip.offsetHeight > window.innerHeight) {
            tooltip.style.top = (window.innerHeight - tooltip.offsetHeight - 10) + 'px';
        } else {
            tooltip.style.top = y + 'px';
        }
    }

    function handleReorderBasket(fromIndex, toIndex) {
        getBasket((basket) => {
            const [movedItem] = basket.splice(fromIndex, 1);
            basket.splice(toIndex, 0, movedItem);
            chrome.storage.local.set({ 'cc_basket': basket }, () => {
                updateBasketUI();
            });
        });
    }

    function handleDeleteSingleItem(index) {
        getBasket((basket) => {
            basket.splice(index, 1);
            chrome.storage.local.set({ 'cc_basket': basket }, () => {
                updateBasketUI();
            });
        });
    }

    function handleAddToBasket() {
        const text = getSelectedText();
        const t = LANG_DATA[window.ccManager.lang];
        if (!text) { alert(t.alert_no_selection); return; }

        getBasket((basket) => {
            basket.push({
                text: text,
                timestamp: Date.now(),
                source: window.location.hostname
            });
            chrome.storage.local.set({ 'cc_basket': basket }, () => {
                showToast(t.toast_basket_add);
                handleUnselectAll(); 
            });
        });
    }

    function handleClearBasket() {
        chrome.storage.local.remove('cc_basket', () => {
            const t = LANG_DATA[window.ccManager.lang];
            showToast(t.toast_basket_clear);
            updateBasketUI();
        });
    }

    function handlePasteBasket() {
        getBasket((basket) => {
            const t = LANG_DATA[window.ccManager.lang];
            if (basket.length === 0) {
                alert("Basket is empty!");
                return;
            }
            
            const combinedText = basket.map((item, idx) => 
                `[Part ${idx + 1} from ${item.source}]\n${item.text}`
            ).join("\n\n");

            const inputEl = document.querySelector(config.inputSelector);
            if (inputEl) {
                autoFillInput(inputEl, combinedText);
                showToast(t.toast_autofill);
            } else {
                alert("Cannot find input box.");
            }
        });
    }

    function handleCrossTransfer(targetUrl) {
        const curLang = window.ccManager.lang;
        const t = LANG_DATA[curLang];
        
        getBasket((basket) => {
            let textToTransfer = null;

            if (basket.length > 0) {
                textToTransfer = basket.map((item, idx) => 
                    `[Part ${idx + 1} from ${item.source}]\n${item.text}`
                ).join("\n\n");
            } else {
                textToTransfer = getSelectedText();
            }

            if (!textToTransfer) { 
                alert(t.alert_no_selection); 
                return; 
            }

            chrome.storage.local.set({
                'cc_transfer_payload': {
                    text: textToTransfer,
                    timestamp: Date.now(),
                    source: window.location.hostname
                }
            }, () => {
                window.open(targetUrl, '_blank');
            });
        });
    }

    function handleSelectAll() {
        const btns = document.querySelectorAll('.cc-btn');
        let changed = false;

        btns.forEach(btn => {
            if (btn.dataset.selected !== 'true') {
                btn.click();
                changed = true;
            }
        });

        if (changed) updateStatus();
    }

    function handleUnselectAll() {
        const btns = document.querySelectorAll('.cc-btn');
        let changed = false;

        btns.forEach(btn => {
            if (btn.dataset.selected === 'true') {
                btn.click();
                changed = true;
            }
        });

        if (changed) updateStatus();
        window.ccManager.lastCheckedIndex = null;
    }

    /* =========================================
       6. Receiver Logic (Auto-Fill) & Listeners
    ========================================= */
    function checkAutoFill() {
        if (!chrome.storage) return;

        chrome.storage.local.get(['cc_transfer_payload'], (result) => {
            const data = result.cc_transfer_payload;
            if (data && (Date.now() - data.timestamp < 30000)) {

                console.log("Context-Carry: Found transfer data from " + data.source);
                let attempts = 0;
                const maxAttempts = 20;

                const fillInterval = setInterval(() => {
                    const inputEl = document.querySelector(config.inputSelector);
                    if (inputEl) {
                        clearInterval(fillInterval);
                        autoFillInput(inputEl, data.text);
                        chrome.storage.local.remove('cc_transfer_payload');
                        showToast(LANG_DATA[window.ccManager.lang].toast_autofill);
                    } else {
                        attempts++;
                        if (attempts >= maxAttempts) {
                            clearInterval(fillInterval);
                            console.log("Context-Carry: Timeout waiting for input box.");
                        }
                    }
                }, 500);
            }
        });
    }

    function autoFillInput(element, text) {
        element.focus();
        if (element.contentEditable === "true") {
            element.textContent = text;
        } else {
            element.value = text;
        }

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        const originalBg = element.style.backgroundColor;
        element.style.transition = "background-color 0.5s";
        element.style.backgroundColor = "rgba(76, 175, 80, 0.2)";
        setTimeout(() => {
            element.style.backgroundColor = originalBg;
        }, 1000);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.innerText = message;
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            background: '#333', color: '#fff', padding: '10px 20px', borderRadius: '20px',
            zIndex: '2147483647', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', fontSize: '14px',
            opacity: '0', transition: 'opacity 0.3s'
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.style.opacity = '1');
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.cc_basket) {
            updateBasketUI();
        }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "TOGGLE_INTERFACE") {
            toggleInterface();
        }
    });

    checkAutoFill();

})();