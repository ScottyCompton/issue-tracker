# Issue Tracker Test Plan

## Test Structure Overview

All tests will be placed in the `/tests` directory, mirroring the exact folder structure of the application. Each test file will be named with `.spec.tsx` extension.

## Test Categories

### 1. Unit Tests

- **Component Tests**: Test individual components in isolation
- **Hook Tests**: Test custom hooks and data fetching logic
- **Utility Tests**: Test helper functions and validations
- **Schema Tests**: Test validation schemas

### 2. Integration Tests

- **Page Tests**: Test complete pages with their components
- **API Tests**: Test API endpoints and data flow
- **Form Tests**: Test form submission and validation flows
- **Navigation Tests**: Test routing and page transitions

### 3. End-to-End Tests

- **User Workflow Tests**: Test complete user journeys
- **Error Scenario Tests**: Test error handling and recovery

## Detailed Test Structure

### `/tests/app/` - Main Application Tests

#### `/tests/app/page.spec.tsx`

- **Home page rendering**
- **Dashboard components integration**
- **Navigation links functionality**
- **Loading states**

#### `/tests/app/layout.spec.tsx`

- **Layout component rendering**
- **Theme provider integration**
- **Navigation structure**
- **Global error boundaries**

#### `/tests/app/error.spec.tsx`

- **Error boundary functionality**
- **Error message display**
- **Error recovery mechanisms**

#### `/tests/app/loading.spec.tsx`

- **Loading component rendering**
- **Loading states and animations**

#### `/tests/app/not-found.spec.tsx`

- **404 page rendering**
- **Navigation back to home**

### `/tests/app/components/` - Shared Components

#### `/tests/app/components/Navbar.spec.tsx`

- **Navigation links rendering**
- **Active link highlighting**
- **Responsive behavior**
- **Authentication state display**

#### `/tests/app/components/Link.spec.tsx`

- **Link component rendering**
- **Navigation functionality**
- **External vs internal links**

#### `/tests/app/components/ErrorMessage.spec.tsx`

- **Error message display**
- **Different error types**
- **Styling and accessibility**

#### `/tests/app/components/IssueStatusBadge.spec.tsx`

- **Status badge rendering**
- **Different status colors**
- **Status text display**

#### `/tests/app/components/Spinner.spec.tsx`

- **Loading spinner rendering**
- **Animation behavior**
- **Accessibility attributes**

#### `/tests/app/components/Skeleton.spec.tsx`

- **Skeleton loading states**
- **Different skeleton types**
- **Animation behavior**

#### `/tests/app/components/Pagination.spec.tsx`

- **Pagination controls rendering**
- **Page navigation functionality**
- **Current page highlighting**
- **Disabled states for first/last page**

#### `/tests/app/components/LatestIssues.spec.tsx`

- **Latest issues display**
- **Data fetching integration**
- **Empty state handling**
- **Loading states**

#### `/tests/app/components/IssueSummary.spec.tsx`

- **Issue summary rendering**
- **Data display accuracy**
- **Click handlers**
- **Status integration**

#### `/tests/app/components/IssueChart/`

- **IssueChart.spec.tsx**
    - Chart rendering
    - Data visualization
    - Responsive behavior
- **IssuesBarChart.spec.tsx**
    - Bar chart rendering
    - Data mapping
    - Chart interactions

### `/tests/app/issues/` - Issue Management Tests

#### `/tests/app/issues/list/page.spec.tsx`

- **Issue list page rendering**
- **Data fetching integration**
- **Filtering functionality**
- **Pagination integration**
- **Loading states**

#### `/tests/app/issues/new/page.spec.tsx`

- **New issue page rendering**
- **Form integration**
- **Navigation back to list**
- **Loading states**

#### `/tests/app/issues/[id]/page.spec.tsx`

- **Issue detail page rendering**
- **Data fetching by ID**
- **Not found handling**
- **Edit/delete button functionality**

#### `/tests/app/issues/edit/[id]/page.spec.tsx`

- **Edit issue page rendering**
- **Form pre-population**
- **Update functionality**
- **Validation integration**

#### `/tests/app/issues/_components/`

- **IssueForm.spec.tsx**
    - Form rendering
    - Validation rules
    - Submit functionality
    - Error handling
    - Field interactions

- **IssuesList.spec.tsx**
    - Issue list rendering
    - Data display
    - Sorting functionality
    - Empty state handling

- **IssueDetails.spec.tsx**
    - Issue detail rendering
    - Markdown rendering
    - Status display
    - Metadata display

- **IssueStatusFilter.spec.tsx**
    - Filter dropdown rendering
    - Filter functionality
    - State management
    - URL parameter integration

- **IssuesToolbar.spec.tsx**
    - Toolbar rendering
    - Create button functionality
    - Search functionality
    - Filter integration

- **EditIssueButton.spec.tsx**
    - Button rendering
    - Navigation functionality
    - Permission checks

- **DeleteIssueButton.spec.tsx**
    - Delete confirmation dialog
    - Delete functionality
    - Error handling
    - Permission checks

- **AssigneeSelect.spec.tsx**
    - Assignee dropdown rendering
    - User list fetching
    - Selection functionality
    - Search functionality

- **IssueFormSkeleton.spec.tsx**
    - Skeleton rendering
    - Loading state display

### `/tests/app/api/` - API Tests

#### `/tests/app/api/issues/route.spec.ts`

- **POST /api/issues**
    - Issue creation
    - Validation rules
    - Error handling
    - Database integration

#### `/tests/app/api/issues/[id]/route.spec.ts`

- **PATCH /api/issues/[id]**
    - Issue updates
    - Validation rules
    - Not found handling
    - Database integration

#### `/tests/app/api/auth/[...nextauth]/route.spec.ts`

- **Authentication endpoints**
    - Login functionality
    - Session management
    - Provider integration

#### `/tests/app/api/graphql/route.spec.ts`

- **GraphQL endpoint**
    - Query execution
    - Mutation handling
    - Error responses

### `/tests/app/auth/` - Authentication Tests

#### `/tests/app/auth/authOptions.spec.ts`

- **Authentication configuration**
- **Provider setup**
- **Session handling**

#### `/tests/app/auth/Provider.spec.tsx`

- **Auth provider rendering**
- **Session state management**
- **Authentication context**

### `/tests/app/lib/` - Utility Tests

#### `/tests/app/lib/utils.spec.ts`

- **Utility functions**
- **Helper methods**
- **Data transformation**

#### `/tests/app/lib/interfaces.spec.ts`

- **Type definitions**
- **Interface validation**

#### `/tests/app/lib/graphql-client.spec.ts`

- **GraphQL client setup**
- **Query execution**
- **Error handling**

### `/tests/app/graphql/` - GraphQL Tests

#### `/tests/app/graphql/schema.spec.ts`

- **Schema definition**
- **Type validation**

#### `/tests/app/graphql/resolvers.spec.ts`

- **Resolver functions**
- **Query resolvers**
- **Mutation resolvers**

#### `/tests/app/graphql/queries.spec.ts`

- **Query definitions**
- **Query execution**

### `/tests/app/schemas/` - Validation Tests

#### `/tests/app/schemas/validationSchemas.spec.tsx`

- **Zod schema validation**
- **Form validation rules**
- **Error message generation**

## Test Configuration

### Mock Setup

- **API Mocks**: Mock all external API calls
- **Database Mocks**: Mock Prisma client operations
- **Authentication Mocks**: Mock NextAuth sessions
- **Router Mocks**: Mock Next.js router

### Test Utilities

- **Custom Render**: Wrapper with providers (QueryClient, Auth, etc.)
- **Mock Data**: Factory functions for test data
- **Test Helpers**: Common test utilities

### Coverage Goals

- **Statements**: 90%
- **Branches**: 85%
- **Functions**: 90%
- **Lines**: 90%

## Test Execution Strategy

### Phase 1: Foundation (Week 1)

1. Set up test utilities and mocks
2. Create component unit tests
3. Test utility functions and schemas

### Phase 2: Integration (Week 2)

1. Test page components
2. Test form integrations
3. Test API endpoints

### Phase 3: End-to-End (Week 3)

1. Test complete user workflows
2. Test error scenarios
3. Performance and accessibility tests

## Test Data Strategy

### Mock Data Factories

```typescript
// Example mock data structure
const mockIssue = {
    id: '1',
    title: 'Test Issue',
    description: 'Test description',
    status: 'OPEN',
    createdAt: new Date(),
    updatedAt: new Date(),
    assigneeId: null,
}
```

### Test Scenarios

- **Happy Path**: Normal user workflows
- **Edge Cases**: Empty states, error conditions
- **Validation**: Form validation and error handling
- **Authentication**: Protected routes and permissions

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- tests/app/components/Navbar.spec.tsx
```

This test plan ensures comprehensive coverage of your issue tracker application while maintaining the exact folder structure you specified.
