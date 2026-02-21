# DingDong BMS - Database & Authentication System

## 📊 Entity Relationship Diagram (ERD)

See the rendered ERD diagram in the project documentation showing:
- **USERS** - User accounts with credentials and profile info
- **ROLES** - User roles (RENTER, LEASEHOLDER, OWNER, MANAGER)
- **PERMISSIONS** - Permissions granted by role
- **APARTMENTS** - Building units
- **BUILDINGS** - Physical buildings
- **LEASE_AGREEMENTS** - Lease contracts
- **MAINTENANCE_REQUESTS** - Work orders
- **BILLING** - Financial records

## 🔐 Authentication System

### User Credentials (Demo Accounts)

| User | Username | Password | Role | Permissions |
|------|----------|----------|------|-------------|
| John Doe | `john_renter` | `password123` | RENTER | view_billing, pay_rent, submit_maintenance, view_profile |
| Alice Chen | `alice_lease` | `leasepass456` | LEASEHOLDER | view_billing, manage_lease, manage_subtenants, view_profile |
| Mr. Owner | `mr_owner` | `owner789` | OWNER | view_assets, approve_maintenance, vote_hoa, manage_renovations, view_financials |
| Building Manager | `admin_manager` | `asade` | MANAGER | manage_users, view_all_data, approve_requests, system_config, security_override |

### Key Features

1. **Role-Based Access Control (RBAC)**
   - Each user has a `role_id` that determines their permissions
   - Roles define what dashboards and features are accessible

2. **Authentication Flow**
   - User enters username and password
   - System authenticates against mock database
   - On success, user is logged in and redirected to their portal
   - User info includes role and permissions for UI customization

3. **Secure Routing**
   - Portal pages check if user is authenticated
   - Unauthenticated users are redirected to login

## 📁 Implementation Files

### Core Files
- `lib/database.ts` - Mock database and authentication logic
- `lib/auth-context.tsx` - React Context for auth state management
- `app/layout.tsx` - Root layout with AuthProvider wrapper

### Portal Pages
- `/app/portal/renter/page.tsx` - Renter dashboard
- `/app/portal/leaseholder/page.tsx` - Leaseholder dashboard
- `/app/portal/owner/page.tsx` - Owner dashboard
- `/app/portal/manager/page.tsx` - Manager dashboard

## 🔄 How It Works

1. **Login Page (`app/page.tsx`)**
   - Displays community feed and login form
   - User enters credentials and clicks "Sign In"
   - Validates against mock user database

2. **Auth Context (`auth-context.tsx`)**
   - Manages global authentication state
   - Provides `login()`, `logout()`, and user info to entire app
   - Routes to appropriate portal based on user role

3. **Protected Portals**
   - Each portal reads user info from auth context
   - Displays role-specific information and features
   - Can enforce additional permission checks

## 🚀 Future Database Integration

To connect to a real database:

1. Replace `authenticateUser()` function in `database.ts`
2. Connect to PostgreSQL, MongoDB, or similar
3. Add password hashing with bcryptjs or similar
4. Implement JWT tokens for session management
5. Add database migration system

## 📋 Role Permissions Matrix

| Feature | RENTER | LEASEHOLDER | OWNER | MANAGER |
|---------|--------|-------------|-------|---------|
| View Own Billing | ✅ | ✅ | ✅ | ✅ |
| Pay Rent | ✅ | ✅ | ❌ | ✅ |
| Manage Lease | ❌ | ✅ | ❌ | ✅ |
| Approve Maintenance | ❌ | ❌ | ✅ | ✅ |
| Vote on HOA | ❌ | ❌ | ✅ | ✅ |
| View All Users | ❌ | ❌ | ❌ | ✅ |
| System Configuration | ❌ | ❌ | ❌ | ✅ |
