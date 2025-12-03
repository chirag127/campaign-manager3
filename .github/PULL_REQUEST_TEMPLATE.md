# Pull Request Template

## PR Checklist

Please ensure the following criteria are met before submitting your pull request:

*   [ ] **Code Quality:** The code adheres to the established coding standards and best practices for React Native, Node.js, and JavaScript.
*   [ ] **Testing:** All new and modified code is covered by comprehensive unit and integration tests.
*   [ ] **Linting & Formatting:** The code passes all lints and formatting checks using the project's defined tools (e.g., ESLint, Prettier, or Biome if adopted).
*   [ ] **Documentation:** Relevant code changes have been documented (e.g., inline comments, README updates if necessary).
*   [ ] **Branching Strategy:** The branch is up-to-date with the main branch and there are no merge conflicts.
*   [ ] **AI Agent Compliance:** The changes align with the directives specified in `AGENTS.md`, particularly regarding architectural patterns and security.
*   [ ] **User Experience:** The changes enhance or maintain a positive user experience across supported platforms.

## Description

Provide a clear and concise description of the changes introduced in this pull request. Explain the problem being solved, the approach taken, and any potential impacts.

## Related Issues

Link any relevant issues here (e.g., `Fixes #123`, `Closes #456`).

## Changes Made

*   [List of key changes]
*   [New features]
*   [Bug fixes]
*   [Refactorings]

## How to Test

Provide step-by-step instructions on how to test the changes introduced in this pull request. Include any necessary setup or specific scenarios.

## Screenshots/Recordings (if applicable)

Add screenshots or screen recordings to visually demonstrate the changes, especially for UI modifications.

---
## AI AGENT DIRECTIVES RECAP

This PR is expected to align with the following core principles and technical directives:

*   **Apex Identity:** Adherence to the **APEX TECHNICAL AUTHORITY & ELITE ARCHITECT** standards.
*   **Prime Directive:** Maintain **Zero-Defect, High-Velocity, Future-Proof** development.
*   **Context:** Operating under **December 2025 / 2026 Standards**.

### Project-Specific Stack & Architecture (AdSynk - React Native / Node.js)

*   **Platform:** Cross-Platform Mobile Application.
*   **Frontend Stack:** React Native (Expo) with TypeScript.
*   **Backend Stack:** Node.js.
*   **Data Storage:** MongoDB.
*   **Architecture:** Modular Monolith with a focus on clear API integrations and dashboard presentation. Adherence to principles like **SOLID, DRY, YAGNI** is paramount.

### Testing & Verification Strategy

*   **Unit Testing:** Comprehensive unit tests for both React Native components and Node.js backend logic, preferably using **Vitest** and **Jest**.
*   **Integration Testing:** End-to-end integration tests to validate API interactions and data flow between frontend and backend.
*   **E2E Testing:** Utilize **Playwright** for end-to-end validation of the user experience across platforms.

### Security Mandate

*   **Input Validation:** Rigorous validation of all user inputs and API payloads.
*   **Dependency Scanning:** Regular scans for vulnerabilities in project dependencies.
*   **Secure API Integrations:** Ensure all external API calls are authenticated and secured.

---
**Repository:** `https://github.com/chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App`
