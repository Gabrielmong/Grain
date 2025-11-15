# Development Setup Guide

Complete setup guide for the Woodwork project (Frontend + Backend).

## Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: Latest version (for backend)
- **VS Code**: Recommended IDE
- **Git**: For version control

## Project Structure

```
lumber-calculator/
├── backend/              # GraphQL API with Prisma
│   ├── src/
│   ├── prisma/
│   ├── .eslintrc.json
│   ├── .prettierrc
│   └── package.json
├── src/                  # React frontend
├── eslint.config.js
├── .prettierrc
└── package.json
```

## Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random secret for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)

### 3. Initialize Database

**Backend:**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Development Servers

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
cd backend
npm run dev
```

## VS Code Setup

### Required Extensions

Install these extensions (auto-suggested when you open the project):

**Both Projects:**
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Error Lens** (`usernamehw.errorlens`)

**Backend Only:**
- **Prisma** (`Prisma.prisma`)
- **Apollo GraphQL** (`apollographql.vscode-apollo`)

### Extension Installation

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions view)
3. Click "Install Workspace Recommended Extensions"

OR

1. Press `Ctrl+Shift+P`
2. Type "Show Recommended Extensions"
3. Click "Install All"

### Verify Setup

Settings should be automatically configured. Verify:

1. Open a TypeScript file
2. Add a formatting issue (extra spaces, wrong quotes)
3. Save the file (Ctrl+S)
4. File should auto-format with Prettier
5. ESLint errors should show inline

## Linting & Formatting

### Frontend

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format all code
npm run format

# Check formatting (CI/CD)
npm run format:check
```

### Backend

```bash
cd backend

# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format all code
npm run format

# Check formatting (CI/CD)
npm run format:check
```

### Pre-commit Workflow

Before committing code:

```bash
# Frontend
npm run lint:fix
npm run format

# Backend
cd backend
npm run lint:fix
npm run format
```

## Code Style Guide

### TypeScript

- **Quotes**: Single quotes (`'hello'`)
- **Semicolons**: Required (`;`)
- **Line width**: 100 characters max
- **Indentation**: 2 spaces
- **Trailing commas**: ES5 style

### React/JSX

- **Component names**: PascalCase (`UserProfile`)
- **File names**: PascalCase for components (`UserProfile.tsx`)
- **Hooks**: camelCase starting with `use` (`useAuth`)
- **Props**: Destructure in component signature
- **JSX quotes**: Double quotes (`<div className="test">`)

### GraphQL Resolvers

- **Resolver names**: camelCase (`createUser`)
- **Types**: PascalCase (`User`, `AuthResponse`)
- **Inputs**: Suffix with `Input` (`CreateUserInput`)
- **Context parameter**: Use `context` (not `ctx`)

### Prisma Schema

- **Model names**: PascalCase (`User`, `Lumber`)
- **Field names**: camelCase (`firstName`, `createdAt`)
- **Relations**: Plural for many (`projects`, `boards`)

## Common Commands

### Frontend

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check linting
npm run lint:fix     # Fix linting errors
npm run format       # Format code
```

### Backend

```bash
npm run dev                # Start dev server with hot reload
npm run build              # Compile TypeScript
npm run start              # Run production build
npm run lint               # Check linting
npm run lint:fix           # Fix linting errors
npm run format             # Format code
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio GUI
```

## Troubleshooting

### ESLint not working

**Symptoms**: No linting errors showing in VS Code

**Solutions**:
1. Restart VS Code
2. Check ESLint output: View → Output → Select "ESLint"
3. Run `npm install` to ensure dependencies are installed
4. Check `.eslintrc.json` (backend) or `eslint.config.js` (frontend) exists

### Prettier not formatting on save

**Symptoms**: Files not auto-formatting when saved

**Solutions**:
1. Open Settings (Ctrl+,)
2. Search "default formatter"
3. Set to "Prettier - Code formatter"
4. Search "format on save"
5. Enable "Editor: Format On Save"
6. Restart VS Code

### TypeScript errors

**Symptoms**: Red squiggly lines, type errors

**Solutions**:
1. Run `npm install` to install type definitions
2. Restart TypeScript server: Ctrl+Shift+P → "TypeScript: Restart TS Server"
3. Check `tsconfig.json` is valid
4. For backend: Run `npm run prisma:generate` to generate types

### Prisma schema not formatting

**Symptoms**: `.prisma` files not formatting correctly

**Solutions**:
1. Install Prisma extension
2. Run `npx prisma format` manually
3. Check Prisma is set as formatter for `.prisma` files in settings

### Database connection issues

**Symptoms**: Prisma can't connect to database

**Solutions**:
1. Check PostgreSQL is running
2. Verify `DATABASE_URL` in `.env` is correct
3. Test connection: `psql -U username -d database_name`
4. Check firewall settings

### Port already in use

**Frontend (Vite - port 5173):**
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Kill process on port 5173 (Mac/Linux)
lsof -ti:5173 | xargs kill -9
```

**Backend (port 4000):**
```bash
# Change port in backend/.env
PORT=4001
```

## Best Practices

### Code Quality

✅ **DO:**
- Write descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use TypeScript types (avoid `any` when possible)
- Handle errors properly
- Write meaningful commit messages

❌ **DON'T:**
- Commit with linting errors
- Disable ESLint rules without discussion
- Use `any` type excessively
- Ignore TypeScript errors
- Commit `console.log` statements (use proper logging)
- Hardcode sensitive data (use environment variables)

### Git Workflow

```bash
# Before committing
npm run lint:fix
npm run format
npm run build  # Make sure it builds

# Commit
git add .
git commit -m "feat: add user authentication"

# Push
git push
```

### Commit Message Format

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add user registration with JWT
fix: resolve login authentication bug
docs: update API documentation
style: format code with prettier
refactor: extract auth logic to separate file
```

## Project Resources

### Documentation

- **Frontend**: `LINTING.md` - ESLint & Prettier setup
- **Backend**: `backend/README.md` - API documentation
- **Backend**: `backend/AUTHENTICATION.md` - Auth implementation
- **Backend**: `backend/LINTING.md` - Linting setup

### Useful Links

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL](https://graphql.org/learn/)

## Getting Help

### Check These First

1. **Error messages** - Read the full error, it usually tells you what's wrong
2. **Console/Terminal** - Check for additional error details
3. **Documentation** - Check project docs listed above
4. **VS Code Output** - View → Output → Select relevant tool

### Common Error Patterns

**"Cannot find module"** → Run `npm install`
**"Type error"** → Check TypeScript types, run `npm run prisma:generate`
**"Prisma error"** → Check database is running, `.env` is correct
**"Port in use"** → Change port or kill existing process
**"Linting error"** → Run `npm run lint:fix`

## Next Steps

After setup:

1. ✅ Verify both frontend and backend are running
2. ✅ Test authentication (register/login)
3. ✅ Create some test data
4. ✅ Run linting: `npm run lint`
5. ✅ Format code: `npm run format`
6. ✅ Start building features!

Happy coding! 🚀
