# AdSynk-Unified-Campaign-Management-React-Native-App

[![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App/ci.yml?style=flat-square)](https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App/actions/workflows/ci.yml)
[![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App?style=flat-square)](https://app.codecov.io/github/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App)
[![Tech Stack](https://img.shields.io/badge/stack-React%20Native%2C%20Node.js%2C%20MongoDB-blue?style=flat-square)](https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App)
[![Lint/Format](https://img.shields.io/badge/linter-Biome-informational?style=flat-square)](https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App)
[![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-orange?style=flat-square)](https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App)
[![GitHub Stars](https://img.shields.io/github/stars/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App?style=flat-square)](https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App)

<p align="center">
  <h1 align="center">AdSynk: Unified Campaign Management</h1>
  <p align="center">
    A full-stack, cross-platform ad campaign management app with React Native and Node.js.
    <br />
    Unify Facebook, Google, and LinkedIn ad analytics into a single, powerful dashboard.
  </p>
</p>

<p align="center">
  <a href="#">
    <strong>Demo</strong>
  </a>
  ·
  <a href="#">
    <strong>Report Bug</strong>
  </a>
  ·
  <a href="#">
    <strong>Request Feature</strong>
  </a>
</p>

**AdSynk is a sophisticated, cross-platform mobile application designed to streamline ad campaign management by consolidating analytics and performance data from major advertising platforms into a single, intuitive interface.**

This project leverages React Native for a unified mobile experience and Node.js with Express for a robust backend, all powered by MongoDB for data persistence.

## 🚀 Architecture Overview

mermaid
graph TD
    A[Mobile App (React Native)] --> B(API Gateway / Backend - Node.js/Express)
    B --> C{Database - MongoDB}
    B --> D[External APIs - Facebook Ads, Google Ads, LinkedIn Ads]
    D --> B
    C --> B
    B --> A


## 🧭 Table of Contents

*   [Architecture Overview](#-architecture-overview)
*   [Table of Contents](#-table-of-contents)
*   [⚡ AI Agent Directives](#-ai-agent-directives)
*   [🛠️ Development & Setup](#-development--setup)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Running the App](#running-the-app)
    *   [Key Scripts](#key-scripts)
*   [💡 Development Principles](#-development-principles)
*   [🤝 Contributing](#-contributing)
*   [📄 License](#-license)

## ⚡ AI Agent Directives

<details>
<summary>Show AI Agent Directives</summary>

# SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (DECEMBER 2025 EDITION)

## 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

---

## 2. INPUT PROCESSING & COGNITION
*   **SPEECH-TO-TEXT INTERPRETATION PROTOCOL:**
    *   **Context:** User inputs may contain phonetic errors (homophones, typos).
    *   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. You must **INFER** technical intent based on the project context.
    *   **Logic Anchor:** Treat the `README.md` as the **Single Source of Truth (SSOT)**.
*   **MANDATORY MCP INSTRUMENTATION:**
    *   **No Guessing:** Do not hallucinate APIs.
    *   **Research First:** Use `linkup`/`brave` to search for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
    *   **Validation:** Use `docfork` to verify *every* external API signature.
    *   **Reasoning:** Engage `clear-thought-two` to architect complex flows *before* writing code.

---

## 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** Detect the project type and apply the **Apex Toolchain**.

*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript)**
    *   **Stack:** TypeScript 6.x (Strict), Vite 7 (Rolldown), Tauri v2.x (Native), WXT (Extensions).
    *   **State:** Signals (Standardized).
    *   **Lint/Test:** Biome (Speed) + Vitest (Unit) + Playwright (E2E).
    *   **Architecture:** Feature-Sliced Design (FSD).

*   **SECONDARY SCENARIO B: SYSTEMS / PERFORMANCE (Rust/Go) - *Not applicable for this project.***
    *   **Stack:** Rust (Cargo) or Go (Modules).
    *   **Lint:** Clippy / GolangCI-Lint.
    *   **Architecture:** Hexagonal Architecture (Ports & Adapters).

*   **TERTIARY SCENARIO C: DATA / AI / SCRIPTS (Python) - *Not applicable for this project.***
    *   **Stack:** uv (Manager), Ruff (Linter), Pytest (Test).
    *   **Architecture:** Modular Monolith or Microservices.

--- 

## 4. PROJECT-SPECIFIC STACK ADAPTATION (AdSynk-Unified-Campaign-Management-React-Native-App)

*   **Language:** JavaScript (ESNext)
*   **Mobile Framework:** React Native (with Expo for streamlined development)
*   **Backend Framework:** Node.js with Express.js
*   **Database:** MongoDB
*   **State Management:** Context API / Zustand (TBD based on complexity)
*   **UI Component Library:** NativeBase / React Native Paper (TBD)
*   **Styling:** Styled-Components / Tailwind CSS (for React Native)
*   **Linting & Formatting:** Biome (configured for JavaScript/TypeScript/JSON/CSS)
*   **Testing:** 
    *   **Unit/Integration (Frontend):** Vitest with React Native Testing Library
    *   **E2E (Frontend):** Detox or Appium
    *   **Unit/Integration (Backend):** Jest
*   **API Communication:** Axios
*   **Deployment:** Managed services (e.g., AWS Amplify, Vercel for backend, EAS Build for Expo)

---

## 5. CORE DEVELOPMENT PRINCIPLES
*   **SOLID:** Ensure each module/component has a single responsibility.
*   **DRY (Don't Repeat Yourself):** Abstract common logic and UI elements.
*   **YAGNI (You Ain't Gonna Need It):** Build for current needs, avoid premature optimization or feature creep.
*   **KISS (Keep It Simple, Stupid):** Favor clarity and simplicity in design and implementation.
*   **Defensive Programming:** Implement robust error handling, input validation, and type checking.
*   **Security First:** Integrate security considerations from the outset (e.g., secure API key management, input sanitization, dependency vulnerability scanning).

---

## 6. OPERATIONAL DIRECTIVES
*   **Dependency Management:** Use `npm` or `yarn` consistently. Scan for vulnerabilities regularly (`npm audit`).
*   **CI/CD:** Maintain automated workflows for building, testing, and deploying.
*   **Documentation:** Keep `README.md`, `AGENTS.md`, and inline code comments up-to-date.
*   **Testing Strategy:** Aim for high code coverage (>85%) across unit, integration, and E2E tests.
*   **Code Reviews:** Mandatory for all pull requests, focusing on correctness, maintainability, and adherence to principles.

</details>

## 🛠️ Development & Setup

### Prerequisites

*   Node.js (v18 LTS or higher recommended)
*   npm or Yarn
*   Expo CLI (`npm install -g expo-cli`)
*   MongoDB (local installation or cloud instance)

### Installation

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App.git
    cd AdSynk-Unified-Campaign-Management-React-Native-App
    

2.  **Install backend dependencies:**
    bash
    cd backend
    npm install
    # Or using yarn:
    # yarn install
    

3.  **Install frontend dependencies:**
    bash
    cd ../frontend
    npm install
    # Or using yarn:
    # yarn install
    

### Running the App

1.  **Start the backend server:**
    *   Ensure your MongoDB instance is running and accessible.
    *   Configure environment variables (e.g., `.env` file) for database connection, API keys, etc.
    bash
    cd backend
    npm run dev
    # Or using yarn:
    # yarn dev
    

2.  **Start the frontend development server:**
    bash
    cd ../frontend
    npm start
    # Or using yarn:
    # yarn start
    

    This will launch the Expo Go app on your simulator/emulator or physical device.

### Key Scripts

**Backend (`backend/package.json`):**

| Script       | Description                                  |
| :----------- | :------------------------------------------- |
| `dev`        | Starts the backend server in development mode |
| `start`      | Starts the backend server for production      |
| `lint`       | Runs Biome linter                            |
| `format`     | Formats code with Biome                     |
| `test`       | Runs backend unit and integration tests     |

**Frontend (`frontend/package.json`):**

| Script       | Description                                  |
| :----------- | :------------------------------------------- |
| `start`      | Starts the Expo development server           |
| `android`    | Runs the app on an Android emulator/device   |
| `ios`        | Runs the app on an iOS simulator/device      |
| `lint`       | Runs Biome linter                            |
| `format`     | Formats code with Biome                     |
| `test`       | Runs frontend unit/integration tests        |
| `e2e`        | Runs end-to-end tests (e.g., Detox)         |

## 💡 Development Principles

*   **SOLID:** Ensuring modularity and maintainability.
*   **DRY:** Avoiding code duplication.
*   **YAGNI:** Focusing on current requirements.
*   **KISS:** Prioritizing simplicity and clarity.
*   **Defensive Programming:** Robust error handling and validation.
*   **Security First:** Integrating security best practices throughout the development lifecycle.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  **Fork the Project:** Create a fork of this repository.
2.  **Clone your fork:** `git clone https://github.com/YOUR_USERNAME/AdSynk-Unified-Campaign-Management-React-Native-App.git`
3.  **Create a Feature Branch:** `git checkout -b feature/YourAmazingFeature`
4.  **Commit your Changes:** `git commit -m 'Add some AmazingFeature'`
5.  **Push to the Branch:** `git push origin feature/YourAmazingFeature`
6.  **Open a Pull Request:** Submit a PR to the main repository.

Please adhere to the development principles outlined above and ensure all tests pass.

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license. See the [LICENSE](LICENSE) file for more details.

--- 
