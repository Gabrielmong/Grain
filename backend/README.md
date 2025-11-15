# Woodwork Calculator Backend

GraphQL API backend for the Woodwork Calculator application, built with Apollo Server, Express, Prisma, and TypeScript.

## Features

- **GraphQL API** with Apollo Server
- **JWT Authentication** with bcrypt password hashing
- **Database ORM** with Prisma
- **TypeScript** for type safety
- **Soft delete** functionality for all entities
- **Computed fields** for project costs and board footage
- **Multi-currency** and **multi-language** support
- **User-based data isolation** - each user only sees their own data
- **Public/Private routes** - authentication required for all routes except login/register

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/woodwork_calculator?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

**Important:** Change the `JWT_SECRET` to a strong, random string in production!

### 3. Initialize Prisma

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

### 4. Start the Server

Development mode (with hot reload):

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The server will start at `http://localhost:4000/graphql`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### GraphQL Playground

Access the GraphQL playground at: `http://localhost:4000/graphql`

### Health Check

Check server status: `http://localhost:4000/health`

## GraphQL Schema Overview

### Main Types

- **User** - User accounts with authentication
- **Lumber** - Wood types with Janka ratings and pricing (user-scoped)
- **Finish** - Wood finish products with images and store links (user-scoped)
- **Project** - Woodworking projects with boards, finishes, and cost calculations (user-scoped)
- **Board** - Individual lumber pieces in a project
- **Settings** - User preferences (currency, language, theme) (user-scoped)
- **DashboardStats** - Aggregated statistics for the dashboard (user-scoped)

### Authentication

All routes except `register` and `login` require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Queries

#### Register a new user (Public)

```graphql
mutation {
  register(
    input: {
      username: "johndoe"
      email: "john@example.com"
      password: "securepassword123"
      firstName: "John"
      lastName: "Doe"
      dateOfBirth: "1990-01-15T00:00:00Z"
      hasAcceptedTerms: true
    }
  ) {
    token
    user {
      id
      username
      email
      firstName
      lastName
    }
  }
}
```

#### Login (Public)

```graphql
mutation {
  login(input: { username: "johndoe", password: "securepassword123" }) {
    token
    user {
      id
      username
      email
      firstName
      lastName
    }
  }
}
```

#### Get current user (Private)

```graphql
query {
  me {
    id
    username
    email
    firstName
    lastName
    dateOfBirth
    hasAcceptedTerms
    imageData
    createdAt
  }
}
```

#### Get all lumber types (Private)

```graphql
query {
  lumbers(includeDeleted: false) {
    id
    name
    description
    jankaRating
    costPerBoardFoot
    tags
  }
}
```

#### Get a project with calculated costs

```graphql
query {
  project(id: "project-id") {
    id
    name
    description
    boards {
      id
      width
      thickness
      length
      quantity
      boardFeet
      lumber {
        name
        costPerBoardFoot
      }
    }
    finishes {
      id
      name
      price
    }
    totalBoardFeet
    materialCost
    finishCost
    laborCost
    miscCost
    totalCost
  }
}
```

#### Get dashboard statistics

```graphql
query {
  dashboardStats {
    totalProjects
    totalLumber
    totalFinishes
    totalProjectCost
    totalBoardFeet
    avgCostPerBF
  }
}
```

### Example Mutations

#### Update user profile (Private)

```graphql
mutation {
  updateUser(
    input: {
      firstName: "John"
      lastName: "Smith"
      email: "johnsmith@example.com"
      imageData: "data:image/png;base64,..."
    }
  ) {
    id
    username
    firstName
    lastName
    email
  }
}
```

#### Change password (Private)

```graphql
mutation {
  changePassword(
    input: { currentPassword: "oldpass123", newPassword: "newpass456" }
  )
}
```

#### Delete user account (Private - Soft Delete)

```graphql
mutation {
  deleteUser {
    id
    username
    isDeleted
  }
}
```

#### Create a lumber type (Private)

```graphql
mutation {
  createLumber(
    input: {
      name: "White Oak"
      description: "Premium hardwood for furniture"
      jankaRating: 1360
      costPerBoardFoot: 8.50
      tags: ["hardwood", "furniture", "flooring"]
    }
  ) {
    id
    name
    jankaRating
    costPerBoardFoot
  }
}
```

#### Create a project

```graphql
mutation {
  createProject(
    input: {
      name: "Dining Table"
      description: "Custom oak dining table"
      boards: [
        {
          width: 6
          thickness: 1.5
          length: 4
          quantity: 4
          lumberId: "lumber-id"
        }
      ]
      finishIds: ["finish-id-1", "finish-id-2"]
      laborCost: 500
      miscCost: 50
      additionalNotes: "Client requested rounded corners"
    }
  ) {
    id
    name
    totalCost
  }
}
```

#### Update settings

```graphql
mutation {
  updateSettings(
    input: {
      currency: "CRC"
      language: "es"
      themeMode: "dark"
    }
  ) {
    id
    currency
    language
    themeMode
  }
}
```

## Data Models

### User
- username (unique, required)
- email (unique, optional)
- password (bcrypt hashed, required)
- firstName, lastName (required)
- dateOfBirth (optional)
- hasAcceptedTerms (boolean, required)
- imageData (Base64 profile image, optional)
- soft delete support
- Relations: owns lumber, finishes, projects, and settings

### Lumber
- name, description
- jankaRating (hardness)
- costPerBoardFoot
- tags (array)
- userId (foreign key - belongs to User)
- soft delete support

### Finish
- name, description
- price
- tags (array)
- storeLink (optional)
- imageData (Base64, optional)
- userId (foreign key - belongs to User)
- soft delete support

### Project
- name, description
- boards (array of Board)
- finishes (array of Finish IDs)
- laborCost, miscCost
- additionalNotes (optional)
- userId (foreign key - belongs to User)
- Computed fields: totalBoardFeet, materialCost, finishCost, totalCost
- soft delete support

### Board
- width, thickness (inches)
- length (varas, 1 vara = 33 inches)
- quantity
- lumberId (reference)
- projectId (reference)
- Computed field: boardFeet

### Settings
- userId (unique foreign key - one-to-one with User)
- currency (CRC/USD)
- language (en/es)
- themeMode (light/dark)

## Calculations

### Board Footage Formula
```
boardFeet = (width × thickness × length × 33) / 144 × quantity
```

### Project Cost Calculation
```
materialCost = Σ(board.boardFeet × lumber.costPerBoardFoot)
finishCost = Σ(finish.price)
totalCost = materialCost + finishCost + laborCost + miscCost
```

## Authentication & Security

### How Authentication Works

1. **Registration**: User creates account with `register` mutation
   - Password is hashed using bcrypt (10 rounds)
   - JWT token is generated and returned
   - Default settings are created automatically

2. **Login**: User authenticates with `login` mutation
   - Password is verified using bcrypt
   - JWT token is generated and returned on success

3. **Protected Routes**: All queries/mutations except `register` and `login` require authentication
   - Client sends JWT token in `Authorization: Bearer <token>` header
   - Server verifies token and extracts user ID
   - User can only access their own data

4. **Data Isolation**:
   - Each user has their own lumber, finishes, projects, and settings
   - Queries automatically filter by authenticated user ID
   - Users cannot access other users' data

### Security Best Practices

- **JWT Secret**: Use a strong, random secret in production (minimum 32 characters)
- **HTTPS**: Always use HTTPS in production to encrypt token transmission
- **Token Expiration**: Default is 7 days, adjust `JWT_EXPIRES_IN` as needed
- **Password Requirements**: Implement password strength requirements in your frontend
- **Rate Limiting**: Consider adding rate limiting for login/register endpoints

### Using Authentication in GraphQL Playground

1. First, login or register to get a token:
```graphql
mutation {
  login(input: { username: "johndoe", password: "password123" }) {
    token
  }
}
```

2. Copy the token from the response

3. Set HTTP headers in the playground:
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

4. Now you can make authenticated requests!

## Database Management

### Prisma Studio

Open the database GUI to view and edit data:

```bash
npm run prisma:studio
```

### Create a New Migration

After modifying the Prisma schema:

```bash
npx prisma migrate dev --name your-migration-name
```

### Reset Database

```bash
npx prisma migrate reset
```

## Troubleshooting

### Port Already in Use

If port 4000 is already in use, change the PORT in your `.env` file:

```
PORT=5000
```

### Database Connection Issues

Verify your DATABASE_URL in `.env` is correct and PostgreSQL is running:

```bash
# Test PostgreSQL connection
psql -U username -d woodwork_calculator
```

### Prisma Client Not Generated

If you get Prisma Client errors, regenerate it:

```bash
npm run prisma:generate
```

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema with User model
├── src/
│   ├── middleware/
│   │   └── auth.ts            # Authentication middleware
│   ├── resolvers/
│   │   ├── userResolvers.ts   # User & auth resolvers
│   │   ├── lumberResolvers.ts
│   │   ├── finishResolvers.ts
│   │   ├── projectResolvers.ts
│   │   ├── settingsResolvers.ts
│   │   ├── dashboardResolvers.ts
│   │   └── index.ts           # Combined resolvers
│   ├── schema/
│   │   └── typeDefs.ts        # GraphQL type definitions
│   ├── utils/
│   │   ├── auth.ts            # JWT & bcrypt utilities
│   │   └── errors.ts          # Custom error classes
│   └── index.ts               # Server entry point with auth context
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json              # TypeScript configuration
└── README.md
```

## License

ISC
