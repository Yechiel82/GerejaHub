# Contributing to GerejaHub

Thank you for your interest in contributing to GerejaHub! We welcome contributions from everyone.

## 🎯 Ways to Contribute

- **Report bugs** - Found a bug? Open an issue
- **Suggest features** - Have an idea? We'd love to hear it
- **Improve documentation** - Help others understand the project
- **Write code** - Fix bugs or implement new features
- **Test** - Help us ensure quality

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/gerejahub.git
cd gerejahub
npm install
```

### 2. Set Up Development Environment

Follow the [Quick Start guide](README.md#-quick-start) in the README to set up Supabase and environment variables.

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 📝 Development Guidelines

### Code Style

- **TypeScript** - Use TypeScript for all new code
- **Server Components** - Default to Server Components, use Client Components only when needed
- **Naming** - Use descriptive variable and function names
- **Comments** - Add comments for complex logic
- **Formatting** - Code will be auto-formatted on commit

### File Organization

```
app/
├── (public)/          # Public pages (no auth required)
├── member/            # Member area (auth required)
├── admin/             # Admin panel (admin role required)
├── actions/           # Server actions
└── components/        # Shared components

lib/
├── supabase/         # Supabase clients and utilities
├── utils/            # Helper functions
└── data/             # Data fetching and transformation
```

### Component Guidelines

**Server Components (default):**
```typescript
// app/sermons/page.tsx
export default async function SermonsPage() {
  const sermons = await fetchSermons()
  return <div>{/* ... */}</div>
}
```

**Client Components (when needed):**
```typescript
// app/components/interactive-button.tsx
"use client"

export function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Server Actions

```typescript
// app/actions/example.ts
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function exampleAction(formData: FormData) {
  // 1. Validate input
  // 2. Authenticate user
  // 3. Perform action
  // 4. Revalidate cache
  // 5. Redirect or return result
}
```

### Database Changes

1. Create a new migration file in `supabase/`
2. Name it descriptively: `add_feature_name.sql`
3. Include:
   - Table creation/modification
   - RLS policies
   - Indexes
   - Sample data (if applicable)
4. Update `supabase/COMPLETE_SETUP.sql` if it's a core feature
5. Document the changes in your PR

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Write Tests

```typescript
// lib/utils/__tests__/validation.test.ts
import { validateEmail } from '../validation'

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })

  it('should reject invalid email', () => {
    expect(validateEmail('invalid')).toBe(false)
  })
})
```

## 🔒 Security

- **Never commit secrets** - Use environment variables
- **Validate all inputs** - Server-side validation is required
- **Use RLS policies** - All tables must have proper RLS
- **Sanitize user input** - Remove HTML tags and dangerous characters
- **Rate limit** - Add rate limiting to public endpoints

## 📋 Pull Request Process

### 1. Before Submitting

- [ ] Code follows the style guidelines
- [ ] Tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] Documentation is updated
- [ ] Commit messages are clear

### 2. Commit Messages

Use conventional commits:

```
feat: add prayer counter feature
fix: resolve RSVP button not working
docs: update installation guide
style: format code with prettier
refactor: simplify authentication logic
test: add tests for validation utils
chore: update dependencies
```

### 3. Submit PR

1. Push your branch to your fork
2. Open a Pull Request to `main` branch
3. Fill out the PR template
4. Link related issues
5. Wait for review

### 4. PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test the changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug is already reported
2. Try to reproduce on latest version
3. Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 18.17.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Mockups, examples, etc.
```

## 📖 Documentation

### Documentation Guidelines

- **Clear and concise** - Easy to understand
- **Examples** - Show, don't just tell
- **Up to date** - Keep docs in sync with code
- **Screenshots** - Visual aids help
- **Links** - Reference related docs

### Where to Add Documentation

- **README.md** - Overview and quick start
- **Code comments** - Complex logic
- **JSDoc** - Function documentation
- **Separate guides** - Detailed tutorials

## 🎨 UI/UX Guidelines

- **Mobile-first** - Design for mobile, enhance for desktop
- **Accessibility** - Use semantic HTML, ARIA labels
- **Consistent** - Follow existing design patterns
- **Fast** - Optimize images, minimize JavaScript
- **Responsive** - Test on different screen sizes

## 🌍 Internationalization

Currently, GerejaHub is in English. If you'd like to add translations:

1. Create a new issue to discuss
2. Use a standard i18n library
3. Provide translations for all UI text
4. Update documentation

## 📞 Getting Help

- **GitHub Discussions** - Ask questions
- **GitHub Issues** - Report bugs

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior:**
- Trolling, insulting comments, personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate


## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to GerejaHub!** 🙏

Every contribution, no matter how small, helps make GerejaHub better for churches worldwide.
