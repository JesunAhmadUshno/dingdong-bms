# Contributing to DingDong BMS

Thank you for considering a contribution to DingDong BMS! We appreciate your interest in helping us build a better Building Management System. This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Coding Standards](#coding-standards)
8. [Testing](#testing)
9. [Documentation](#documentation)
10. [Questions or Issues](#questions-or-issues)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors. We will not tolerate harassment or discrimination based on race, religion, gender, sexual orientation, disability, or any other protected status.

### Expected Behavior
- Be respectful and inclusive
- Welcome others with kindness
- Focus on constructive criticism
- Accept criticism gracefully
- Contribute positively to the community

### Unacceptable Behavior
- Harassment, discrimination, or personal attacks
- Unwelcome advances or comments
- Insulting or derogatory language
- Publication of private information without consent
- Disruption of discussions or events

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git
- GitHub account
- Familiarity with Next.js, React, and TypeScript

### Fork and Clone
1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/yourusername/dingdong-bms.git
cd dingdong-bms
```

3. Add the upstream remote:
```bash
git remote add upstream https://github.com/originalauthor/dingdong-bms.git
```

## Development Setup

### 1. Install Dependencies
```bash
cd web
npm install
```

### 2. Create Environment File
Create a `.env.local` file in the `web/` directory (see `.env.example` for template):
```
# .env.local
DATABASE_URL=file:./data/dingdong.db
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 4. Verify Setup
- Login with demo credentials (alice_lease / leasepass456)
- Check that you can navigate the dashboard
- Verify the database file exists (web/data/dingdong.db)

## Making Changes

### Branch Naming Convention
Use descriptive branch names following this pattern:
```
feature/description-of-feature
bugfix/description-of-bug
docs/description-of-documentation
chore/description-of-maintenance
refactor/description-of-refactoring
```

Examples:
- `feature/add-notification-system`
- `bugfix/session-expiration-not-working`
- `docs/add-api-documentation`
- `chore/update-dependencies`

### Creating a Feature Branch
```bash
git checkout -b feature/your-feature-name
git pull upstream main
```

### Code Changes

#### Frontend Changes
- Modify files in `web/app/`, `web/lib/`, `web/components/`
- Maintain TypeScript strict mode
- Keep components focused and reusable
- Add proper error handling and loading states

#### Backend API Changes
- Modify files in `web/app/api/`
- Follow RESTful conventions
- Add proper error responses
- Update TypeScript types

#### Database Changes
- Modify `web/lib/db.ts` for schema changes
- Always provide migration path for existing data
- Test database operations thoroughly
- Document schema changes in PR description

### Updating Dependencies
```bash
npm update                    # Update within package.json constraints
npm install package-name@latest  # Install specific new version
npm audit fix               # Fix security vulnerabilities
```

## Commit Guidelines

### Commit Message Format
Follow conventional commits format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring without feature changes
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Build, dependencies, tooling

### Scope
- `auth` - Authentication/session related
- `api` - API endpoints
- `db` - Database related
- `ui` - User interface components
- `dashboard` - Dashboard specific
- `docs` - Documentation

### Examples
```
feat(occupants): add search and filter functionality

- Implemented full-text search for occupant names
- Added status filter dropdown
- Updated API to support search queries

Closes #123
```

```
fix(session): session expires immediately after login

- Fixed timezone issue in expiration calculation
- Session now correctly lasts 15 minutes
- Added unit tests for expiration logic

Fixes #456
```

## Pull Request Process

### Before Starting
1. Check existing issues and PRs to avoid duplicates
2. Create an issue for discussion if no issue exists
3. Wait for approval before starting on major features

### Creating a PR

1. **Ensure your fork is up to date:**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Push your changes:**
```bash
git push origin feature/your-feature-name
```

3. **Create a Pull Request on GitHub:**
   - Use a clear, descriptive title
   - Reference related issues with `Closes #123` or `Fixes #456`
   - Provide a detailed description of changes
   - Include screenshots/gifs for UI changes
   - Mention any breaking changes
   - List any related PRs

### PR Description Template
```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Done
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Added unit tests
- [ ] Tested with demo data

## Screenshots (if UI changes)
[Attach relevant screenshots]

## Breaking Changes
None / Describe breaking changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Tests pass locally
```

### Review Process
1. At least one maintainer review required
2. Address review comments or provide explanation
3. Merge when approved (rebase to keep history clean)

## Coding Standards

### TypeScript
- Always use TypeScript, no `any` types unless absolutely necessary
- Define proper interfaces for data structures
- Use strict mode
- Example:
```typescript
interface User {
  user_id: number;
  username: string;
  email: string;
  role: Role;
}

const user: User = ...; // ✅ Proper typing
const user: any = ...; // ❌ Avoid
```

### React Components
- Use functional components with hooks
- Keep components focused and reusable
- Add prop types/interfaces
- Use meaningful variable names
```typescript
// ✅ Good
interface OccupantCardProps {
  occupant: Occupant;
  onDelete: (id: number) => void;
}

export function OccupantCard({ occupant, onDelete }: OccupantCardProps) {
  return <div>...</div>;
}

// ❌ Avoid
export default function card({o, d}: any) {
  return <div>...</div>;
}
```

### Code Style
- Use consistent indentation (2 spaces)
- Use semicolons
- Use single quotes for strings (unless JSX)
- Keep lines under 100 characters where possible
- Use descriptive variable names
- No console.log in production code (use proper logging)
- Add comments for complex logic

### Error Handling
Always provide meaningful error messages:
```typescript
// ✅ Good
if (!sessionId) {
  return NextResponse.json(
    { success: false, error: 'Session ID required' },
    { status: 401 }
  );
}

// ❌ Avoid
if (!sessionId) {
  return NextResponse.json({ error: 'Error' }, { status: 400 });
}
```

## Testing

### Running Tests
```bash
npm test
npm run test:watch    # Watch mode
npm run test:coverage  # Coverage report
```

### Writing Tests
- Write tests for all new features
- Maintain or improve code coverage
- Test both success and error cases
- Use descriptive test names

### Testing Checklist
- [ ] Function unit tests pass
- [ ] Component rendering tests pass
- [ ] API endpoint tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] No console errors or warnings
- [ ] Database operations tested

## Documentation

### Code Documentation
- Add JSDoc comments for all public functions
- Add comments for complex logic
- Update README for significant features
- Example:
```typescript
/**
 * Fetches occupants for a specific property
 * @param propertyId - The property ID to fetch occupants for
 * @param page - Optional pagination page (default: 1)
 * @returns Array of occupants or error response
 */
export async function getOccupantsByProperty(
  propertyId: number,
  page: number = 1
): Promise<Occupant[] | ApiError> {
  // Implementation
}
```

### README Updates
Update README.md if your changes:
- Add/remove features
- Change installation steps
- Add new environment variables
- Modify API endpoints

### API Documentation
Document new API endpoints in the README:
```
GET /api/occupants?property_id=2     Fetch occupants for property
  - Query params: property_id, unit_id, lease_id
  - Returns: { success: boolean, occupants: Occupant[] }
  - Auth: x-session-id header required
```

## Performance Considerations

- Minimize database queries
- Use proper indexes
- Cache when appropriate
- Optimize React renders (memo, useCallback)
- Lazy load large components
- Monitor bundle size

## Security Considerations

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate all user inputs
- Sanitize database queries
- Use prepared statements
- Follow OWASP guidelines
- Report security issues privately

## Debugging

### Development Tools
- Browser DevTools for frontend debugging
- Network tab to inspect API calls
- React DevTools extension
- TypeScript for compile-time checking

### Common Issues

**Database not persisting:**
- Check file permissions on `web/data/`
- Verify database file exists with `ls -la web/data/dingdong.db`
- Check for SQLite errors in console

**Session not restoring:**
- Check localStorage for `dingdong_session_id`
- Verify session expiration time
- Check API response in Network tab

**Build errors:**
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check TypeScript: `npx tsc --noEmit`

## Questions or Issues

### Getting Help
1. Check existing issues and discussions first
2. Review [FAQ](./FAQ.md) if available
3. Join our Discord community
4. Create an issue with detailed description
5. Contact maintainers: support@dingdongbms.com

### Reporting Bugs
Include:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or video if applicable
- Your environment (OS, Node version, browser)
- Console errors or stack traces

### Requesting Features
Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (optional)
- Any related issues or references
- Mockups or examples (if applicable)

## Recognition

Contributors will be recognized in:
- Monthly contributor spotlight
- Contributors section of README
- Release notes for significant contributions
- Project acknowledgments

## License

By contributing to DingDong BMS, you agree that your contributions will be licensed under the MIT License.

---

## Quick Reference

```bash
# Setup
git clone https://github.com/yourusername/dingdong-bms.git
cd dingdong-bms/web && npm install

# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check code style

# Git Workflow
git checkout -b feature/name
git add .
git commit -m "feat(scope): description"
git push origin feature/name
# Create PR on GitHub

# Keep updated
git fetch upstream
git rebase upstream/main
git push -f origin feature/name
```

---

Thank you for contributing to DingDong BMS! Your efforts help make building management more accessible and efficient for everyone. 🚀
