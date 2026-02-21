# Database & Session Implementation Summary

## Changes Made (February 17, 2026)

### 1. **Real Database Setup (SQLite)**
- **File**: `lib/db.ts`
- **Database**: SQLite file-based database stored in `data/dingdong.db`
- **Tables Created**:
  - `sessions` - User session data with 15-min expiration
  - `occupants` - Occupant/resident records (persistent across refreshes)
  - `maintenance_requests` - Maintenance ticket tracking

### 2. **Session Management (15-minute persistence)**
- **Endpoints**: `/api/auth/session` (POST, GET, DELETE)
- **Session Storage**: localStorage (`dingdong_session_id`)
- **Features**:
  - Login creates session (15 minutes valid)
  - Session restored on page refresh from localStorage
  - Auto-logout when session expires
  - Secure session ID generation (crypto.randomBytes)

### 3. **Updated Authentication Context** (`lib/auth-context.tsx`)
- ✅ Checks localStorage for existing sessions on app mount
- ✅ Persists sessionId across page refreshes
- ✅ Calls API for session validation
- ✅ Restores full user state after refresh
- ✅ Sends sessionId with all API requests

### 4. **Occupant Data API Routes** (`/api/occupants`)
- `GET` - Fetch occupants by property/unit/lease
- `POST` - Create new occupant (saves to SQLite)
- `PUT` - Update occupant details
- `DELETE` - Remove occupant

### 5. **Leaseholder Dashboard Updates** (`app/portal/leaseholder/page.tsx`)
- ✅ Calls API instead of in-memory database
- ✅ Loads occupants from SQLite on component mount
- ✅ Add/Remove occupants persists to database
- ✅ Data survives page refreshes

## How It Works

### Login Flow
```
1. User enters credentials
2. POST /api/auth/session { username, password }
3. API validates and creates session in SQLite
4. Returns sessionId + user data
5. Client stores sessionId in localStorage
6. Auth context restores on refresh
```

### Session Persistence (15 minutes)
```
User logs in → sessionId stored in localStorage
↓
Page refresh → Auth context checks localStorage
↓
If session exists & not expired → Auto-login
↓
If session expired (>15 min) → Auto-logout, clear localStorage
```

### Occupant Storage
```
Before: Occupants only in React state (lost on refresh)
After: SQLite database + API routes (persistent)

Add Occupant Flow:
1. Form submission → POST /api/occupants
2. API saves to SQLite database
3. Page refresh → GET /api/occupants loads from SQLite
4. ✅ Data persists!
```

## Testing

### Test Default Users
- **Admin**: `system_admin` / `admin123`
- **Leaseholder**: `alice_lease` / `leasepass456`
- **Owner**: `owner` / `owner789`

### Test Session Persistence
1. Log in as `alice_lease`
2. Add an occupant
3. **Refresh the page** → You should stay logged in
4. Check occupants table → New occupant should still be there
5. Wait 15 minutes → Session should auto-expire and logout

### Test Occupant CRUD
1. Add occupant → POST /api/occupants (saves to SQLite)
2. Refresh page → GET /api/occupants (loads from SQLite)
3. Remove occupant → DELETE /api/occupants (deletes from SQLite)
4. All data persists across refreshes!

## Database File Location
- Development: `web/data/dingdong.db`
- SQLite file created automatically on first app run
- Gitignore rules prevent committing database file

## Files Modified
1. `lib/db.ts` - **NEW** SQLite database setup
2. `lib/auth-context.tsx` - Session persistence
3. `app/portal/leaseholder/page.tsx` - API integration
4. `app/api/auth/session/route.ts` - **NEW** Session API
5. `app/api/occupants/route.ts` - **NEW** Occupant CRUD API
6. `.gitignore` - Exclude database files

## Next Steps
- Run `npm run dev` to start development server
- Test login/logout and session persistence
- Verify data persists across page refreshes
- Add similar API routes for other entities (maintenance, financial data)
