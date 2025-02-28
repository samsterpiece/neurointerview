# Contributing to Neurointerview

<div align="center">
  <img src="frontend/public/assets/logo.png" alt="Neurointerview Logo" width="150">
  <p><strong>Thank you for considering contributing to Neurointerview!</strong></p>
</div>

We're excited to have you join our mission to create more equitable technical interviews for neurodivergent engineers. This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

In short: be respectful, inclusive, and kind to others. Remember that our platform serves neurodivergent people, so we're particularly attentive to accessibility and inclusion.

## Getting Started

### 1. Set up the development environment

Follow the instructions in the [README.md](README.md) to set up your local development environment.

### 2. Find an issue to work on

- Check the [Issues](https://github.com/samsterpiece/neurointerview/issues) tab for open issues
- Look for issues labeled `good first issue` if you're new to the project
- Comment on the issue you'd like to work on to let maintainers know you're interested

### 3. Fork and clone the repository

- Fork the repository on GitHub
- Clone your fork locally:
  ```bash
  git clone https://github.com/yourusername/neurointerview.git
  cd neurointerview
  ```

### 4. Create a new branch

Create a branch with a descriptive name related to the issue you're addressing:

```bash
git checkout -b feature/add-adhd-accommodations
# or
git checkout -b fix/login-validation-bug
```

## Development Process

### Backend (Django) Development

- Follow Django best practices
- Write tests for all new functionality
- Document API endpoints using docstrings

### Frontend (React) Development

- Follow React best practices and use functional components with hooks
- Ensure all components are accessible (see [Accessibility Guidelines](#accessibility-guidelines))
- Write meaningful component and prop names

### Neurodivergent Considerations

When developing features, particularly those related to accommodations for neurodivergent users:

- Research the specific needs of the neurodivergent profile you're addressing
- Consider consulting with neurodivergent individuals for feedback
- Test your features with the accommodations enabled

## Pull Request Process

1. **Update your fork** with the latest changes from the main repository
   ```bash
   git remote add upstream https://github.com/originalowner/neurointerview.git
   git fetch upstream
   git merge upstream/main
   ```

2. **Commit your changes** with clear, descriptive commit messages
   ```bash
   git add .
   git commit -m "Add timer pause feature for ADHD accommodation"
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request (PR)**
   - Go to the [original repository](https://github.com/samsterpiece/neurointerview)
   - Click "New Pull Request"
   - Select "compare across forks"
   - Select your fork and branch
   - Fill out the PR template completely

5. **Respond to feedback**
   - Address any comments or requested changes from reviewers
   - Make additional commits as needed
   - Update the PR by pushing to your branch

6. **PR approval and merge**
   - A maintainer will merge your PR once it's approved
   - Delete your branch after it's been merged

## Coding Standards

### General

- Use meaningful variable and function names
- Keep functions small and focused on a single responsibility
- Comment complex logic, but let code be self-documenting when possible
- Follow language-specific best practices

### Python (Backend)

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide
- Use docstrings for classes and functions
- Organize imports alphabetically within groups
- Write unit tests using Django's test framework

### JavaScript/React (Frontend)

- Use ESLint with our provided configuration
- Follow the project's component structure
- Use functional components with hooks
- Prefer explicit prop types over implicit ones
- Use styled-components for styling

## Accessibility Guidelines

Neurointerview is committed to maintaining high accessibility standards:

- Follow [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/) standards
- Ensure adequate color contrast (minimum 4.5:1 for normal text)
- Provide text alternatives for non-text content
- Make all functionality available from a keyboard
- Support screen readers with appropriate ARIA attributes
- Test with screen readers and keyboard navigation
- Consider different neurodivergent needs in your design

## Reporting Bugs

When reporting bugs, please include:

- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Your environment (browser, OS, device)
- Any relevant logs or error messages

Use the bug report template when creating a new issue.

## Feature Requests

We welcome feature suggestions! When proposing a new feature:

- Describe the problem your feature would solve
- Explain how your solution would work
- Discuss alternatives you've considered
- Explain how this feature would benefit neurodivergent users
- Include mockups or examples if possible

Use the feature request template when creating a new issue.

## Community

Join our community:

- [Discord Server](https://discord.gg/neurointerview) (Coming soon)
- [Discussions](https://github.com/samsterpiece/neurointerview/discussions)

---

<div align="center">
  <p>Thank you for contributing to Neurointerview and helping make technical interviews more accessible for neurodivergent engineers!</p>
</div>