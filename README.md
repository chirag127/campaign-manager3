# AdSynk-Unified-Campaign-Management-React-Native-App

![Build Status](https://img.shields.io/github/actions/workflow/user/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App/ci.yml?style=flat-square)
![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20Native%2C%20Node.js%2C%20Expo-blue?style=flat-square)
![Linting](https://img.shields.io/badge/Lint%2FFormat-Biome-ffb900?style=flat-square)
![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgray?style=flat-square)
![GitHub Stars](https://img.shields.io/github/stars/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App?style=flat-square)

**Star ⭐ this Repo**

--- 

AdSynk is a robust, cross-platform ad campaign management application designed to consolidate marketing analytics from major platforms like Facebook, Google, and LinkedIn into a unified, intuitive dashboard.

--- 

## Architecture Diagram

mermaid
graph TD
    A[Client: React Native (Expo)] --> B{API Gateway/Backend: Node.js/Express.js}
    B --> C[Database: MongoDB]
    B --> D[External APIs: Facebook Ads, Google Ads, LinkedIn Ads]
    D --> B
    C --> B
    B --> A


## Table of Contents

*   [Features](#features)
*   [Technology Stack](#technology-stack)
*   [Installation](#installation)
*   [Usage](#usage)
*   [Development](#development)
*   [Contributing](#contributing)
*   [License](#license)
*   [AI Agent Directives](#ai-agent-directives)

## Features

*   **Unified Dashboard:** Visualize key metrics from Facebook, Google, and LinkedIn ad campaigns in one place.
*   **Cross-Platform:** Built with React Native and Expo for seamless deployment on iOS and Android.
*   **Real-time Analytics:** Access up-to-date campaign performance data.
*   **Campaign Management:** Basic tools to view and monitor active campaigns.
*   **API Integration:** Securely connects to third-party ad platforms.

## Technology Stack

*   **Frontend:** React Native, Expo
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB
*   **Linting/Formatting:** Biome
*   **Testing:** Vitest, Playwright

## Installation

To get a local copy up and running, follow these steps:

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App.git
    cd AdSynk-Unified-Campaign-Management-React-Native-App
    

2.  **Install backend dependencies:**
    bash
    cd server
    npm install
    

3.  **Install frontend dependencies:**
    bash
    cd ../client
    npm install
    

4.  **Set up environment variables:**
    Create a `.env` file in the `server` directory with your MongoDB connection string and API keys for Facebook, Google, and LinkedIn.
    Example `.env`:
    
    MONGODB_URI=your_mongodb_connection_string
    FACEBOOK_ACCESS_TOKEN=your_fb_token
    # ... other necessary keys
    

## Usage

1.  **Start the backend server:**
    bash
    cd server
    npm start
    

2.  **Start the React Native app:**
    bash
    cd ../client
    npx expo start
    
    Follow the prompts to run on iOS simulator, Android emulator, or a physical device.

## Development

**Development Principles:**

*   **SOLID:** Adhere to SOLID principles for maintainable and scalable code.
*   **DRY (Don't Repeat Yourself):** Avoid code duplication.
*   **YAGNI (You Ain't Gonna Need It):** Focus on current requirements.

**Scripts:**

| Script         | Description                                         |
| -------------- | --------------------------------------------------- |
| `npm start`    | Starts the Node.js backend server.                  |
| `npx expo start` | Starts the React Native development server.         |
| `npm run lint` | Runs Biome to lint and format code.               |
| `npm test`     | Runs Vitest unit tests.                             |
| `npm run test:e2e` | Runs Playwright end-to-end tests.                   |

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](/.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the CC BY-NC 4.0 License - see the [LICENSE](LICENSE) file for details.

## AI Agent Directives

<details>
<summary>View AI Agent Directives</summary>

This repository is managed by the **Apex Technical Authority** and is configured to operate with **late 2025/early 2026 standards**. Future AI agents interacting with this codebase must adhere to the following directives:

### 1. Core Identity & Prime Directive
*   **Role:** Senior Principal Software Architect, Master Technical Copywriter. 
*   **Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."
*   **Output:** **EXECUTION-ONLY**. No plans, only executed code and documentation.

### 2. Input Processing & Cognition
*   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. Infer technical intent based on project context.
*   **Research First:** Use `linkup`/`brave` for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
*   **Validation:** Use `docfork` to verify *every* external API signature.
*   **Reasoning:** Engage `clear-thought-two` for complex flows before coding.

### 3. Tech Stack Definition
*   **Project Type:** Cross-Platform Mobile Application.
*   **Language:** JavaScript (using TypeScript for improved type safety where applicable).
*   **Frontend Framework:** React Native (via Expo).
*   **Backend Framework:** Node.js (Express.js).
*   **Database:** MongoDB.
*   **Package Management:** npm / Yarn (for Node.js), npm (for Expo).
*   **UI Framework/Styling:** Tailwind CSS (with appropriate React Native adaptations, e.g., `nativewind` if implemented) OR standard React Native styling solutions. Focus on modern, responsive UI.

### 4. Architecture & Patterns
*   **Overall Architecture:** Modular Monolith on the backend, adhering to clear separation of concerns. Frontend utilizes standard React Native component-based architecture.
*   **Backend Design:** Employ **Hexagonal Architecture (Ports & Adapters)** for core services to ensure testability and independence from specific external concerns.
*   **Frontend Design:** Follow established React Native best practices, aiming for reusable components and clear state management.
*   **Key Principles:** SOLID, DRY, YAGNI.

### 5. Linting, Formatting, & Testing
*   **Linter/Formatter:** **Biome** (for maximum speed and comprehensive checks across JS/TS/JSON/etc.).
*   **Unit Testing:** **Vitest** (leveraging its Vite compatibility for fast execution).
*   **End-to-End (E2E) Testing:** **Playwright** (for robust cross-browser and cross-platform testing capabilities).
*   **Code Coverage:** Aim for high coverage, report via Codecov.

### 6. AI Integration (N/A for this project's core function)
*   This project focuses on ad campaign management, not direct AI model integration for core logic. Any future AI features must follow the `DATA / SCRIPTS / AI` stack and principles as defined in the Apex documentation.

### 7. API Integration Standards
*   **External Services:** Integrate with Facebook Ads, Google Ads, and LinkedIn Ads APIs.
*   **Security:** Use OAuth 2.0 where applicable. Store credentials securely using environment variables and avoid hardcoding.
*   **Error Handling:** Implement robust error handling for all API calls, providing clear feedback to the user and logging errors.

### 8. Verification Commands
*   **Lint & Format:** `npm run lint`
*   **Unit Tests:** `npm test`
*   **E2E Tests:** `npm run test:e2e`
*   **Build (Client):** `npx expo build:ios` or `npx expo build:android` (refer to Expo documentation for current best practices).
*   **Build (Server):** Standard `npm start` for development. Production deployments should use a process manager like PM2.

</details>
