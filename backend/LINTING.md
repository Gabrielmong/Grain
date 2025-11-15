# ESLint & Prettier Configuration - Backend

This project uses **ESLint** for code quality and **Prettier** for code formatting.

## Setup

All dependencies are already configured in `package.json`. To install:

```bash
npm install
```

## Available Scripts

### Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Formatting

```bash
# Format all code
npm run format

# Check if code is properly formatted (CI/CD)
npm run format:check
```

## Configuration Files

### ESLint (`.eslintrc.json`)

TypeScript-focused configuration with:
- **ESLint Recommended** - Core ESLint rules
- **TypeScript ESLint** - TypeScript-specific rules
- **Prettier Integration** - Disables conflicting rules

Key rules:
- Unused variables are warnings (can use `_` prefix to ignore)
- `any` type is allowed (for flexibility with GraphQL resolvers)
- Console.log is allowed (needed for server logging)
- Prefer const over let
- No var allowed (use const/let)

### Prettier (`.prettierrc`)

Formatting rules:
- **Semicolons**: Yes
- **Quotes**: Single quotes
- **Line width**: 100 characters
- **Tab width**: 2 spaces
- **Trailing commas**: ES5 compatible
- **Arrow parens**: Always
- **End of line**: LF (Unix-style)

### Ignore Files

- `.eslintignore` - Excludes dist, node_modules, migrations
- `.prettierignore` - Excludes dist, logs, env files

## VS Code Integration

### Required Extensions

Install these VS Code extensions (recommended in `.vscode/extensions.json`):
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Prisma** (`Prisma.prisma`) - Prisma schema formatting
- **Apollo GraphQL** (`apollographql.vscode-apollo`) - GraphQL syntax
- **Error Lens** (`usernamehw.errorlens`) - Shows errors inline

### Settings

The `.vscode/settings.json` file configures:
- **Format on save** - Automatically formats files when you save
- **Auto-fix on save** - Fixes ESLint errors automatically
- **Prettier for TypeScript** - Uses Prettier for .ts files
- **Prisma formatter for .prisma** - Uses Prisma extension for schema files

### Manual Setup (if needed)

If VS Code settings don't work:

1. Open VS Code Settings (Ctrl+,)
2. Search for "format on save"
3. Enable "Editor: Format On Save"
4. Search for "default formatter"
5. Set to "Prettier - Code formatter"

## File-specific Formatting

Different formatters for different file types:

- **TypeScript** (`.ts`) → Prettier
- **JSON** (`.json`) → Prettier
- **Prisma** (`.prisma`) → Prisma extension

## Pre-commit Hooks (Optional)

To enforce linting before commits, add a pre-commit hook using **husky** and **lint-staged**:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.prisma": [
      "prettier --write"
    ]
  }
}
```

## CI/CD Integration

Add to your CI pipeline:

```bash
npm run lint
npm run format:check
npm run build
npm run test # when tests are added
```

## Common Issues

### ESLint not working in VS Code

1. Restart VS Code
2. Check ESLint output: View → Output → ESLint
3. Ensure `node_modules` exists (run `npm install`)
4. Check `.eslintrc.json` is valid JSON

### Prettier not formatting on save

1. Check default formatter is set to Prettier
2. Verify "Format on Save" is enabled
3. Check for conflicting extensions
4. Ensure `.prettierrc` is valid JSON

### Prisma schema not formatting

1. Install Prisma VS Code extension
2. Set Prisma as formatter for `.prisma` files in settings
3. Run `npx prisma format` manually if needed

### TypeScript errors in resolvers

The `@typescript-eslint/no-explicit-any` rule is disabled because:
- GraphQL resolvers have dynamic types
- Prisma types are complex
- Context types vary per resolver

If you want stricter typing, enable it and add proper types:

```typescript
interface Context {
  prisma: PrismaClient;
  user?: { userId: string; username: string };
}

// Use Context instead of any
const resolver = async (_: any, args: any, context: Context) => {
  // ...
}
```

## Project-specific Rules

### GraphQL Resolvers

Resolvers use `any` types for flexibility:

```typescript
// This is okay
export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      // ...
    }
  }
}
```

### Prisma Client

Prisma is initialized at the module level:

```typescript
const prisma = new PrismaClient();
```

This is intentional and should not trigger singleton warnings.

### Error Handling

Custom error classes extend GraphQLError:

```typescript
export class AuthenticationError extends GraphQLError {
  constructor(message: string = 'Not authenticated') {
    super(message, {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}
```

## Customization

### Disable specific rules

In `.eslintrc.json`, add to the `rules` object:

```json
{
  "rules": {
    "rule-name": "off",
    "rule-name": "warn",
    "rule-name": ["error", { "option": "value" }]
  }
}
```

### Change Prettier formatting

Edit `.prettierrc`:

```json
{
  "printWidth": 120,
  "singleQuote": false,
  "semi": false
}
```

### Ignore specific files

Add to `.eslintignore` or `.prettierignore`:

```
# Ignore generated files
src/generated/**
*.config.js
```

## Best Practices

✅ **DO:**
- Run `npm run lint:fix` before committing
- Use `npm run format` to format all files
- Fix linting errors (don't disable rules without reason)
- Use meaningful variable names (avoid `_` unless truly unused)
- Keep dependencies updated

❌ **DON'T:**
- Commit code with linting errors
- Disable ESLint rules globally without team agreement
- Mix formatting styles (let Prettier handle it)
- Ignore TypeScript errors
- Format Prisma files with Prettier (use Prisma formatter)

## GraphQL-specific Linting

For GraphQL schema linting, consider adding:

```bash
npm install --save-dev @graphql-eslint/eslint-plugin
```

Then update `.eslintrc.json` to lint GraphQL files in `src/schema/`.

## Testing Integration

When tests are added, configure ESLint for test files:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.spec.ts"],
      "env": {
        "jest": true
      },
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

## Resources

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prisma Formatting](https://www.prisma.io/docs/reference/api-reference/command-reference#format)
- [GraphQL ESLint](https://the-guild.dev/graphql/eslint/docs)
