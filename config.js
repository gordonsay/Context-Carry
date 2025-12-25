(function () {
    window.CC_CONFIG = {
        PLATFORMS: [
            { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/?model=gpt-4o', icon: '🤖', limit: 100000 },
            { id: 'claude', name: 'Claude', url: 'https://claude.ai/new', icon: '🧠', limit: 180000 },
            { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app', icon: '💎', limit: 1000000 },
            { id: 'grok', name: 'Grok', url: 'https://grok.com', icon: '✖️', limit: 100000 }
        ],

        APP_CONFIG: {
            'chatgpt.com': {
                msgSelector: '[data-message-author-role="assistant"].text-message, .user-message-bubble-color',
                inputSelector: '#prompt-textarea',
                ignore: '.sr-only, button, .cb-buttons'
            },
            'gemini.google.com': {
                msgSelector: 'user-query, model-response',
                inputSelector: '.ql-editor, .text-input-field, div[role="textbox"], div[contenteditable="true"]',
                ignore: '.mat-icon, .action-button, .button-label, .botones-acciones'
            },
            'claude.ai': {
                msgSelector: '.font-user-message, .font-claude-response, div[data-testid="user-message"]',
                inputSelector: '.ProseMirror[contenteditable="true"]',
                ignore: 'button, .copy-icon, [data-testid="chat-message-actions"], .cursor-pointer, [role="button"], [aria-haspopup], .text-xs, [data-testid="model-selector-dropdown"]'
            },
            'grok': {
                msgSelector: '.message-bubble',
                inputSelector: 'div[role="textbox"], textarea, div[contenteditable="true"]',
                ignore: 'svg, span[role="button"], .action-buttons'
            }
        },

        MODEL_PRESETS: {
            'openai': [
                'gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4.1-mini',
                'gpt-4o', 'o1', 'gpt-4.1'
            ],

            'claude': [
                'claude-3-haiku', 'claude-3-sonnet', 'claude-3.5-haiku',
                'claude-3.5-sonnet', 'claude-3-opus', 'claude-3.5-opus'
            ],

            'gemini': [
                'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro',
                'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-pro',
            ],

            'grok': [
                'grok-2-mini', 'grok-2', 'grok-3-mini',
                'grok-3', 'grok-4', 'grok-4-fast'
            ],

            'ollama': [],

            'lm-studio': []
        }

    };

})();