# Changelog

All notable changes to this project will be documented in this file.

------------------------------------------------------------------------

## [1.3] - 2025-12-10

### Added
- **Context Basket (Staging Area):** Introduced a cross-window "Basket" system. Users can now collect conversation fragments from multiple tabs/windows and aggregate them into a single transfer.
- **Draggable Interface:** The control panel is now draggable via the header, preventing it from blocking underlying page content.
- **Range Selection:** Added **Shift + Click** functionality to select a continuous range of messages instantly.
- **Basket Management:**
  - **Preview List:** Added a collapsible preview area to manage items in the basket.
  - **Drag-and-Drop Sorting:** Users can reorder basket items by dragging them in the preview list.
  - **Smart Tooltips:** Added floating tooltips to preview the full content of basket items on hover.

### Changed
- **UI UX:** Updated the main panel layout to include the new **Context Basket** section.
- **Privacy:** Implemented auto-cleanup logic to clear basket data on browser startup for better security.

------------------------------------------------------------------------

## [1.2] - 2025-12-09

### Added
- **Bulk Selection:** Added **"Select All"** and **"Unselect All"** buttons to the control panel, allowing users to quickly select or deselect all detected messages.
- **Localization:** Updated language files to support Chinese/English switching for the new selection buttons.

### Changed
- **UI Layout:** Refactored the control panel layout to insert the selection toolbar above the action buttons.
- **Code Refactoring:** Optimized `createBtn` function in `content.js` for better reusability across UI components.

------------------------------------------------------------------------

## [1.1] - 2025-12-09

### Added
- **Cross-LLM Auto-Fill:** Implemented one-click context transfer. The extension now automatically opens the target AI platform and pastes the selected text.
- **Platform Buttons:** Added direct transfer icons for ChatGPT, Claude, Gemini, and Grok in the UI.
- **Auto-Injection:** Content scripts now load automatically to support the auto-fill receiver logic.

### Changed
- **Permissions:** Added `storage` permission to `manifest.json` to handle temporary data passing between tabs.
- **UI UX:** Replaced the single "Transfer" button with platform-specific options for better workflow.
- **Privacy Policy:** Updated to reflect the usage of local storage for temporary transfer data.

------------------------------------------------------------------------

## [1.0] - 2025-12-08

### Added
- Added Chrome Web Store compliance updates.
- Added legal disclaimer for all third-party AI platforms.
- Added **GitHub Issues** link as the primary contact channel in Privacy Policy.
- Added optimized extension icons with **transparent backgrounds** (16px, 32px, 48px, 128px).

### Changed
- Refactored documentation: **Split README into separate English and Traditional Chinese files** for better readability.
- Updated extension scanning mechanism to use `MutationObserver` instead of fixed polling interval.
- Updated version alignment across `manifest.json`, `package.json`, and documentation.
- Restricted host permissions to only required AI platforms.
- Improved UI injection stability across supported platforms.

### Security & Privacy
- **Updated Privacy Policy:** Clarified usage of local storage (`chrome.storage`) for user preferences and confirmed zero remote data collection.
- Enforced minimum permission policy for Chrome Web Store review.

### Documentation
- Improved installation and usage instructions with clearer steps.
- Added formal contribution guidelines.

------------------------------------------------------------------------

## \[0.0\] - Initial Release

-   Initial release with support for:
    -   ChatGPT
    -   Claude
    -   Gemini
    -   Grok
-   Message selection and context transfer.
-   Clipboard copy and TXT export.
-   Fully client-side privacy design.
