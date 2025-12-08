# Changelog

All notable changes to this project will be documented in this file.

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
