# AdSynk: Cross-Platform Ad Campaign Manager

<!-- HERO BANNER: Placeholder for a professional product banner or logo -->
<p align="center">
  <img src="" alt="AdSynk Hero Banner">
</p>

<p align="center">
    <a href="https://github.com/chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App/ci.yml?style=flat-square&logo=github&label=Build" alt="Build Status"></a>
    <a href="https://codecov.io/gh/chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App"><img src="https://img.shields.io/codecov/c/github/chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App?style=flat-square&logo=codecov&label=Coverage" alt="Code Coverage"></a>
    <a href="https://biomejs.dev/"><img src="https://img.shields.io/badge/Lint%20&%20Format-Biome-60A5FA?style=flat-square&logo=biome" alt="Linting & Formatting: Biome"></a>
    <a href="https://github.com/chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg?style=flat-square" alt="License"></a>
    <a href="https://github.com/chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App/stargazers"><img src="https://img.shields.io/github/stars/chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App?style=flat-square&logo=github" alt="GitHub Stars"></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/React%20Native-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React Native">
    <img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo">
    <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
</p>

<p align="center">
  <a href="https://github.com/chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App/stargazers"><strong>Star ⭐ this Repo</strong></a> if you find it useful!
</p>

##

AdSynk is a cross-platform ad campaign management application designed to unify analytics from Facebook, Google, and LinkedIn. It provides marketing professionals with a consolidated, real-time dashboard for making swift, data-driven decisions directly from their mobile devices.


## Table of Contents

- [Key Features](#key-features)
- [Architecture](#architecture)
- [AI Agent Directives](#-ai-agent-directives)
- [Development Standards](#development-standards)
- [Core Principles](#core-principles)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **Unified Dashboard**: View aggregated performance metrics from multiple ad platforms in one interface.
- **Cross-Platform**: Built with React Native and Expo for a consistent experience on both iOS and Android.
- **Real-Time Analytics**: Leverages a Node.js backend to fetch and process campaign data on the fly.
- **Secure API Integration**: Safely connects to Facebook Marketing API, Google Ads API, and LinkedIn Marketing API.
- **Data Visualization**: Intuitive charts and graphs to track key metrics like CPC, CTR, and conversion rates.

## Architecture

The project is structured as a monorepo to manage the mobile client and backend server in a single, cohesive codebase.

sh
AdSynk-Cross-Platform-Ad-Campaign-Manager-App/
├── .github/              # CI/CD Workflows & Issue Templates
├── packages/
│   ├── mobile-app/       # React Native (Expo) Client
│   │   ├── src/
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── features/   # Feature-sliced modules (e.g., dashboard, campaigns)
│   │   │   ├── navigation/ # App navigation stack
│   │   │   └── services/   # API connectors
│   │   └── app.json
│   └── server/             # Node.js (Express) Backend
│       ├── src/
│       │   ├── api/        # API routes and controllers
│       │   ├── config/     # Environment configuration
│       │   ├── services/   # Business logic and third-party API integration
│       │   └── models/     # MongoDB data models
│       └── server.js
├── .gitignore
├── LICENSE
├── package.json          # Root package for monorepo workspace management
└── README.md


## 🤖 AI Agent Directives

<details>
<summary><strong>Click to expand:</strong> Apex Technical Authority Instructions (December 2025 Standard)</summary>

### 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards.
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

### 2. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
This repository, `AdSynk-Cross-Platform-Ad-Campaign-Manager-App`, is a cross-platform mobile application and backend service. Adherence to the following stack and architectural patterns is mandatory.

*   **PRIMARY SCENARIO: CROSS-PLATFORM MOBILE & API (TypeScript)**
    *   **Stack:** This project is a **TypeScript-first monorepo**. 
        *   **Frontend:** **React Native** with **Expo SDK 52+**. State management must use a modern, signal-based library or React Query for server state.
        *   **Backend:** **Node.js 22+** with **Express.js** or a high-performance successor like **Fastify**. Database interaction is handled via **Mongoose** for MongoDB.
        *   **Code Quality:** **Biome** is the unified tool for linting and formatting across the entire monorepo. Type safety must be enforced with `"strict": true` in all `tsconfig.json` files.
    *   **Architecture:** 
        *   **Monorepo:** Managed with `npm` or `yarn` workspaces.
        *   **Client-Server Model:** The `mobile-app` is a pure client that communicates with the `server` via a versioned RESTful API.
        *   **Frontend Architecture:** Adhere to **Feature-Sliced Design (FSD)** principles for scalability and maintainability.
        *   **Backend Architecture:** Implement a **Layered Architecture** (Controllers, Services, Repositories/Data Access Layer) to ensure separation of concerns.
    *   **Testing Protocol:**
        *   **Unit/Component:** **Jest** with **React Native Testing Library** for the mobile app; Jest for the backend services.
        *   **End-to-End (E2E):** **Detox** for mobile E2E testing to simulate real user interactions.
        *   **API Testing:** **Supertest** for testing the Node.js API endpoints.
        *   **Coverage:** Maintain a minimum of **85%** code coverage, enforced by the CI pipeline.

### 3. VERIFICATION & DEPLOYMENT
*   **Local Verification:** Run `npm run lint` and `npm test` from the root directory to validate changes before committing.
*   **CI/CD Pipeline:** The `.github/workflows/ci.yml` pipeline automates linting, testing, and build validation for both `mobile-app` and `server` packages on every push and pull request.

</details>

## Development Standards

### Prerequisites

- Node.js (v20+)
- npm (v10+) or Yarn
- Expo CLI
- A running MongoDB instance (local or cloud)
- Git

### Setup & Installation

1.  **Clone the repository:**
    sh
    git clone https://github.com/chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App.git
    cd AdSynk-Cross-Platform-Ad-Campaign-Manager-App
    

2.  **Install dependencies** from the root directory. This will install dependencies for both the `server` and `mobile-app` workspaces.
    sh
    npm install
    

3.  **Configure environment variables:**
    - Create a `.env` file in `packages/server` based on `.env.example`.
    - Populate it with your MongoDB connection string and API keys for Facebook, Google, and LinkedIn.

### Available Scripts

| Command               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `npm install`         | Installs all monorepo dependencies.                   |
| `npm run dev:server`  | Starts the Node.js backend server with hot-reloading. |
| `npm run dev:mobile`  | Starts the Expo development server for the mobile app.|
| `npm run lint`        | Lints and formats the entire codebase using Biome.    |
| `npm run test`        | Runs all unit and integration tests across the repo.  |
| `npm run build:mobile`| Creates a production build of the mobile app.         |

## Core Principles

- **SOLID**: Follows SOLID principles for robust and maintainable object-oriented design, especially in the backend services.
- **DRY (Don't Repeat Yourself)**: Promotes reusable code through shared components, utility functions, and service layers.
- **YAGNI (You Ain't Gonna Need It)**: Avoids over-engineering by implementing only necessary features.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](.github/CONTRIBUTING.md) file for guidelines on how to submit pull requests, report issues, and suggest enhancements.

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License** - see the [LICENSE](LICENSE) file for details.
