# Implementation Guide: Currency & Language Settings

## Overview
The app now supports **dynamic currency** (CRC/USD) and **multi-language** (English/Spanish) functionality. Settings are controlled from the Settings page and persist across sessions.

## Currency Implementation

### Using the Currency Hook

Import and use the `useCurrency` hook in any component:

```tsx
import { useCurrency } from '../utils/currency';

export default function MyComponent() {
  const formatCurrency = useCurrency();

  const price = 1250.50;

  return (
    <Typography>
      Price: {formatCurrency(price)}
    </Typography>
  );
}
```

### Components That Need Currency Updates

Replace all hardcoded `₡` symbols with the currency hook:

**Lumber Components:**
- `LumberList.tsx` - Line 106 (costPerBoardFoot display)
- `LumberTable.tsx` - Line 64 (costPerBoardFoot cell)
- `LumberForm.tsx` - Label "Cost per Board Foot (₡)" → use translation
- `BoardInput.tsx` - Lines 87, 161 (lumber dropdown and cost display)

**Finish Components:**
- `FinishList.tsx` - Line 103 (price display)
- `FinishTable.tsx` - Line 74 (price cell)
- `FinishForm.tsx` - Label "Price (₡)" → use translation, Line 255 (finish dropdown)

**Project Components:**
- `ProjectList.tsx` - Lines 181, 190, 200, 210, 228 (all cost displays)
- `ProjectTable.tsx` - Line 137 (totalCost cell)
- `ProjectForm.tsx` - Lines 271, 279 (labor and misc cost labels)

### Example Implementation

**Before:**
```tsx
<Typography>₡{item.price.toFixed(2)}</Typography>
```

**After:**
```tsx
import { useCurrency } from '../utils/currency';

const formatCurrency = useCurrency();

<Typography>{formatCurrency(item.price)}</Typography>
```

## Translation Implementation

### Using Translations

Import and use the `useTranslation` hook:

```tsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <Typography variant="h3">
      {t('lumber.title')}
    </Typography>
  );
}
```

### Translation Keys Reference

See `src/i18n/en.json` and `src/i18n/es.json` for all available keys:

- `app.title` - App name
- `nav.*` - Navigation items
- `lumber.*` - Lumber page strings
- `finishes.*` - Finishes page strings
- `projects.*` - Projects page strings
- `settings.*` - Settings page strings
- `common.*` - Shared strings (edit, delete, cancel, etc.)

### Components That Need Translation Updates

**ViewLayout.tsx:**
```tsx
// Add at top
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();

// Replace hardcoded strings
<Button>{t('common.create')}</Button>
<Button>{t('common.showDeleted')}</Button>
```

**LumberTab.tsx:**
```tsx
<ViewLayout
  title={t('lumber.title')}
  subtitle={t('lumber.subtitle')}
  addButtonText={t('lumber.add')}
  emptyTitle={t('lumber.emptyTitle')}
  emptySubtitle={t('lumber.emptySubtitle')}
  // ...
/>
```

**Settings.tsx:**
Already implemented - reference example for other components.

## Testing

1. **Currency Switching:**
   - Go to Settings
   - Change Currency between CRC and USD
   - Navigate to Lumber/Finishes/Projects
   - Verify all prices show correct symbol

2. **Language Switching:**
   - Go to Settings
   - Change Language between English and Español
   - Navigate through all pages
   - Verify all UI text is translated

## Adding New Translations

1. Add key to `src/i18n/en.json`
2. Add Spanish translation to `src/i18n/es.json`
3. Use in component with `t('your.new.key')`

## Status

✅ **Completed:**
- Currency hook (`useCurrency`)
- i18next setup
- Translation files (EN/ES)
- Language sync with Redux
- Sidebar fully translated
- Settings page fully translated

⏳ **TODO:**
- Update all components to use `useCurrency()` hook
- Update all components to use `t()` translation function
- Test all pages in both languages and currencies
