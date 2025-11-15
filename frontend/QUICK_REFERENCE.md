# Quick Reference - Woodwork

## 🚀 Common Commands

### Frontend

```bash
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Build for production
npm run lint             # Check linting errors
npm run lint:fix         # Auto-fix linting errors
npm run format           # Format all code with Prettier
npm run format:check     # Check if code is formatted
```

### Backend

```bash
cd backend
npm run dev              # Start dev server (http://localhost:4000)
npm run build            # Compile TypeScript
npm run start            # Run production build
npm run lint             # Check linting errors
npm run lint:fix         # Auto-fix linting errors
npm run format           # Format all code with Prettier
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
```

## 📁 Project Structure

```
lumber-calculator/
├── src/                     # React frontend
│   ├── components/          # React components
│   ├── store/               # Redux slices
│   ├── types/               # TypeScript types
│   ├── i18n/                # Translations (en, es)
│   ├── router/              # React Router config
│   └── utils/               # Utilities
├── backend/                 # GraphQL API
│   ├── src/
│   │   ├── resolvers/       # GraphQL resolvers
│   │   ├── schema/          # GraphQL schema
│   │   ├── middleware/      # Auth middleware
│   │   └── utils/           # Auth & errors
│   └── prisma/
│       └── schema.prisma    # Database schema
├── .vscode/                 # VS Code settings
├── LINTING.md               # Frontend linting guide
└── backend/LINTING.md       # Backend linting guide
```

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `eslint.config.js` | Frontend ESLint config (flat config) |
| `backend/.eslintrc.json` | Backend ESLint config |
| `.prettierrc` | Prettier formatting rules (both) |
| `tsconfig.json` | TypeScript compiler options |
| `vite.config.ts` | Vite build configuration |
| `prisma/schema.prisma` | Database schema |

## 🎨 Code Style

### Formatting Rules

- **Quotes**: Single (`'hello'`)
- **Semicolons**: Required (`;`)
- **Line width**: 100 characters
- **Indentation**: 2 spaces
- **Trailing commas**: ES5 style

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Functions | camelCase | `calculateBoardFeet()` |
| Hooks | camelCase with 'use' | `useAuth()` |
| Types/Interfaces | PascalCase | `User`, `AuthResponse` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| CSS Classes | kebab-case | `user-profile` |

## 🔐 Environment Variables

### Frontend

Create `.env` (optional):
```env
VITE_API_URL=http://localhost:4000/graphql
```

### Backend

Create `backend/.env` (required):
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/woodwork_calculator"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
```

## 🗄️ Database

### Prisma Commands

```bash
cd backend

# Generate Prisma Client after schema changes
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format schema file
npx prisma format
```

### Database Models

- **User** - User accounts with authentication
- **Lumber** - Wood types (name, Janka rating, cost)
- **Finish** - Wood finishes (name, price, image)
- **Project** - Woodworking projects
- **Board** - Lumber pieces in projects
- **Settings** - User preferences (currency, language, theme)

## 🔑 Authentication

### Public Routes (No Auth)

- `register` - Create account
- `login` - Authenticate

### Protected Routes (Auth Required)

All other queries and mutations require JWT token in header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

```graphql
mutation {
  login(input: {
    username: "johndoe"
    password: "password123"
  }) {
    token
    user { id username }
  }
}
```

## 📊 GraphQL API

### Endpoints

- **GraphQL**: `http://localhost:4000/graphql`
- **Health Check**: `http://localhost:4000/health`

### Common Queries

```graphql
# Get current user
query { me { id username firstName lastName } }

# Get all lumber
query { lumbers { id name costPerBoardFoot } }

# Get all projects
query { projects { id name totalCost } }

# Dashboard stats
query { dashboardStats { totalProjects totalLumber } }
```

### Common Mutations

```graphql
# Create lumber
mutation {
  createLumber(input: {
    name: "Oak"
    description: "Premium oak"
    jankaRating: 1360
    costPerBoardFoot: 8.50
    tags: ["hardwood"]
  }) { id name }
}

# Update settings
mutation {
  updateSettings(input: {
    currency: "USD"
    language: "en"
    themeMode: "dark"
  }) { id currency }
}
```

## 🐛 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| Port already in use | Change PORT in `.env` or kill process |
| Prisma errors | Check DATABASE_URL, run `npm run prisma:generate` |
| ESLint not working | Restart VS Code, run `npm install` |
| Type errors | Run `npm run prisma:generate`, restart TS server |
| Formatting not working | Check Prettier extension, enable "Format on Save" |

### Quick Fixes

```bash
# Reset everything
rm -rf node_modules package-lock.json
npm install

# Fix Prisma types
cd backend
npm run prisma:generate

# Fix linting
npm run lint:fix
npm run format

# Restart TypeScript
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

## 🔍 VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+P` | Quick file open |
| `Ctrl+Shift+F` | Search in files |
| `F2` | Rename symbol |
| `Ctrl+.` | Quick fix |
| `Shift+Alt+F` | Format document |
| `Ctrl+/` | Toggle comment |

## 📝 Git Workflow

```bash
# Before committing
npm run lint:fix
npm run format
npm run build

# Commit with conventional commits
git add .
git commit -m "feat: add user authentication"
git push
```

### Commit Prefixes

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

## 🎯 Before You Commit Checklist

- [ ] Code builds without errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] All TypeScript types are correct
- [ ] No `console.log` statements
- [ ] Environment variables not hardcoded
- [ ] Tested locally

## 📚 Resources

- [Full Setup Guide](SETUP_GUIDE.md)
- [Frontend Linting Guide](LINTING.md)
- [Backend README](backend/README.md)
- [Backend Linting Guide](backend/LINTING.md)
- [Authentication Guide](backend/AUTHENTICATION.md)

## 💡 Tips

1. **Use VS Code extensions** - ESLint, Prettier, Error Lens
2. **Enable auto-save** - File → Auto Save
3. **Use Prisma Studio** - Visual database editor
4. **Check GraphQL Playground** - Test queries interactively
5. **Read error messages** - They usually tell you what's wrong
6. **Use TypeScript** - Don't use `any` unnecessarily
7. **Format on save** - Let Prettier handle formatting
8. **Commit often** - Small, focused commits are better

---

**Need more help?** Check the full [SETUP_GUIDE.md](SETUP_GUIDE.md) or project documentation.
