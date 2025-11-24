# Lumber Calculator

A full-stack woodworking project management application built with React, TypeScript, GraphQL, and PostgreSQL.

## Overview

The Lumber Calculator helps woodworkers and contractors manage their woodworking projects by tracking:
- **Lumber** - Wood inventory with board feet calculations
- **Finishes** - Stains, oils, and other finishing products
- **Sheet Goods** - Plywood, MDF, and other sheet materials
- **Consumables** - Screws, glue, sandpaper, etc.
- **Tools** - Workshop tool inventory
- **Projects** - Complete project cost estimation and tracking

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Material-UI (MUI)** for components
- **Apollo Client** for GraphQL
- **Redux** for state management
- **i18next** for internationalization (EN/ES)
- **React Router** for navigation

### Backend
- **Node.js** with TypeScript
- **Apollo Server** for GraphQL API
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **bcrypt** for password hashing

## Key Features

### Project Management
- **Project Price/Quote** - Set quoted price (cotización) for projects
- **Cost Breakdown** - Automatic calculation of:
  - Material costs (lumber with board feet)
  - Finish costs with percentage-based usage
  - Sheet goods costs
  - Consumable costs
  - Labor costs
  - Miscellaneous costs
- **Project Sharing** - Generate shareable public links
- **Project Status** - Track projects through: Planned → In Progress → Completed
- **Board Feet Calculations** - Automatic conversion from varas to inches

### Finish Percentage System
Projects now support **percentage-based finish usage** (1-100%):
- Track partial usage of finish products
- Cost calculation: `finish.price × (percentageUsed / 100)`
- Visual percentage display in all project views
- Slider controls in project form

### Multi-Currency & Multi-Language
- **Currencies**: CRC (Costa Rican Colón) / USD
- **Languages**: English / Español
- Settings persist across sessions
- Dynamic currency symbols throughout app

### Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected GraphQL endpoints
- User-specific data isolation

## Project Structure

```
lumber-calculator/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Project/     # Project-related components
│   │   │   ├── Lumber/      # Lumber management
│   │   │   ├── Finish/      # Finish management
│   │   │   └── ...
│   │   ├── graphql/         # GraphQL queries/mutations
│   │   ├── store/           # Redux store
│   │   ├── types/           # TypeScript types
│   │   ├── i18n/            # Translation files (en.json, es.json)
│   │   └── utils/           # Utility functions
│   └── ...
├── backend/
│   ├── src/
│   │   ├── schema/          # GraphQL schema
│   │   ├── resolvers/       # GraphQL resolvers
│   │   ├── middleware/      # Auth & other middleware
│   │   └── ...
│   └── prisma/
│       ├── schema.prisma    # Database schema
│       └── migrations/      # Database migrations
└── ...
```

## Recent Major Changes

### Project Price & Finish Percentage (Latest)

**Database Schema Changes:**
- Added `price` field to Project model
- Changed Project-Finish relationship from implicit to explicit join table
- Created `ProjectFinish` model with `percentageUsed` field

**Files Modified:**
- Backend: `schema.prisma`, `typeDefs.ts`, `projectResolvers.ts`, `dashboardResolvers.ts`
- Frontend: `project.ts` types, `operations.ts` queries, all project components
- Store: `projectLogic.ts` updated for new schema

**Key Implementation Files:**
- `backend/prisma/schema.prisma` - Project and ProjectFinish models
- `frontend/src/components/Project/Form/ProjectFinishesFormSection.tsx` - Slider controls
- `frontend/src/components/Project/Details/ProjectFinishesSection.tsx` - Percentage display
- `frontend/src/types/project.ts` - ProjectFinish interface

## Database Models

### Core Models
- **User** - User accounts with authentication
- **Project** - Woodworking projects with price and status
- **Board** - Individual lumber pieces in projects
- **Lumber** - Wood type definitions with pricing
- **Finish** - Finishing products (stains, oils, etc.)
- **ProjectFinish** - Join table with percentage usage
- **SheetGood** - Sheet material definitions
- **ProjectSheetGood** - Sheet goods in projects with quantities
- **Consumable** - Consumable items (screws, glue, etc.)
- **ProjectConsumable** - Consumables in projects with quantities
- **Tool** - Workshop tool inventory

### Key Relationships
- Project → User (many-to-one)
- Project → ProjectFinish → Finish (many-to-many with percentage)
- Project → Board → Lumber (nested)
- Project → ProjectSheetGood → SheetGood (many-to-many)
- Project → ProjectConsumable → Consumable (many-to-many)

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Configure environment variables:
   ```bash
   # backend/.env
   DATABASE_URL="postgresql://user:password@localhost:5432/lumber_calculator"
   JWT_SECRET="your-secret-key"
   ```

4. Run database migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. Start development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

### Building for Production

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

## Translation & Currency

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for details on:
- Using the `useCurrency()` hook
- Adding translations with `useTranslation()`
- Adding new translation keys
- Currency formatting

## Contributing

When adding new features:
1. Update Prisma schema if database changes needed
2. Create migration: `npx prisma migrate dev --name feature_name`
3. Update GraphQL schema in `typeDefs.ts`
4. Update resolvers
5. Update frontend types
6. Update GraphQL queries/mutations
7. Add translations for new UI text
8. Update components
9. Test in both languages and currencies

## License

MIT
