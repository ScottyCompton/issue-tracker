# Issue Tracker - Projects Feature Development Plan

## Overview

This document outlines the development plan for adding project functionality to the issue tracker. Projects will serve as a parent entity for issues, allowing users to organize and filter issues by project.

## Current Architecture Analysis

- **Database**: MySQL with Prisma ORM
- **Backend**: Next.js API routes + GraphQL
- **Frontend**: Next.js with React, Radix UI components
- **Authentication**: NextAuth.js
- **Testing**: Vitest with React Testing Library

## Phase 1: Database Schema & Migration

### 1.1 Prisma Schema Updates

**File**: `prisma/schema.prisma`

**New Project Model**:

```prisma
model Project {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(255)
  description String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Updated Issue Model**:

```prisma
model Issue {
  id               Int       @id @default(autoincrement())
  title            String    @db.VarChar(255)
  description      String?   @db.Text
  status           Status    @default(OPEN)
  issueType        IssueType @default(GENERAL)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  assignedToUserId String?   @db.VarChar(255)
  assignedToUser   User?     @relation(fields: [assignedToUserId], references: [id])
  projectId        Int?      // Foreign key to Project
  project          Project?  @relation(fields: [projectId], references: [id])
}
```

### 1.2 Database Migration

- Create migration: `npx prisma migrate dev --name add_projects`
- Update Prisma client: `npx prisma generate`

## Phase 2: GraphQL Schema & Resolvers

### 2.1 GraphQL Schema Updates

**File**: `app/graphql/schema.ts`

**New Types**:

```graphql
type Project {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    updatedAt: String!
}
```

type ProjectSummary {
id: ID!
name: String!
issueCount: Int!
}

````

**Updated Issue Type**:

```graphql
type Issue {
    id: ID!
    title: String!
    description: String
    status: Status!
    issueType: IssueType!
    createdAt: String!
    updatedAt: String!
    assignedToUserId: String
    assignedToUser: User
    projectId: String
    project: Project
}
````

**New Queries**:

```graphql
type Query {
    # ... existing queries
    projects: [Project!]!
    project(id: ID!): Project
    projectSummary: [ProjectSummary!]!
}
```

**New Mutations**:

```graphql
type Mutation {
    # ... existing mutations
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
}

input CreateProjectInput {
    name: String!
    description: String
}

input UpdateProjectInput {
    name: String
    description: String
}
```

### 2.2 GraphQL Resolvers

**File**: `app/graphql/resolvers.ts`

**New Resolvers**:

- `projects` - List all projects
- `project` - Get single project by ID
- `projectSummary` - Get project summary with issue counts (query issues by projectId)
- `createProject` - Create new project
- `updateProject` - Update existing project
- `deleteProject` - Delete project (with validation - check if issues exist)

**Updated Resolvers**:

- `issues` - Add projectId filter parameter
- `createIssue` - Add projectId field
- `updateIssue` - Add projectId field

**Note**: The relationship is properly modeled with `projectId` as a foreign key in the Issue table. To get issues for a project, we query issues where `projectId` matches the project's ID.

## Phase 3: API Routes

### 3.1 Project API Routes

**File**: `app/api/projects/route.tsx`

- `GET` - List all projects
- `POST` - Create new project

**File**: `app/api/projects/[id]/route.ts`

- `GET` - Get single project
- `PUT` - Update project
- `DELETE` - Delete project (with validation)

### 3.2 Updated Issue API Routes

**File**: `app/api/issues/route.tsx`

- Update to handle projectId in create/update operations

**File**: `app/api/issues/[id]/route.ts`

- Update to handle projectId in update operations

## Phase 4: Frontend Components

### 4.1 Project Management Components

**Directory**: `app/projects/`

**Components**:

- `app/projects/page.tsx` - Projects list page
- `app/projects/new/page.tsx` - Create new project
- `app/projects/[id]/page.tsx` - Project details page
- `app/projects/[id]/edit/page.tsx` - Edit project page
- `app/projects/_components/` - Shared components
    - `ProjectForm.tsx` - Reusable project form
    - `ProjectList.tsx` - Projects list component
    - `ProjectCard.tsx` - Individual project card
    - `ProjectSelect.tsx` - Project selection dropdown (for forms)
    - `ProjectNavbarDropdown.tsx` - Navbar project selection dropdown

### 4.2 Updated Issue Components

**Files to Update**:

- `app/issues/_components/IssueForm.tsx` - Add project selection
- `app/issues/_components/IssuesList.tsx` - Add project filtering
- `app/issues/_components/IssuesToolbar.tsx` - Add project filter
- `app/components/IssueSummary.tsx` - Show project info
- `app/components/LatestIssues.tsx` - Add project filtering

**Issue Details & Edit Page Enhancements**:

- `app/issues/[id]/page.tsx` - Add project display and assignment controls
- `app/issues/edit/[id]/page.tsx` - Add project selection in edit mode
- `app/issues/_components/IssueDetails.tsx` - Add project information display
- `app/issues/_components/EditIssueButton.tsx` - Include project context
- `app/issues/_components/DeleteIssueButton.tsx` - Add project validation
- `app/issues/_components/IssueStatusBadge.tsx` - Add project badge support

### 4.3 Navigation Updates

**File**: `app/components/Navbar.tsx`

- Add "Projects" navigation link
- Add project selection dropdown (positioned between "Issues" link and theme toggle)
- Project dropdown should show "All Projects" as default
- Project dropdown should persist selection across sessions
- Project dropdown should trigger dashboard data updates when changed

## Phase 5: Context & State Management

### 5.1 Project Context

**File**: `app/contexts/ProjectContext.tsx`

- Manage selected project state
- Provide project selection functionality
- Persist project selection in localStorage
- Provide "All Projects" as default selection
- Handle project selection changes and trigger data refetching
- Expose project selection to navbar and dashboard components

### 5.2 Updated Layout

**File**: `app/layout.tsx`

- Wrap with ProjectProvider

## Phase 6: Filtering & Persistence

### 6.1 URL State Management

- Add projectId to URL parameters
- Maintain project selection across page navigation
- Update existing filter components to include project filtering

### 6.2 Home Page Updates

**File**: `app/page.tsx`

- Add project filter to dashboard
- Update issue summary to show project-specific data
- Update charts to filter by selected project
- Dashboard should respond to navbar project selection changes
- Default view should show "All Projects" data (no filtering)
- Project selection should filter:
    - Issue status summary cards (All Issues, Open Issues, In Progress Issues, Closed Issues)
    - Issue status bar chart
    - Latest issues list

## Phase 7: Validation & Business Logic

### 7.1 Project Validation Schemas

**File**: `app/schemas/validationSchemas.tsx`

- Add project validation schemas
- Update issue schemas to include projectId

### 7.2 Business Rules Implementation

- Project deletion validation (prevent deletion if issues assigned)
- Default project assignment logic
- Project assignment validation
- **Migration Business Rules**:
    - Ensure all issues are assigned to a project
    - Prevent orphaned issues during migration
    - Validate project assignment distribution
    - Handle edge cases (empty projects, single project scenarios)

## Phase 8: Testing

### 8.1 Database Tests

**Directory**: `tests/app/api/projects/`

- Project CRUD operations
- Project deletion validation
- Project-issue relationship tests
- **Migration Tests**:
    - Starter projects creation
    - Issue assignment to projects
    - Data distribution validation
    - Migration rollback scenarios

### 8.2 GraphQL Tests

**File**: `tests/app/graphql/resolvers.spec.ts`

- Project resolver tests
- Updated issue resolver tests

### 8.3 Component Tests

**Directory**: `tests/app/projects/`

- Project form tests
- Project list tests
- Project selection tests

**Updated Tests**:

- Issue form tests (with project selection)
- Issue list tests (with project filtering)
- Navigation tests (with projects link)
- **Navbar tests**:
    - Project dropdown rendering
    - Project selection functionality
    - Default "All Projects" selection
    - Selection persistence
- **Dashboard tests**:
    - Dashboard responds to project selection changes
    - Default "All Projects" view
    - Project-specific data filtering
- **Issue Details & Edit Page tests**:
    - Issue details page displays project information
    - Edit page pre-populates project selection
    - Project change functionality works correctly
    - Project validation on edit and delete operations
    - Project badges display correctly
    - Project assignment history/log functionality

### 8.4 Integration Tests

- Project creation workflow
- Issue assignment to projects
- Project filtering on dashboard
- Project deletion with validation
- **Navbar-Dashboard Integration**:
    - Project selection in navbar updates dashboard data
    - Dashboard data changes when switching between projects
    - "All Projects" selection shows unfiltered data
    - Project selection persists across page navigation
- **Issue Details & Edit Integration**:
    - Issue details page shows correct project information
    - Edit page correctly pre-populates project selection
    - Project changes are properly saved and validated
    - Project assignment changes trigger appropriate updates
    - Project badges update correctly across all views
- **Migration Integration Tests**:
    - Complete migration workflow from start to finish
    - Data integrity validation after migration
    - Dashboard functionality with migrated data
    - Project filtering with real migrated data

## Phase 9: UI/UX Enhancements

### 9.1 Project Selection UI

- **Navbar Project Dropdown**: Positioned between "Issues" link and theme toggle
    - Shows "All Projects" as default option
    - Lists all available projects
    - Persists selection across sessions
    - Triggers dashboard data updates when changed
- Project badges on issues
- Project filter chips
- Project context indicators

### 9.2 Issue Details & Edit Page UI Enhancements

**Issue Details Page** (`app/issues/[id]/page.tsx`):

- Display current project assignment prominently
- Show project badge/indicator with color coding
- Add project change functionality with dropdown
- Show project context in breadcrumbs
- Display project information in issue metadata section
- Add project assignment history/log

**Edit Issue Page** (`app/issues/edit/[id]/page.tsx`):

- Pre-populate project selection in edit mode
- Validate project changes with confirmation
- Show current vs. new project assignment
- Add project change validation rules
- Display project assignment impact warnings

**Component Enhancements**:

- `IssueDetails.tsx` - Add dedicated project display section
- `EditIssueButton.tsx` - Include project context in edit flow
- `DeleteIssueButton.tsx` - Add project validation before deletion
- `IssueStatusBadge.tsx` - Add project badge support alongside status
- Project color coding and visual indicators
- Project icons/avatars for visual identification

### 9.2 Dashboard Updates

- Project-specific metrics
- Project switching controls
- Project summary cards

## Phase 10: Migration & Deployment

### 10.1 Data Migration

**Starter Projects Creation**:

- Create three realistic starter projects:
    1. **"E-commerce Platform"** - Online shopping platform with payment processing, inventory management, and user authentication
    2. **"Mobile App Development"** - iOS and Android mobile application with push notifications, offline sync, and social features
    3. **"Website Redesign"** - Corporate website overhaul with new design system, content management, and SEO optimization

**Issue Assignment Strategy**:

- Randomly assign existing issues to one of the three starter projects
- Ensure even distribution across projects (approximately 1/3 of issues per project)
- Maintain issue data integrity during assignment
- Validate all issues have been assigned to a project

**Migration Steps**:

1. Create the three starter projects in the database
2. Query all existing issues
3. Randomly assign each issue to one of the three projects
4. Update issue records with projectId
5. Validate data integrity and distribution
6. Create migration script for repeatable deployment

### 10.2 Deployment Checklist

- Database migration
- Environment variable updates
- Build and test
- Deploy to staging/production

## Implementation Order

### Sprint 1: Foundation

1. Database schema and migration
2. GraphQL schema updates
3. Basic API routes for projects
4. Project context setup
5. **Starter projects creation and data migration**

### Sprint 2: Core Features

1. Project CRUD operations
2. Project form components
3. Project list and detail pages
4. Basic project-issue relationship

### Sprint 3: Integration

1. Update issue forms with project selection
2. Add project filtering to issue lists
3. Update dashboard with project filtering
4. Navigation updates

### Sprint 4: Polish & Testing

1. Comprehensive testing
2. UI/UX refinements
3. Performance optimization
4. Documentation updates

## Risk Mitigation

### Technical Risks

- **Database Migration**: Test migration on staging first
- **Breaking Changes**: Implement feature flags for gradual rollout
- **Performance**: Monitor query performance with project joins

### Business Risks

- **Data Loss**: Comprehensive backup before migration
- **User Experience**: Provide clear migration path for existing users
- **Adoption**: Include user guidance and documentation

## Success Criteria

### Functional Requirements

- [ ] Users can create, read, update, and delete projects
- [ ] Issues can be assigned to projects
- [ ] Users can filter issues by project
- [ ] Project selection persists across sessions
- [ ] Projects with assigned issues cannot be deleted
- [ ] Dashboard shows project-specific metrics
- [ ] Starter projects are created with realistic data
- [ ] Existing issues are properly migrated to projects
- [ ] Data migration is repeatable and reliable

### Non-Functional Requirements

- [ ] All existing functionality remains intact
- [ ] Performance impact is minimal
- [ ] UI/UX is consistent with existing design
- [ ] Comprehensive test coverage
- [ ] Documentation is updated

## Dependencies

### External Dependencies

- No new external dependencies required
- Uses existing Prisma, Next.js, and React patterns

### Internal Dependencies

- Existing authentication system
- Existing GraphQL setup
- Existing component library (Radix UI)
- Existing testing framework

## Timeline Estimate

- **Total Duration**: 4-6 weeks
- **Sprint Duration**: 1-2 weeks each
- **Testing Phase**: 1 week
- **Deployment**: 1 week

## Next Steps

1. Review and approve this plan
2. Set up development environment
3. Begin with Phase 1 (Database Schema)
4. Implement incrementally with regular testing

## Execution Approach

**Phase-by-Phase Implementation**: Each phase of this development plan will be executed step-by-step, with thorough thinking and planning before implementation.

**Review and Confirmation Process**:

- Each phase will be completed in its entirety before moving to the next phase
- After completing each phase, there will be a review and confirmation process
- Only after approval of the current phase will we proceed to the next phase
- This ensures quality control and allows for adjustments based on learnings from each phase

**Implementation Strategy**:

- **Phase 1**: Database Schema & Migration (Foundation)
- **Phase 2**: GraphQL Schema & Resolvers (API Layer)
- **Phase 3**: API Routes (Backend Services)
- **Phase 4**: Frontend Components (UI Layer)
- **Phase 5**: Context & State Management (State Layer)
- **Phase 6**: Filtering & Persistence (Integration)
- **Phase 7**: Validation & Business Logic (Rules)
- **Phase 8**: Testing (Quality Assurance)
- **Phase 9**: UI/UX Enhancements (Polish)
- **Phase 10**: Migration & Deployment (Launch)

This systematic approach ensures that each layer is properly built and tested before moving to the next, reducing risk and improving overall quality.
