# DingDong BMS - Building Management System

A comprehensive Building Management System (BMS) prototype built with modern web technologies. Manage properties, leases, occupants, maintenance, and financials all in one unified platform.

Live dashboard: https://jesunahmadushno.github.io/dingdong-bms/ (a source-level audit of this repo: role explorer, session-expiry reproduction, README claims checked against the code)

![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen.svg)

## 🎯 Features

### Core Functionality
- **Multi-role Authentication** - 11 distinct user roles with granular permissions
- **Persistent Sessions** - 15-minute session timeout with automatic restoration
- **Real SQLite Database** - File-based SQLite for reliable data persistence
- **Role-based Portals** - Customized dashboards for Renters, Leaseholders, Owners, and Admins
- **User Management** - Complete user lifecycle management with profile customization
- **Property Management** - Create, list, and manage multiple properties
- **Lease Management** - Track lease agreements with terms and conditions
- **Occupant Management** - Register and manage occupants/subtenants with CRUD operations
- **Maintenance Tracking** - Submit, track, and resolve maintenance requests
- **Financial Reporting** - Monitor rent payments, utilities, and expenses
- **Document Management** - Store and organize building documents

### Technical Highlights
- ✅ **Type-Safe** - Full TypeScript support across frontend and backend
- ✅ **API-Driven Architecture** - RESTful APIs for all operations
- ✅ **Data Persistence** - SQLite database with schema management
- ✅ **Real-time Updates** - Dynamic data loading and refresh
- ✅ **Responsive Design** - Mobile-friendly Tailwind CSS styling
- ⚠️ **Prototype** - no committed build log or benchmark yet; see [Known issues](#known-issues)

## Start here

1. Follow the Quick Start below. The app runs at
   `http://localhost:3000`.
2. Log in with the demo LEASEHOLDER account below. Open the
   Leaseholder dashboard and walk its 6 tabs.
3. Add an occupant. Refresh the page. The occupant is still there:
   that round trip is the SQLite persistence proof.
4. Read `ARCHITECTURE.md` and `DATABASE_AND_AUTH.md` for the design.

## Facts

| Item | Value |
| :--- | :--- |
| Version | 0.3.0 |
| User roles | 11 |
| Session timeout | 15 minutes intended, with restore on refresh (see Known issues) |
| Frontend files | 51 `.tsx` files under `web/` |
| Docs | 33 markdown files, most of them role and manager guides |
| Database | One SQLite file, created on first run |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/JesunAhmadUshno/dingdong-bms.git
cd dingdong-bms/web

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Demo Credentials

```
LEASEHOLDER:
  Username: alice_lease
  Password: leasepass456
  Property: 456 King Ave

ADMIN:
  Username: system_admin
  Password: admin123

OWNER:
  Username: mr_owner
  Password: owner789

RENTER:
  Username: john_renter
  Password: password123
```

## Screens

Screenshot slots. No screenshots ship in this repo yet. Capture each
screen from the running app and save it at the path shown.

- SLOT `docs/screens/login.png`: the login page.
- SLOT `docs/screens/leaseholder-dashboard.png`: the Leaseholder
  dashboard, Overview tab.
- SLOT `docs/screens/occupants.png`: the Occupants tab with the add
  form open.
- SLOT `docs/screens/admin-dashboard.png`: the Admin dashboard.
- SLOT `docs/screens/renter-portal.png`: the Renter portal home.

## 📁 Project Structure

```
dingdong-bms/
├── web/                           # Next.js frontend application
│   ├── app/
│   │   ├── api/                  # API route handlers
│   │   │   ├── auth/session/     # Session management API
│   │   │   └── occupants/        # Occupant CRUD API
│   │   ├── portal/               # Role-based portals
│   │   │   ├── admin/            # Admin dashboard
│   │   │   ├── leaseholder/      # Leaseholder dashboard (6 tabs)
│   │   │   ├── owner/            # Owner dashboard
│   │   │   └── renter/           # Renter portal
│   │   └── page.tsx              # Home page
│   ├── lib/
│   │   ├── auth-context.tsx      # Global auth state management
│   │   ├── database.ts           # User and role definitions
│   │   └── db.ts                 # SQLite database initialization
│   ├── data/                     # SQLite database file (generated)
│   │   └── dingdong.db           # Primary database
│   ├── package.json              # Dependencies and scripts
│   ├── tests/                    # Dependency-free smoke tests (npm test)
│   ├── tsconfig.json             # TypeScript configuration
│   └── .gitignore                # Git ignore rules
├── site/                          # Live dashboard (Vite + React, GitHub Pages)
└── docs/                          # Research review
```

## 🔧 Development

### Build the project
```bash
cd web && npm run build
```

### Start production server
```bash
cd web && npm run start
```

### Run linter
```bash
cd web && npm run lint
```

## 📊 Database Schema

### Sessions Table
Manages user session state with 15-minute expiration:
- `session_id` - 32-byte cryptographic random identifier (PRIMARY KEY)
- `user_id` - Reference to user
- `username`, `email`, `full_name`, `phone` - Session user details
- `role_id`, `role_name` - User's role information
- `properties` - JSON array of accessible properties
- `created_at`, `expires_at` - Timestamp fields

### Occupants Table
Stores resident and subtenant information:
- `occupant_id` - Auto-increment primary key
- `lease_id`, `property_id`, `unit_id` - Property references
- `name`, `email`, `phone` - Contact information
- `relationshipToLeaseholder` - Occupant type
- `registrationDate` - When occupant was registered
- `status` - Active/Inactive status
- `created_at` - Database timestamp

### Maintenance Requests Table
Tracks maintenance issues and repairs:
- `id` - Auto-increment primary key
- `lease_id`, `property_id`, `unit_number` - Property references
- `description` - Issue description
- `status` - Pending/In Progress/Completed
- `priority` - Low/Medium/High
- `submittedDate`, `completedDate` - Timestamps
- `created_at` - Database timestamp

## 🔐 Authentication & Sessions

### Session Flow
1. User logs in with credentials
2. Backend validates against USERS array
3. Session created in SQLite with 15-minute expiry
4. Session ID returned to frontend
5. Frontend stores session ID in localStorage
6. Page refresh restores session automatically
7. Session ID sent in `x-session-id` header for API calls
8. Server validates expiration before each request
9. Automatic logout after 15 minutes of inactivity

## 🎨 Leaseholder Dashboard Features

### 6-Tab Interface
1. **Overview** - Quick stats and dashboard summary
2. **Leases** - Lease agreement details and terms
3. **Occupants** - Resident management with add/remove functionality
4. **Financials** - Rent tracking, utilities, expense reports
5. **Maintenance** - Submit and track maintenance requests
6. **Documents** - Upload, organize, and manage building documents

### Data Persistence
- All occupant data persists to SQLite database
- Changes sync immediately to UI
- Data survives page refreshes via API
- Auto-loads on dashboard initialization

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/session          Create session (login)
GET    /api/auth/session          Validate session
DELETE /api/auth/session          Delete session (logout)
```

### Occupants
```
GET    /api/occupants?property_id=2     Fetch occupants
POST   /api/occupants                    Create occupant
PUT    /api/occupants                    Update occupant
DELETE /api/occupants?occupant_id=1     Delete occupant
```

## 🧪 Testing

### Smoke tests
`cd web && npm test` runs dependency-free checks (Node 22.13+): seed-data
consistency and the session-expiry comparison in SQLite. CI runs them on
every push to master.

### Manual Testing Checklist
- [ ] Login with alice_lease / leasepass456
- [ ] Navigate to Leaseholder Dashboard
- [ ] Verify occupants load from database
- [ ] Add new occupant and confirm persistence
- [ ] Refresh page (F5) and confirm occupant still visible
- [ ] Wait 15 minutes and confirm auto-logout
- [ ] Test with different user roles

## 📈 Performance

Not measured: no benchmark script or recorded output exists in this repo yet,
so treat these figures as targets, not results.

- Session creation: ~20ms
- Occupant list load: ~5ms
- Page refresh: <2 seconds
- Database file size: ~100KB (scales with data)
- SQLite WAL mode enabled for concurrent access

## 🔄 Version History

### v0.3.0 (Current)
- ✨ SQLite database implementation
- ✨ Persistent session management (15 minutes)
- ✨ Complete occupant CRUD API
- ✨ Session restoration on page refresh
- ✨ Database seeding with sample data
- 🐛 Fixed data persistence issues
- 🐛 Fixed auto-logout on refresh

### v0.2.0
- User management portal
- Profile customization
- Admin dashboard basics
- Documentation updates

### v0.1.0
- Initial project setup
- 11 role-based system
- Basic authentication
- Foundation portals

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports & Feature Requests

Found a bug? Want a new feature? Please open an issue on GitHub with appropriate templates.

## Known issues

Found by a source review; details and fix costs in [docs/research-review.md](docs/research-review.md).

- **Sessions outlive 15 minutes.** `expires_at` is stored as an ISO string and
  compared as text with SQLite's `datetime('now')`, so a session stays valid until
  the next UTC midnight. Reproduced in `web/tests/smoke.test.mjs` and on the live dashboard.
- **The occupant API most likely returns 401** (traced from source, not run):
  `validateSession` reads cookies nothing sets, queries `sessions.id` (the key is
  `session_id`) and opens `./dingdong.db` instead of `data/dingdong.db`.
- **Role permissions are not enforced server-side**, and the session row stores
  `role_name = 'USER'` for roles 5 to 10.
- **Logins use plaintext passwords** from the in-memory `USERS` array.

## 📞 Support

Open an issue on GitHub. There is no dedicated email, chat or docs site yet.

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [SQLite](https://www.sqlite.org/)
- Type safety from [TypeScript](https://www.typescriptlang.org/)

---

**Happy building! 🏢**

*Last Updated: February 20, 2026*
*Current Version: 0.3.0*
