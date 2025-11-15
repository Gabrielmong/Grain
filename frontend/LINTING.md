# ESLint & Prettier Configuration - Frontend

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

### ESLint (`eslint.config.js`)

Uses the new ESLint flat config format with:
- **TypeScript ESLint** - TypeScript-specific rules
- **React Hooks** - Enforces Rules of Hooks
- **React Refresh** - Fast Refresh best practices
- **Prettier Integration** - Disables conflicting rules

Key rules:
- Unused variables are warnings (can use `_` prefix to ignore)
- `any` type is allowed (for flexibility)
- Console.log warnings (error and warn are allowed)
- React Refresh warnings for better HMR

### Prettier (`.prettierrc`)

Formatting rules:
- **Semicolons**: Yes
- **Quotes**: Single quotes for JS/TS, double for JSX
- **Line width**: 100 characters
- **Tab width**: 2 spaces
- **Trailing commas**: ES5 compatible
- **Arrow parens**: Always

### Ignore Files

- `.prettierignore` - Files to exclude from formatting
- ESLint ignores are configured in `eslint.config.js`

## VS Code Integration

### Required Extensions

Install these VS Code extensions (recommended in `.vscode/extensions.json`):
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Error Lens** (`usernamehw.errorlens`) - Shows errors inline

### Settings

The `.vscode/settings.json` file configures:
- **Format on save** - Automatically formats files when you save
- **Auto-fix on save** - Fixes ESLint errors automatically
- **Prettier as default formatter** - Uses Prettier for all file types

### Manual Setup (if needed)

If VS Code settings don't work:

1. Open VS Code Settings (Ctrl+,)
2. Search for "format on save"
3. Enable "Editor: Format On Save"
4. Search for "default formatter"
5. Set to "Prettier - Code formatter"

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
    "*.{ts,tsx}": [
      "eslint --fix",
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
```

## Common Issues

### ESLint not working in VS Code

1. Restart VS Code
2. Check ESLint output: View → Output → ESLint
3. Ensure `node_modules` exists (run `npm install`)

### Prettier not formatting on save

1. Check default formatter is set to Prettier
2. Verify "Format on Save" is enabled
3. Check for conflicting extensions

### Conflicting rules

If ESLint and Prettier conflict:
- `eslint-config-prettier` is already included to disable conflicting rules
- Prettier rules take precedence for formatting

## Customization

### Disable specific rules

In `eslint.config.js`, add to the `rules` object:

```javascript
rules: {
  'rule-name': 'off', // Disable
  'rule-name': 'warn', // Warning only
  'rule-name': ['error', { option: value }], // Error with options
}
```

### Change Prettier formatting

Edit `.prettierrc`:

```json
{
  "printWidth": 120,
  "singleQuote": false
}
```

## Best Practices

✅ **DO:**
- Run `npm run lint:fix` before committing
- Use `npm run format` to format all files
- Fix linting errors (don't disable rules without reason)
- Keep dependencies updated

❌ **DON'T:**
- Commit code with linting errors
- Disable ESLint rules globally without team agreement
- Mix formatting styles (let Prettier handle it)
- Ignore TypeScript errors

## Resources

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
