# AdSynk: Unified Campaign Management (React Native App)

A full-stack, cross-platform advertising campaign management application designed to unify Facebook, Google, and LinkedIn ad analytics into a single, powerful dashboard.

## 🚀 Key Features

*   **Cross-Platform Compatibility:** Built with React Native and Expo for seamless deployment on iOS and Android.
*   **Unified Dashboard:** Consolidate key metrics from Facebook Ads, Google Ads, and LinkedIn Ads.
*   **Real-time Analytics:** Monitor campaign performance with up-to-date data.
*   **Campaign Management:** Create, edit, and manage ad campaigns across multiple platforms.
*   **Node.js Backend:** Robust API layer built with Express.js.
*   **MongoDB Database:** Flexible and scalable data storage.

## 🗺️ Architecture & Tech Stack

This project employs a modern full-stack architecture, prioritizing performance, scalability, and developer experience.

*   **Frontend:** React Native (Expo)
*   **Backend:** Node.js (Express.js)
*   **Database:** MongoDB
*   **State Management:** Context API / Redux (TBD)
*   **API Integration:** Facebook Marketing API, Google Ads API, LinkedIn Marketing API

mermaid
graph TD
    A[User (iOS/Android)] -- HTTP --> B(React Native App)
    B -- GraphQL/REST --> C(Node.js/Express API Gateway)
    C -- MongoDB Driver --> D(MongoDB Database)
    C -- API Calls --> E(Facebook Ads API)
    C -- API Calls --> F(Google Ads API)
    C -- API Calls --> G(LinkedIn Ads API)


## 💡 AI AGENT DIRECTIVES

<details>
<summary><b>🤖 APEX AI AGENT CONFIGURATION (v1.0)</b></summary>

This repository is configured to be managed by the Apex AI Technical Authority.

### **1. Core Philosophy:**
*   **Zero-Defect, High-Velocity, Future-Proof:** Uphold these principles in all development and maintenance tasks.
*   **Apex Standards:** Adhere strictly to the **December 2025 Edition** of Apex AI Agent Directives.

### **2. Technology Stack Definition:**
*   **Primary Language:** JavaScript (ES2023+)
*   **Frontend Framework:** React Native (Expo)
*   **Backend Framework:** Node.js (Express.js)
*   **Database:** MongoDB
*   **API Integrations:** Facebook Marketing API, Google Ads API, LinkedIn Marketing API
*   **Package Manager:** npm / yarn (consistent usage)
*   **Linting/Formatting:** ESLint, Prettier
*   **Testing Framework:** Jest (Unit/Integration), Detox (E2E for React Native)

### **3. Architectural Patterns:**
*   **Frontend:** Component-Based Architecture, Hooks, Context API/Redux.
*   **Backend:** RESTful API design, MVC/MVVM patterns, Microservices (if complexity warrants).
*   **General:** SOLID Principles, DRY (Don't Repeat Yourself), YAGNI (You Ain't Gonna Need It).

### **4. Development Workflow & Verification:**
*   **Version Control:** Git (GitHub)
*   **Branching Strategy:** Gitflow or GitHub Flow.
*   **CI/CD:** GitHub Actions (for automated builds, testing, and deployments).
*   **Code Quality Assurance:** Automated linting, formatting, and comprehensive test suites.

### **5. Verification Commands:**
*   **Install Dependencies:** `npm install` or `yarn install`
*   **Run Linter:** `npm run lint` or `yarn lint`
*   **Run Formatter:** `npm run format` or `yarn format`
*   **Run Unit Tests:** `npm test` or `yarn test`
*   **Run E2E Tests:** `npm run e2e` or `yarn e2e`
*   **Start Development Server (Backend):** `npm run dev:server` or `yarn dev:server`
*   **Start Development Server (Frontend):** `npm start` or `yarn start` (Expo CLI)

### **6. AI Model Integration Guidelines (If applicable):**
*   **Data Privacy:** Ensure strict adherence to data privacy regulations (GDPR, CCPA) when handling user data and ad platform information.
*   **API Key Management:** Use secure methods (e.g., environment variables, secret managers) for API keys and credentials.
*   **Rate Limiting:** Implement robust error handling and retry mechanisms for ad platform API calls, respecting their rate limits.

*This configuration ensures that AI agents can precisely understand and interact with the project's technical landscape, promoting efficient and high-quality development.* 

</details>

## 🛠️ Development Setup

### Prerequisites

*   Node.js (v20.x or higher recommended)
*   npm or Yarn
*   Expo CLI (`npm install -g expo-cli`)
*   MongoDB (local or cloud instance)

### Installation

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App.git
    cd AdSynk-Unified-Campaign-Management-React-Native-App
    

2.  **Install backend dependencies:**
    bash
    cd backend
    npm install
    # or
    yarn install
    

3.  **Install frontend dependencies:**
    bash
    cd ../frontend
    npm install
    # or
    yarn install
    

### Configuration

*   Create a `.env` file in the `backend` directory and configure your MongoDB connection string and ad platform API credentials:
    env
    MONGODB_URI=your_mongodb_connection_string
    FACEBOOK_APP_ID=your_facebook_app_id
    FACEBOOK_APP_SECRET=your_facebook_app_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    LINKEDIN_CLIENT_ID=your_linkedin_client_id
    LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
    JWT_SECRET=your_super_secret_jwt_key
    

## 🏃 Development Scripts

| Script Name       | Description                                    |
| :---------------- | :--------------------------------------------- |
| `dev:server`      | Start the Node.js backend server               |
| `dev:frontend`    | Start the React Native development server (Expo) |
| `lint`            | Run ESLint to check code quality               |
| `format`          | Run Prettier to format code                    |
| `test`            | Run Jest unit and integration tests            |

**To start both the backend and frontend:**

1.  **Start backend:** Open a terminal in the `backend` directory and run `npm run dev:server`.
2.  **Start frontend:** Open another terminal in the `frontend` directory and run `npm run dev:frontend`.

## 📄 License

This project is licensed under the **CC BY-NC 4.0 License** - see the [LICENSE](LICENSE) file for details.

## ⭐ Star Velocity

If you find this project valuable, please consider starring it on GitHub!

[![GitHub stars](https://img.shields.io/github/stars/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App?style=flat-square&logo=github)](https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App/stargazers)
