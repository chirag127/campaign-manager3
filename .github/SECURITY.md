# Security Policy

## Supported Versions

We actively support and provide security updates for the latest version of **AdSynk-Unified-Campaign-Management-React-Native-App**. Security patches applied to the `main` branch are released immediately.

## Reporting a Vulnerability

We take security very seriously. If you discover a vulnerability in **AdSynk-Unified-Campaign-Management-React-Native-App**, please report it to us as soon as possible. We will investigate and take appropriate action.

To report a security vulnerability, please use the GitHub Security advisory or send an email to `security@example.com` (replace with actual security contact if available).

Please do not publicly disclose the vulnerability until it has been addressed. We request that you follow responsible disclosure practices.

When reporting a vulnerability, please include:

1.  A clear description of the vulnerability.
2.  Steps to reproduce the vulnerability.
3.  The affected version(s) of the software.
4.  Any potential impact of the vulnerability.

We aim to acknowledge all security vulnerability reports within **48 hours** and will provide an update on the investigation and remediation status.

## Supported Security Practices

For this project, we adhere to the following security best practices:

*   **Dependency Scanning:** Regularly scan project dependencies for known vulnerabilities using tools like `npm audit` or GitHub Dependabot. Our CI pipeline (`.github/workflows/ci.yml`) includes automated checks.
*   **Code Review:** All code changes are subject to review to identify potential security flaws before merging.
*   **Secure Coding Principles:** Follow secure coding guidelines to prevent common vulnerabilities (e.g., OWASP Top 10 for web components).
*   **Input Validation:** Sanitize and validate all user inputs and external data to prevent injection attacks.
*   **Secret Management:** Sensitive credentials and API keys are managed securely using environment variables and are **never** committed to the repository.
*   **Cross-Platform Security:** For React Native applications, ensure platform-specific security considerations are addressed for both iOS and Android.

## Security Updates

*   **For Developers:** Subscribe to releases or watch the repository for announcements regarding security updates.
*   **For Users:** Keep your installation of **AdSynk-Unified-Campaign-Management-React-Native-App** updated to the latest version to benefit from the latest security patches.

---