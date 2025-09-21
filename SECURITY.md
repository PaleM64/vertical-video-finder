# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this application, please send an email to the maintainers. All security vulnerabilities will be promptly addressed.

**Please do not report security vulnerabilities through public GitHub issues.**

## Security Features

### API Key Protection
- All API keys are stored as environment variables
- API keys are not exposed in client-side code
- Rate limiting is handled by external APIs

### Data Privacy
- No user data is stored on servers
- All video searches are proxied through our API
- No tracking or analytics beyond basic usage

### Legal Compliance
- Only uses official APIs and embed methods
- Respects Terms of Service of all platforms
- Download restrictions enforced by code

### Input Validation
- All user inputs are sanitized
- API responses are validated before processing
- Error handling prevents information disclosure

## Dependencies Security

This project uses:
- Next.js 15+ with latest security updates
- React 19+ with security patches
- Radix UI components (trusted UI library)
- Official platform APIs only

## Reporting Issues

For security issues, please contact the maintainers directly rather than opening a public issue.