# Contributing

Thank you for your interest in contributing to ReResell!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/recycle-resell.git
cd recycle-resell

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Set up database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define types explicitly
- Avoid `any` type

### React

- Use functional components
- Use hooks appropriately
- Keep components focused

### Styling

- Use Tailwind CSS classes
- Follow existing patterns
- Use shadcn/ui components

## Commit Messages

Follow conventional commits:

```
feat: add user profile page
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: simplify auth logic
test: add listing API tests
chore: update dependencies
```

## Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Describe your changes**
   - What does this PR do?
   - How to test it?
   - Screenshots if UI changes

## Issues

### Reporting Bugs

Include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser/environment info

### Feature Requests

Include:

- Use case description
- Proposed solution
- Alternative solutions considered

## Code of Conduct

- Be respectful
- Be constructive
- Be patient
- Help others learn

## Questions?

Open an issue or start a discussion on GitHub.
