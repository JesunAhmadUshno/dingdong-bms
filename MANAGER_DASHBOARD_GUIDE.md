# Building Manager Dynamic Dashboard

## Overview

The DingDong Building Manager portal features a comprehensive, role-based dynamic dashboard system that adapts to different manager types and their specific operational needs.

## Supported Manager Roles

### 1. **Building Manager** (BUILDING_MANAGER)
**Credentials**: `admin_manager` / `asade`

**Dashboard Color**: Blue 🏢

**Key Features**:
- Daily Operations Management
- Maintenance Coordination
- Security Management
- Emergency Response
- Tenant Communications

**Display Metrics**:
- Total Properties
- Active Maintenance Requests
- Occupancy Rate
- Alert Count
- Pending Approvals

**Navigation Sections**:
- Dashboard (home)
- Maintenance (maintenance)
- Tenants (tenants)
- Security (security)
- Communications (communications)

---

### 2. **Social Housing Manager** (SOCIAL_HOUSING_MANAGER)
**Credentials**: `social_housing_mgr` / `social123`
**Full Name**: Sarah Johnson

**Dashboard Color**: Green 🏘️

**Key Features**:
- Subsidy Management
- Income Verification
- GTI Calculations
- Tenant Support Integration
- Social Impact Reporting
- Grant Management

**Display Metrics**:
- Total Tenants
- Compliance Score
- Monthly Revenue
- Active Maintenance Requests
- Pending Approvals

**Navigation Sections**:
- Dashboard (home)
- Tenants (tenants)
- Subsidies (subsidies)
- Grants (grants)
- Reporting (reporting)

---

### 3. **Corporate Property Manager** (CORPORATE_OWNER)
**Credentials**: `corporate_mgr` / `corporate456`
**Full Name**: Corporate Property Manager

**Dashboard Color**: Purple 🏗️

**Key Features**:
- Multi-Property Management
- Investment Tracking
- Staff Management
- Advanced Analytics
- Compliance Dashboard
- Bulk Tenant Management

**Display Metrics**:
- Total Properties
- Total Tenants
- Monthly Revenue
- Occupancy Rate
- Active Maintenance Requests
- Compliance Score

**Navigation Sections**:
- Dashboard (home)
- Portfolio (portfolio)
- Analytics (analytics)
- Staff (staff)
- Compliance (compliance)

---

### 4. **System Administrator** (ADMIN)
**Credentials**: `system_admin` / `admin123`

**Dashboard Color**: Red ⚙️

**Key Features**:
- User Management
- System Configuration
- Audit Logs
- Role Management
- API Management
- System Health

**Display Metrics**:
- Total Properties
- Total Tenants
- Active Maintenance Requests
- Alert Count
- Pending Approvals
- Compliance Score

**Navigation Sections**:
- Dashboard (home)
- Users (users)
- Audit Logs (audit)
- System (system)
- API (api)

---

## Dynamic Dashboard Components

### File Structure
```
app/
└── portal/
    └── manager/
        ├── page.tsx                 # Manager portal routing
        ├── layout.tsx              # Sidebar navigation layout
        ├── dashboard.tsx           # Main dynamic dashboard component
        ├── maintenance/
        │   └── page.tsx            # Maintenance management (BUILDING_MANAGER)
        ├── tenants/
        │   └── page.tsx            # Tenant management (all roles)
        ├── security/
        │   └── page.tsx            # Security controls (BUILDING_MANAGER)
        ├── communications/
        │   └── page.tsx            # Messaging system (BUILDING_MANAGER)
        ├── analytics/
        │   └── page.tsx            # Analytics dashboard (CORPORATE_OWNER)
        ├── portfolio/
        │   └── page.tsx            # Property portfolio (CORPORATE_OWNER)
        ├── staff/
        │   └── page.tsx            # Staff management (CORPORATE_OWNER)
        ├── compliance/
        │   └── page.tsx            # Compliance tracking (CORPORATE_OWNER)
        ├── subsidies/
        │   └── page.tsx            # Subsidy programs (SOCIAL_HOUSING_MANAGER)
        ├── grants/
        │   └── page.tsx            # Grant management (SOCIAL_HOUSING_MANAGER)
        ├── reporting/
        │   └── page.tsx            # Social impact reporting (SOCIAL_HOUSING_MANAGER)
        ├── users/
        │   └── page.tsx            # User management (ADMIN)
        ├── audit/
        │   └── page.tsx            # Audit logs (ADMIN)
        ├── system/
        │   └── page.tsx            # System configuration (ADMIN)
        └── api/
            └── page.tsx            # API management (ADMIN)
```

### Key Components

#### 1. **dashboard.tsx** (Dynamic Dashboard)
- **Purpose**: Main dashboard that adapts to manager role
- **Features**:
  - Role-based color-coded header
  - Dynamic metric display based on role
  - Pending approvals table
  - Quick action buttons
  - Recent activity log
  - Assigned properties sidebar

#### 2. **layout.tsx** (Manager Navigation)
- **Purpose**: Provides persistent sidebar navigation
- **Features**:
  - Role-specific menu sections
  - Active page highlighting
  - Mobile toggle support
  - Quick settings access
  - Logout button

---

## Authentication & Authorization

All manager routes are protected by role-based access control:

```typescript
const managerRoles = [
  "BUILDING_MANAGER",
  "SOCIAL_HOUSING_MANAGER", 
  "CORPORATE_OWNER",
  "ADMIN"
];

// Users must have one of these roles to access /portal/manager
```

**Session Duration**: 15 minutes with auto-renewal on activity

---

## Data Management

### User Properties
Managers can be assigned to specific properties:

```typescript
user.properties = [1, 2, 3]; // Array of property IDs
```

### Dynamic Metrics Calculation
Metrics are calculated based on:
- Assigned properties
- Total units in those properties
- Occupancy rates
- Pending requests/approvals
- Recent activity

---

## Dashboard Customization

### Adding a New Role
1. Add role entry to `ROLES` in `lib/database.ts`
2. Create role configuration in `dashboard.tsx` `ROLE_CONFIGS`
3. Create dedicated pages in `app/portal/manager/<feature>/`
4. Update `layout.tsx` `MANAGER_SECTIONS`

### Adding a New Feature
1. Create new page in `app/portal/manager/<feature>/page.tsx`
2. Add to `MANAGER_SECTIONS` for relevant role(s)
3. Define navigation in sidebar layout
4. Link from dashboard quick actions

---

## UI/UX Features

### Color Coding by Role
- **BUILDING_MANAGER**: Blue (Operations focus)
- **SOCIAL_HOUSING_MANAGER**: Green (Community focus)
- **CORPORATE_OWNER**: Purple (Portfolio focus)
- **ADMIN**: Red (System focus)

### Responsive Design
- Mobile-friendly sidebar with toggle
- Adaptive grid layouts
- Touchscreen-optimized buttons
- Dark mode support

### Status Indicators
- **Active**: Green badge
- **Pending**: Blue badge
- **Urgent**: Red badge
- **Completed**: Gray badge

---

## API Integration Points

### Session Management
```
POST /api/auth/session    - Login
GET  /api/auth/session    - Validate session
DELETE /api/auth/session  - Logout
```

### Future Integrations
- Property management APIs
- Maintenance request systems
- Tenant database integration
- Financial reporting APIs
- Compliance tracking systems

---

## Testing Credentials

### Building Manager
- **Username**: `admin_manager`
- **Password**: `asade`
- **Role**: BUILDING_MANAGER

### Social Housing Manager
- **Username**: `social_housing_mgr`
- **Password**: `social123`
- **Role**: SOCIAL_HOUSING_MANAGER
- **Name**: Sarah Johnson

### Corporate Manager
- **Username**: `corporate_mgr`
- **Password**: `corporate456`
- **Role**: CORPORATE_OWNER

### System Administrator
- **Username**: `system_admin`
- **Password**: `admin123`
- **Role**: ADMIN

---

## Performance Optimization

### Build Output
- **Status**: ✅ All pages prerendered as static content
- **Build Time**: ~2 seconds
- **Type Safety**: 0 TypeScript errors
- **All Routes**: Optimized for fast load times

### Caching
- Static pages cache as `(Static)`
- Dynamic routes render `(Dynamic)` on demand
- Dark mode assets loaded efficiently

---

## Security Measures

1. **Role-based Access Control**: Only authorized managers see their features
2. **Session Validation**: All requests require valid session tokens
3. **Audit Logging**: All manager actions logged via structured JSON logs
4. **Data Isolation**: Managers only see assigned properties
5. **HTTPS enforcement**: Secure cookies with HttpOnly flags

---

## Future Enhancements

- [ ] Real-time notifications system
- [ ] Advanced analytics charts with Chart.js
- [ ] Bulk operations for maintenance requests
- [ ] Document upload/storage integration
- [ ] Tenant portal integration
- [ ] Mobile native app
- [ ] Custom report builder
- [ ] Workflow automation engine
- [ ] Integration with property management systems
- [ ] Email/SMS notification templates

---

## Support & Documentation

**Build Status**: ✅ Successful
**Latest Build**: February 21, 2026
**Version**: 0.4.0

For more information, refer to the main README.md or contact the development team.
