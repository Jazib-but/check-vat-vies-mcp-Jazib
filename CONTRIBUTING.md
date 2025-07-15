# Contributing to VIES VAT Checker MCP Server

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd check-vat-vies-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Run linting**
   ```bash
   npm run lint
   ```

## Code Style

- We use ESLint with TypeScript rules
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain bilingual support (Slovak/English) where applicable

## Testing

- Write unit tests for new functionality
- Ensure all tests pass before submitting PR
- Aim for good test coverage
- Test both success and error scenarios

## Documentation

- Update README.md if needed
- Update API documentation for new tools
- Add examples for new functionality
- Keep CHANGELOG.md updated

## Commit Messages

- Use clear and meaningful commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep the first line under 50 characters
- Reference issues and pull requests when applicable

Example:
```
Add support for batch VAT validation

- Implement batch processing endpoint
- Add validation for multiple VAT numbers
- Update documentation with examples
- Fixes #123
```

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](../../issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists
2. Check if there's already an issue for it
3. Provide a clear description of the feature
4. Explain why it would be useful
5. Consider implementation complexity

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

## Questions?

Don't hesitate to ask questions by opening an issue or reaching out to the maintainers.
