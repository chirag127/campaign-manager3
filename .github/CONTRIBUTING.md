# Contributing to AdSynk-Unified-Campaign-Management-React-Native-App

Thank you for considering contributing to the AdSynk Unified Campaign Management React Native App! We welcome any contributions that align with our mission of providing a powerful, unified dashboard for ad campaign analytics.

## 1. Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. Please read the [CODE_OF_CONDUCT.md](https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App/blob/main/CODE_OF_CONDUCT.md) file to understand the expected standards of behavior.

## 2. How to Contribute

We accept contributions in the form of:

*   **Bug Reports:** Please file an issue detailing the bug, steps to reproduce, and expected vs. actual results. Use the provided bug report template.
*   **Feature Requests:** Describe the desired feature, its use case, and potential benefits.
*   **Pull Requests:** Submit well-tested, documented, and formatted code that addresses an issue or implements a requested feature.

### 2.1. Development Setup

To set up the development environment, follow these steps:

1.  **Clone the Repository:**
    bash
    git clone https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App.git
    cd AdSynk-Unified-Campaign-Management-React-Native-App
    

2.  **Install Dependencies:**
    This project uses Expo. Ensure you have Node.js (v18+) and Yarn installed.
    bash
    yarn install
    

3.  **Environment Variables:**
    Create a `.env` file in the root directory based on the `.env.example` file. You will need to configure API keys for Facebook, Google, and LinkedIn Ads.

4.  **Run the Application:**
    *   **Development Server (Expo Go):**
        bash
        yarn start
        
        Scan the QR code with the Expo Go app on your physical device or run on an emulator.
    *   **iOS Simulator:**
        bash
        yarn ios
        
    *   **Android Emulator:**
        bash
        yarn android
        

## 3. Branching and Pull Requests

*   **Branching Strategy:** We follow a simplified Gitflow-like strategy. Create a new branch for each feature or bugfix off the `main` branch.
    *   Feature branches: `feature/your-feature-name`
    *   Bugfix branches: `fix/issue-number-description`
*   **Pull Request Guidelines:**
    *   Ensure your code is well-commented and follows the project's coding style.
    *   All code must pass linting and testing checks (see `.github/workflows/ci.yml`).
    *   Write clear commit messages.
    *   Include a description of your changes in the pull request, referencing any related issues.
    *   Your pull request will be automatically checked by our CI pipeline.

## 4. Coding Standards

This project adheres to the Apex standards, emphasizing:

*   **TypeScript (Strict):** All new JavaScript code should be migrated to TypeScript where possible.
*   **React Native Best Practices:** Utilize modern React Native patterns and Expo APIs.
*   **Node.js Backend:** Follow consistent API design and error handling.
*   **Linting & Formatting:** Use the pre-commit hooks and CI checks to ensure code quality. Tools like ESLint and Prettier (configured via Biome in the Apex stack) should be used.
*   **Testing:** Write comprehensive unit and integration tests using Vitest and Playwright.

## 5. Architectural Principles

We strive to uphold principles like:

*   **SOLID:** Adherence to the Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.
*   **DRY (Don't Repeat Yourself):** Avoid redundant code by abstracting common logic.
*   **YAGNI (You Ain't Gonna Need It):** Implement only what is currently required.
*   **Feature-Sliced Design (FSD):** For frontend components, maintain clear separation of layers (e.g., `entities`, `features`, `widgets`, `pages`, `app`).

## 6. Reporting Security Vulnerabilities

We take security seriously. If you discover a security vulnerability, please follow the guidelines in the [SECURITY.md](https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App/blob/main/SECURITY.md) file.

## 7. Getting Help

If you have questions or need clarification, please open an issue or reach out on the project's discussion forum (if available).

---