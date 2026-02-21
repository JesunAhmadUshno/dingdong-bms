# DingDong - Building Management System (BMS)

A comprehensive, Canadian housing standards-compliant Building Management System built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

## 🏢 System Overview

DingDong supports a complete Canadian housing ecosystem with:

- **10 User Role Types**: From renters to government authorities
- **5 Property Types**: Private rental, affordable housing, shelter, co-op, and senior housing
- **Role-Based Access Control**: Granular permissions per role
- **Multi-Property Portfolio Management**: Owners can manage 2-4 properties
- **Canadian Compliance**: AODA, PIPEDA, Residential Tenancies Act adherence

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Demo Credentials

### Role-Based Test Users (7 Total)

| User Type | Username | Password | Portal | Role | Features |
|-----------|----------|----------|--------|------|----------|
| **System Admin** | `system_admin` | `admin123` | `/portal/admin` | ADMIN | User management, create/edit/delete users |
| **Renter** | `john_renter` | `password123` | `/portal/renter` | RENTER | View billing, pay rent, submit maintenance |
| **Leaseholder** | `alice_lease` | `leasepass456` | `/portal/leaseholder` | LEASEHOLDER | Manage lease, register occupants, view financials |
| **Property Owner** | `mr_owner` | `owner789` | `/portal/owner` | OWNER | Manage 3 properties, screen tenants, collect rent |
| **Corporate Manager** | `corporate_mgr` | `corporate456` | `/portal/corporate_owner` | CORPORATE_OWNER | Manage staff, view properties, add building managers |
| **Building Manager** | `admin_manager` | `asade` | `/portal/manager` | BUILDING_MANAGER | Coordinate maintenance, manage security, daily ops |
| **Social Housing Manager** | `social_housing_mgr` | `social123` | `/portal/manager` | SOCIAL_HOUSING_MANAGER | Manage subsidies, verify income, GTI calculations |

### Accessing Your Profile

All users can access `/portal/profile` to:
- **View**: Username, Full Name, User ID, SIN/BN, Role, Status (read-only)
- **Edit**: Email address, phone number, password (protected fields)

## 📊 Database Schema

### User Roles (10 Types)

1. **RENTER** - Short-term private rental occupant
2. **LEASEHOLDER** - Long-term leaseholder (individual or corporate)
3. **OWNER** - Individual property owner (up to 4 properties)
4. **CORPORATE_OWNER** - Corporate real estate company
5. **COOP_MEMBER** - Co-op housing member (voting rights)
6. **SHELTER_RESIDENT** - Emergency/shelter housing resident
7. **SOCIAL_HOUSING_MANAGER** - Non-profit housing organization
8. **BUILDING_MANAGER** - Superintendent/building manager
9. **SUPPORT_SERVICES** - Social worker, counselor, support provider
10. **GOVERNMENT_AUTHORITY** - Municipal/provincial housing authority
11. **ADMIN** - System administrator

### Property Types (5 Categories)

| Type | Regulation | Rent Model | Support Services |
|------|-----------|-----------|-----------------|
| **Private Rental** | Residential Tenancies Act | Market rate | None |
| **Affordable Housing** | Housing Act | Geared-to-Income (30% max) | Counseling, job training, childcare |
| **Shelter Housing** | Homelessness Act | Free/minimal cost | Case management, mental health, emergency response |
| **Co-op Housing** | Cooperatives Act | Member-determined | Communal maintenance, member events |
| **Senior Housing** | Accessibility for Seniors Act | Market/subsidized | Health services, meal programs, transportation |

### Sample Data

**Multi-Property Owner Example** (`mr_owner`):
```
Property 1: 123 Main Street, Toronto
  Type: Private Rental (12 units)
  Market Value: $2.5M
  Occupants: 12 renters
  
Property 2: 456 King Avenue, Toronto  
  Type: Affordable Housing (8 units)
  Market Value: $1.8M
  Funding: CMHC subsidy + Non-profit grant
  Occupants: Geared-to-income residents
  
Property 3: 789 Queen Street, Toronto
  Type: Co-op Housing (20 units)
  Market Value: $3.2M
  Occupants: Co-op members (voting rights)
```

## 🔑 Features by Role

### 👤 System Admin
- ✅ Create, edit, delete users
- ✅ Assign roles to users
- ✅ Manage user status (verified, pending, etc.)
- ✅ View all users with filtering by role
- ✅ Dashboard with user statistics
- ✅ Full system configuration access

### 👥 Corporate Owner / Staff Manager
- ✅ Add and manage building managers
- ✅ Add support services staff
- ✅ Edit staff information
- ✅ Remove staff members
- ✅ View managed properties
- ✅ Dashboard with staff statistics

### Renter
- ✅ View billing and rent due dates
- ✅ Pay rent online (UI placeholder)
- ✅ Submit maintenance requests
- ✅ View lease agreement details
- ✅ Update profile information (email, phone, password)

### Leaseholder
- ✅ All renter features
- ✅ Manage sub-tenants
- ✅ View financial reports
- ✅ Register additional occupants
- ✅ Edit personal profile

### Property Owner
- ✅ Dashboard showing 2-4 properties
- ✅ Screen and approve tenants
- ✅ View property valuation and assets
- ✅ Approve maintenance requests
- ✅ Collect rent and view financials
- ✅ Manage renovations and upgrades
- ✅ Access tax and investment reports
- ✅ Manage personal profile

### Building Manager
- ✅ Oversee daily building operations
- ✅ Coordinate maintenance across properties
- ✅ Security and emergency management
- ✅ Tenant communications
- ✅ System configuration (admin panel)
- ✅ View all properties and tenants
- ✅ Edit personal profile

### Social Housing Manager
- ✅ Manage subsidies (geared-to-income calculations)
- ✅ Verify tenant income and eligibility
- ✅ GTI adjustment tracking
- ✅ Integration with support services
- ✅ Social impact reporting
- ✅ Grant management and compliance
- ✅ Edit personal profile

## 📁 Project Structure

```
/web
├── app/
│   ├── page.tsx                 # Landing page with login form
│   ├── layout.tsx               # Root layout (AuthProvider wrapper)
│   └── portal/
│       ├── admin/page.tsx       # ⭐ Admin user management portal
│       ├── renter/page.tsx      # Renter dashboard
│       ├── leaseholder/page.tsx # Leaseholder dashboard
│       ├── owner/page.tsx       # Owner dashboard
│       ├── corporate_owner/page.tsx # ⭐ Corporate owner staff management
│       ├── manager/page.tsx     # Building/Social Housing manager dashboard
│       └── profile/page.tsx     # ⭐ User profile management (all roles)
├── lib/
│   ├── database.ts              # Mock database, interfaces, auth logic
│   │                            # - 11 roles with permissions
│   │                            # - 5 property types
│   │                            # - 7 demo users
│   │                            # - User management functions
│   │                            # - Profile update restrictions
│   │
│   └── auth-context.tsx         # React Context for authentication
│                                # - Global auth state
│                                # - Login/logout logic
│                                # - useAuth() hook
│   │                            # - 3 sample properties
│   │                            # - 4 sample units
│   │                            # - 2 sample leases
│   ├── auth-context.tsx         # Global auth state (React Context API)
├── public/                       # Static assets
└── README.md                     # Next.js docs (keep original)
```

## 🔄 Authentication Flow

1. **User enters credentials** on landing page login form
2. **System validates** username/password against `USERS` array
3. **If successful**, auth context updates with user data + role + permissions
4. **Redirect to portal** based on role (e.g., `/portal/renter`)
5. **Protected routes** verify `isAuthenticated` and `role.role_name`
6. **Unauthorized access** redirects back to home page
7. **Logout button** clears auth context and returns to landing page

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with responsive design
- **State Management**: React Context API (authentication + user data)
- **Database**: Mock in-memory object arrays (SQLite/PostgreSQL planned)
- **Deployment**: Vercel-ready (static export capability)

## 📋 Compliance Standards

✅ **AODA** (Accessibility for Ontarians with Disabilities Act)
- Universal design principles in UI
- Accessibility requirements per property type
- Support for accessibility features:
  - `wheelchair_accessible`
  - `visual_aid` (visual aids)
  - `service_animal_friendly`

✅ **PIPEDA** (Personal Information Protection & Electronic Documents Act)
- Secure storage of legal identifiers (SIN/BN)
- Emergency contact protection
- Reference information privacy
- Profile data only visible to authorized users

✅ **Residential Tenancies Act (Ontario)**
- Rent increase limits enforcement (2.5% annual max example)
- Lease agreement standardization
- Tenant rights protection in system

✅ **Housing Act (Provincial)**
- Geared-to-Income calculation (30% of household income max)
- Affordability tracking by property type
- Subsidy management for social housing

## 🚧 Development Roadmap

### Phase 1: ✅ Complete
- [x] Next.js scaffolding with TypeScript
- [x] Social media-style landing page
- [x] Authentication system (5 demo users)
- [x] Role-based portal structure (4 portals)
- [x] Protected routes with auth checks
- [x] Comprehensive user role definitions (10 types + ADMIN)
- [x] Property type classification (5 types)
- [x] Multi-property ownership scenarios
- [x] Database schema with TypeScript interfaces

### Phase 2: 🚀 In Progress
- [ ] Mock seed data for all 10 user types (20+ demo users)
- [ ] Property management dashboard (owner portfolio view)
- [ ] Lease agreement templates and signing
- [ ] Unit/property listing and search

### Phase 3: 📅 Planned
- [ ] Real database integration (PostgreSQL)
- [ ] Password hashing (bcrypt) & JWT tokens
- [ ] Email notifications
- [ ] Tenant application/screening workflows
- [ ] Digital document signing (e-signature integration)
- [ ] Income verification system
- [ ] Case management for shelter/social housing
- [ ] Co-op voting system
- [ ] Mobile app (React Native)
- [ ] Multi-language support (French for Quebec)
- [ ] Compliance audit reports

## 🔒 Security Notes

⚠️ **Current Development Status**:
- Passwords stored as **plain text** (development only)
- No JWT or session tokens
- All data stored in memory (resets on server restart)
- Mock authentication logic

🔐 **Required for Production**:
- bcrypt password hashing (minimum 12 rounds)
- JWT token-based authentication
- HTTPS/TLS encryption for all traffic
- PostgreSQL or MongoDB (persistent storage)
- Rate limiting on login endpoints (max 5 attempts)
- CORS configuration and CSRF protection
- SQL injection prevention
- Input validation and sanitization
- Regular security audits

## 📚 Additional Documentation

See the following files for more detailed information:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design, module organization, event-driven patterns
- **[DATABASE_AND_AUTH.md](./DATABASE_AND_AUTH.md)** - Database schema details, authentication flow, permission matrix
- **[USER_AND_PROPERTY_SCHEMA.md](./USER_AND_PROPERTY_SCHEMA.md)** - Comprehensive user types (10+), property models, regulatory compliance, multi-property scenarios

## 🧪 Testing

To test different roles:

1. Start the dev server: `npm run dev`
2. Log in with different demo credentials (see table above)
3. Verify role-specific features are visible
4. Test logout and re-login flow
5. Check for "Not Found" redirects on unauthorized access

Example test flow:
```
1. Login as john_renter
   - Should see: Rent billing, maintenance form
   - Should NOT see: Property management, tenant screening
   
2. Login as mr_owner
   - Should see: 3 properties, tenant screening, approvals
   - Should NOT see: Rent due, personal lease details
   
3. Try to access /portal/owner without login
   - Should redirect to home page automatically
```

## 📞 Support

For questions or issues:
1. Check the documentation files listed above
2. Review the inline code comments in `lib/database.ts`
3. Open an issue in the repository

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Last Updated**: 2025-01-15  
**Version**: 0.2.0 (Comprehensive Schema Implementation)
