# 🤝 Contributing to AdSynk-Unified-Campaign-Management-React-Native-App

As an Apex Technical Authority project, contributions must adhere to the highest standards of quality, performance, and architectural integrity. We prioritize **Zero-Defect, High-Velocity, Future-Proof** development.

This repository follows the **Single Source of Truth (SSOT)** philosophy, meaning all documentation (especially in `AGENTS.md`) must be respected and kept current.

## 1. Architectural Alignment & Prerequisites

Before submitting any Pull Request (PR), ensure your contribution respects the established 2025/2026 architecture, as detailed in the `AGENTS.md` directive file.

*   **Language Standard:** Strict **TypeScript** usage is enforced for the React Native frontend (Expo) and **ES6+ JavaScript/Node.js** for the backend (Express/MongoDB).
*   **State Management:** All state manipulation must be atomic and predictable. Favor functional purity.
*   **API Contracts:** Any new API integration or backend logic **MUST** include integration tests conforming to the structure defined in the CI pipeline (`ci.yml`).

## 2. The Development Workflow

We use a robust branch protection model. All changes should flow through feature branches and be submitted via Pull Request.

1.  **Fork:** Fork this repository.
2.  **Clone:** Clone your fork locally:
    bash
    git clone https://github.com/YOUR_USERNAME/AdSynk-Unified-Campaign-Management-React-Native-App.git
    cd AdSynk-Unified-Campaign-Management-React-Native-App
    
3.  **Branch:** Create a descriptive feature branch:
    bash
    git checkout -b feature/short-descriptive-name
    
4.  **Development & Verification:** Implement your changes. Crucially, run local verification steps before committing.
    *   **LINT/FORMAT:** Ensure zero violations before committing.
        bash
        npm run lint
        npm run format
        
    *   **TESTING (Unit/Integration):** Run local validation suites.
        bash
        npm run test:unit
        # For backend API changes:
        npm run test:e2e
        
5.  **Commit:** Use conventional commits (`feat:`, `fix:`, `chore:`).
6.  **Push & PR:** Push your branch and open a Pull Request against the `main` branch.

## 3. Pull Request Submission Standards

Every PR must be accompanied by a detailed description using the provided template (`.github/PULL_REQUEST_TEMPLATE.md`).

**Mandatory Requirements for PR Acceptance:**

*   **Passing CI:** All GitHub Actions checks (Build, Lint, Test) must pass green upon review.
*   **Documentation Update:** If you modify core logic, update `AGENTS.md` if necessary to reflect new architectural directives or toolchain utilization.
*   **Code Review:** A minimum of one maintainer approval is required. Be responsive to feedback.
*   **Security Consciousness:** All contributions must be vetted against potential injection vectors (especially in API handlers) and sensitive data handling.

## 4. Reporting Issues

If you encounter a bug or wish to propose a feature, please use the provided issue templates in `.github/ISSUE_TEMPLATE/`.

*   **Bug Reports:** Use `bug_report.md`. Provide clear steps to reproduce, expected vs. actual results, and environment details (Node version, device OS, etc.).
*   **Feature Requests:** Detail the business value and architectural implication of the request.

## 5. Code of Conduct

This project enforces a professional and respectful environment. Please review the [Code of Conduct](https://github.com/chirag127/AdSynk-Unified-Campaign-Management-React-Native-App/blob/main/.github/CODE_OF_CONDUCT.md) (Note: This file is assumed generated as part of the Standard 11 mandate, though not explicitly requested here for output).

--- 

*By contributing, you agree to license your contributions under the terms specified in the `LICENSE` file (CC BY-NC 4.0).* 