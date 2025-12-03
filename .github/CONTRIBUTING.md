# 🤝 Contributing to AdSynk-Cross-Platform-Ad-Campaign-Manager-App

We welcome contributions that enhance the robustness, performance, and feature set of **AdSynk**, the unified Cross-Platform Ad Campaign Manager.

As an Apex project, we adhere to the highest standards of software engineering. Please review the following guidelines before submitting a Pull Request (PR) or Issue.

## 1. Core Philosophy: Apex Standards

Contributions must align with the **Zero-Defect, High-Velocity, Future-Proof** philosophy. This means prioritizing: 

*   **Clarity & Maintainability:** Code must be exceptionally readable.
*   **Performance:** Efficient utilization of React Native/Expo and Node.js backend resources.
*   **Test Coverage:** New features or bug fixes *must* include corresponding unit/integration tests.

## 2. Development Environment Setup

To ensure consistency with our CI/CD pipeline, please set up your local environment to mirror the project configuration.

1.  **Fork the Repository:** Fork `chirag127/AdSynk-Cross-Platform-Ad-Campaign-Manager-App` to your account.
2.  **Clone:** Clone your fork locally:
    bash
    git clone https://github.com/YOUR_USERNAME/AdSynk-Cross-Platform-Ad-Campaign-Manager-App.git
    cd AdSynk-Cross-Platform-Ad-Campaign-Manager-App
    
3.  **Install Dependencies (Frontend/Backend):
    bash
    # Backend (Node.js)
    npm install
    
    # Frontend (Expo)
    cd packages/frontend # Assuming a monorepo structure, adjust if necessary
    npx expo install
    cd ../..
    
4.  **Linting & Formatting Check (Crucial Step):
    Ensure all code conforms to the configured Biome (Frontend) and ESLint/Prettier (Backend) standards before committing.
    bash
    npm run lint
    npm run format:check
    

## 3. Workflow for Submitting Changes

We utilize the **Feature Branch Workflow** combined with mandatory validation checks.

### A. Reporting Issues

*   Use the official **Bug Report Template** located in `.github/ISSUE_TEMPLATE/bug_report.md`.
*   Provide clear steps to reproduce, expected vs. actual behavior, and environment details (OS, Device/Emulator, App Version).

### B. Submitting Pull Requests (PRs)

1.  **Create a Branch:** Base all new work off the latest `main` branch and create a feature branch:
    bash
    git checkout main
    git pull upstream main
    git checkout -b feat/descriptive-feature-name
    
2.  **Commit Messages:** Follow the **Conventional Commits** specification (e.g., `feat:`, `fix:`, `chore:`, `refactor:`).
3.  **Target:** All PRs must target the `main` branch.
4.  **Self-Verification:** Before pushing, run all local tests (`npm run test` for frontend, equivalent for backend). A failing local test suite will result in an immediate PR rejection by the automated CI pipeline.
5.  **Description:** Use the **PR Template** (`.github/PULL_REQUEST_TEMPLATE.md`) to fully describe the change, linking to any related issues.

## 4. Architectural Principles

Adherence to these patterns ensures system longevity and scalability:

*   **SOLID:** Apply the Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles, especially in the Node.js service layer handling external APIs.
*   **DRY (Don't Repeat Yourself):** Abstract repetitive logic, particularly in data transformation layers between ad platform APIs and the unified dashboard schema.
*   **YAGNI (You Ain't Gonna Need It):** Avoid premature optimization or adding speculative features. Deliver only what is required by the current issue or feature specification.

## 5. Security Requirements

Security is paramount for an application handling sensitive advertising credentials and data. Review the guidelines in `.github/SECURITY.md`.

*   **NEVER** hardcode API keys or secrets in source code pushed to this repository.
*   All secrets must be managed via secure environment variables or secrets management systems (referenced in CI/CD).

Thank you for helping us maintain a high-quality, high-performance Ad Management Platform.