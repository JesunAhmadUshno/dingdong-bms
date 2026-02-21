# DingDong Database Schema & Implementation Guide

## 📋 Table of Contents

1. [Database Overview](#database-overview)
2. [User Roles (10 Types)](#user-roles-10-types)
3. [User Profiles & Data](#user-profiles--data)
4. [Property Types (5 Models)](#property-types-5-models)
5. [Properties & Units](#properties--units)
6. [Lease Agreements](#lease-agreements)
7. [Role-Based Permissions](#role-based-permissions)
8. [Multi-Property Scenarios](#multi-property-scenarios)
9. [Compliance Mapping](#compliance-mapping)
10. [Mock Data Walkthrough](#mock-data-walkthrough)

---

## Database Overview

The DingDong system uses a **hierarchical, role-based access model** where:

```
Users (11 types) → Roles (with permissions) → Properties (5 types) → Units → Leases
                                           ↓
                                      Profiles (detailed user info)
```

### Current Implementation

- **Storage**: In-memory JavaScript objects (arrays in `lib/database.ts`)
- **Language**: TypeScript interfaces for type safety
- **Scaling**: Each user type has direct access to relevant entities
- **Security**: Basic validation (no hashing/encryption yet)

---

## User Roles (10 Types)

### Complete Role Hierarchy

```typescript
// Role Structure
interface Role {
  role_id: number;
  role_name: string;           // Enum: RENTER | LEASEHOLDER | OWNER | etc.
  description: string;         // Human-readable description
  category: string;           // "Occupant" | "Owner" | "Manager" | "Support" | "Government"
  permissions: string[];      // Actions they can perform
}
```

### 1. **RENTER** (role_id: 1) - Category: Occupant

**Description**: Short-term private rental occupant

**Permissions**:
- `view_billing` - See rent due dates and amounts
- `pay_rent` - Make rent payments
- `submit_maintenance` - Request repairs/maintenance
- `view_profile` - View own profile information
- `view_lease` - View lease agreement details

**Accessibility Level**: Basic
- Can view own unit information
- Cannot access other units or properties
- Notifications: Rent reminders, maintenance status

**Use Cases**:
- College student renting a 2-bedroom apartment
- Young professional in private rental building
- Temporary housing occupant

---

### 2. **LEASEHOLDER** (role_id: 2) - Category: Occupant

**Description**: Long-term leaseholder (individual or corporate)

**Permissions**:
- All RENTER permissions
- `manage_lease` - Modify lease terms (with approval)
- `manage_subtenants` - Register and manage sub-tenants
- `view_financial_reports` - View lease financial summaries
- `register_occupants` - Add family members to lease

**Accessibility Level**: Enhanced
- Can manage lease-related entities
- Can view sub-tenant information
- Income verification required

**Use Cases**:
- Corporation leasing office space
- Family leasing single-family home longterm
- Investor sub-leasing property

---

### 3. **OWNER** (role_id: 3) - Category: Owner

**Description**: Individual property owner (2-4 properties)

**Permissions**:
- `manage_properties` - View and edit property details
- `screen_tenants` - Review tenant applications
- `view_assets` - View property valuations
- `approve_maintenance` - Authorize maintenance work
- `collect_rent` - Receive rent payments
- `manage_renovations` - Plan and track upgrades
- `view_financials` - View income and expenses
- `access_tax_reports` - Export for accounting

**Accessibility Level**: Administrator (per property)
- Multi-property dashboard
- Tenant screening interface
- Financial reporting
- Maintenance approval workflow

**Profile Data**:
- Annual income from properties
- Employment status: "Real Estate Investor"
- SIN for tax purposes
- Bank details for rent collection
- Emergency contacts: Spouse, business partner

**Use Cases**:
- Individual owning 3 rental properties
- Married couple with joint property ownership
- Retired person with investment properties

---

### 4. **CORPORATE_OWNER** (role_id: 4) - Category: Owner

**Description**: Corporate real estate company

**Permissions**:
- All OWNER permissions
- `manage_multiple_properties` - 10-100+ properties
- `hierarchical_staffing` - Invite staff members
- `bulk_tenant_management` - Batch operations
- `advanced_analytics` - ROI and market analysis
- `compliance_dashboard` - Regulatory reporting
- `investment_tracking` - Multi-year analysis
- `staff_management` - Assign roles to employees

**Accessibility Level**: Enterprise Administrator
- Multi-company structure
- Staff hierarchy and delegation
- API access for integrations
- Advanced reporting and analytics

**Profile Data**:
- Business number (BN) for CRA
- Corporation legal name
- Annual corporate revenue
- Contact: CFO, Legal counsel, Property manager
- Banking details for multiple accounts

**Use Cases**:
- REIT (Real Estate Investment Trust)
- Large property management company
- Commercial real estate developer

---

### 5. **COOP_MEMBER** (role_id: 5) - Category: Occupant

**Description**: Co-op housing member with voting rights

**Permissions**:
- `vote_on_decisions` - Vote on building governance
- `view_financial_transparency` - See budget and finances
- `request_maintenance` - Submit work orders
- `manage_move_rights` - Track equity/rights
- `access_member_board` - Member board communications

**Accessibility Level**: Member-Governance
- Democratic voting on issues
- Transparent financial access
- Member-to-member communication
- Rights and equity tracking

**Profile Data**:
- Co-op membership number
- Equity share percentage
- Move-in date
- Voting history
- Committee roles (if any)

**Lease Type**: COOP (member purchase, not rental)

**Use Cases**:
- Member of Toronto Co-housing Co-op
- Montreal multi-member housing collective
- Community land trust participant

---

### 6. **SHELTER_RESIDENT** (role_id: 6) - Category: Occupant

**Description**: Emergency shelter or temporary housing resident

**Permissions**:
- `access_basic_services` - View available services
- `contact_case_manager` - Message case worker
- `request_support` - Request assistance

**Accessibility Level**: Basic with Support
- Limited to requesting support
- Direct communication with case manager
- Access to resources and referrals
- Emergency contact information

**Profile Data**:
- Case manager assignment
- Basic medical information
- Emergency contact (family/next of kin)
- Support service history
- Safety notes (mental health, substance use, domestic violence)

**Lease Type**: SHELTER (free or subsidized)
**Support Services**: Case management, mental health, addiction support, emergency response

**Use Cases**:
- Homeless individual in emergency shelter
- Family fleeing domestic violence
- Person in transitional housing program

---

### 7. **SOCIAL_HOUSING_MANAGER** (role_id: 7) - Category: Manager

**Description**: Non-profit organization managing affordable housing

**Permissions**:
- `manage_subsidies` - GTI calculations and adjustments
- `verify_income` - Confirm tenant income for eligibility
- `gti_calculations` - Calculate rent based on income (30% threshold)
- `tenant_support_integration` - Connect residents to services
- `social_impact_reporting` - Track outcomes
- `grant_management` - Manage funding sources

**Accessibility Level**: Organization Administrator
- Multi-property oversight
- Tenant subsidy calculations
- Support service coordination
- Impact and compliance reporting

**Profile Data**:
- Organization name and CRA registration
- Board members and staff
- Service capacity and specialties
- Grant funding sources
- Performance metrics

**Use Cases**:
- Toronto Parkdale Community Land Trust
- Vancouver Housing Centre non-profit
- Montreal affordable housing collective

---

### 8. **BUILDING_MANAGER** (role_id: 8) - Category: Manager

**Description**: Superintendent/Building Manager (daily operations)

**Permissions**:
- `daily_operations` - Manage routine building tasks
- `coordinate_maintenance` - Schedule and track repairs
- `security_management` - Access control, incident logs
- `emergency_response` - Handle building emergencies
- `tenant_communications` - Send announcements

**Accessibility Level**: Manager (all buildings assigned)
- Dashboard for assigned properties
- Maintenance scheduling
- Tenant directory
- Emergency action plans
- Incident reporting

**Profile Data**:
- Employment start date
- Certifications (first aid, electrical, plumbing licenses)
- Contact for emergencies
- Assigned buildings/units
- Work schedule preferences

**Use Cases**:
- Building superintendent in 50-unit residential building
- Property manager for shopping center
- Facilities manager in office tower

---

### 9. **SUPPORT_SERVICES** (role_id: 9) - Category: Support

**Description**: Social worker, counselor, or support services provider

**Permissions**:
- `case_management` - Manage resident cases
- `schedule_appointments` - Book support sessions
- `confidential_notes` - Document interactions (with privacy)
- `service_linking` - Connect residents to external services
- `outcome_tracking` - Monitor resident progress

**Accessibility Level**: Specialist (access to assigned cases)
- Case-specific information (confidential)
- Appointment scheduling
- Outcome measurement
- Service coordination with partners

**Profile Data**:
- Professional credentials (MSW, RCC, etc.)
- Certifications (trauma-informed, substance abuse, etc.)
- Languages spoken
- Client demographics served
- Partner organizations for referrals

**Use Cases**:
- Social worker in shelter supporting residents
- Mental health counselor in supportive housing
- Addiction specialist in recovery program

---

### 10. **GOVERNMENT_AUTHORITY** (role_id: 10) - Category: Government

**Description**: Municipal or provincial housing authority

**Permissions**:
- `manage_waitlists` - Maintain subsidized housing wait lists
- `subsidy_administration` - Distribute funding
- `policy_enforcement` - Ensure regulatory compliance
- `public_reporting` - Generate mandatory reports
- `digital_identity_verification` - Verify SIN/ID

**Accessibility Level**: Government Administrator
- Province-wide or city-wide data
- Regulatory compliance dashboard
- Statistical reporting
- Waitlist management system
- Audit trail access

**Use Cases**:
- Toronto Housing Secretariat
- BC Housing Management Commission
- Ontario Ministry of Housing

---

### 11. **ADMIN** (role_id: 11) - Category: Government

**Description**: System administrator (all system access)

**Permissions** (All admin operations):
- `manage_users` - Create, modify, deactivate users
- `view_all_data` - Access all system information
- `approve_requests` - System-wide approval authority
- `system_config` - Configure system settings
- `security_override` - Emergency auth bypass
- `audit_logs` - View all system activity

**Accessibility Level**: Superuser
- Full system access
- User management
- System configuration
- Security monitoring
- Backup/restore operations

**Use Cases**:
- DingDong system administrator
- Platform support team
- Technical operations staff

---

## User Profiles & Data

### User Interface

```typescript
interface User {
  user_id: number;
  username: string;                    // Unique login identifier
  password: string;                    // (Hashed in production)
  email: string;
  full_name: string;
  legal_sin_or_bn: string;            // SIN for individuals, BN for corporations
  phone: string;
  role_id: number;                    // FK to ROLES
  profile_type: "Individual" | "Corporate" | "NGO" | "Government";
  status: "verified" | "pending" | "inactive";
  properties: number[];               // Array of property IDs (for owners)
  created_at: string;                // ISO timestamp
}
```

### UserProfile Interface (Extended Data)

```typescript
interface UserProfile {
  profile_id: number;
  user_id: number;                    // FK to USERS
  profile_type: string;               // Mirrors User.profile_type
  legal_entity_type: string;         // "Person", "Corporation", "Non-profit", etc.
  annual_income: number;             // From all sources
  employment_status: string;         // "Employed", "Self-employed", "Retired", etc.
  marital_status: string;            // For individuals
  dependents: number;                // Number of dependents (children, etc.)
  emergency_contacts: string[];      // Names and phone numbers
  accessibility_needs: string;       // "Wheelchair accessible", "Hearing aids", etc.
  indigenous_status: string;         // For AODA and service provision
  credit_history: string;            // "Good", "Fair", "Poor" (from external verification)
  references: string[];              // Previous landlords, employers
  verified_at: string;               // Date profile was verified
}
```

### Sample User Records

```typescript
// Example 1: Short-term Renter
{
  user_id: 1,
  username: "john_renter",
  password: "password123",
  email: "john@example.com",
  full_name: "John Doe",
  legal_sin_or_bn: "123-45-6789",     // SIN
  phone: "416-555-0001",
  role_id: 1,                         // RENTER
  profile_type: "Individual",
  status: "verified",
  properties: [],                     // Not an owner
  created_at: "2025-01-15T00:00:00Z"
}

// Example 2: Multi-Property Owner
{
  user_id: 3,
  username: "mr_owner",
  password: "owner789",
  email: "owner@property.com",
  full_name: "Mr. Property Owner",
  legal_sin_or_bn: "456-78-9123",     // SIN
  phone: "416-555-0003",
  role_id: 3,                         // OWNER
  profile_type: "Individual",
  status: "verified",
  properties: [1, 2, 3],              // Owns 3 properties!
  created_at: "2023-01-01T00:00:00Z"
}

// Example 3: Corporate Entity
{
  user_id: 2,
  username: "alice_lease",
  password: "leasepass456",
  email: "alice@corporate.com",
  full_name: "Alice Chen",
  legal_sin_or_bn: "987-65-4321",     // Could be CN for corporation
  phone: "416-555-0002",
  role_id: 2,                         // LEASEHOLDER
  profile_type: "Corporate",
  status: "verified",
  properties: [],
  created_at: "2024-06-01T00:00:00Z"
}
```

---

## Property Types (5 Models)

Each property type has distinct regulatory requirements and support services.

### Property Type Interface

```typescript
interface PropertyType {
  type_id: number;
  type_name: string;                    // Fixed enum
  regulation_framework: string;         // Legal source
  rent_control_policy: string;         // How rent is determined
  max_occupants_per_unit: number;     // Safety limit
  accessibility_requirements: string;  // AODA standards
  support_services_included: string[];// Available services
}
```

### Type 1: PRIVATE_RENTAL

```typescript
{
  type_id: 1,
  type_name: "PRIVATE_RENTAL",
  regulation_framework: "Residential Tenancies Act (Provincial)",
  rent_control_policy: "Annual increase max 2.5% (Ontario example)",
  max_occupants_per_unit: 4,
  accessibility_requirements: "AODA basic standards",
  support_services_included: []
}
```

**Characteristics**:
- Market-rate rent
- 12-month lease standard
- Landlord: Private individual or small company
- Tenant screening required
- Utilities: May vary (included or tenant pays)
- Acceptable use: Residential only

**Example**:
- Basement apartment in single-family home
- 2-bedroom condo in downtown building
- Corporate housing for relocated employee

**Key Features**:
- Rent increase limits (provincial regulation)
- Lease agreement with standard terms
- Tenant rights protection

---

### Type 2: AFFORDABLE_HOUSING

```typescript
{
  type_id: 2,
  type_name: "AFFORDABLE_HOUSING",
  regulation_framework: "Housing Act (Provincial)",
  rent_control_policy: "Geared-to-Income (GTI) - max 30% of household income",
  max_occupants_per_unit: 5,
  accessibility_requirements: "AODA enhanced standards",
  support_services_included: ["counseling", "job_training", "childcare"]
}
```

**Characteristics**:
- Income-based rent (30% threshold)
- Long-term (indefinite) occupancy
- Non-profit organization ownership
- Tenant must meet income requirements (varies by region)
- Annual income verification
- Rent adjusts if income changes

**Example Unit**:
```
A 2-bedroom affordable unit occupied by:
Person A: Annual income $40,000
Person B: Annual income $2,000
Total: $42,000 household income
GTI Rent Calculation: $42,000 × 30% ÷ 12 = $1,050/month rent
(vs. $2,500+ market rate)
```

**Key Features**:
- CMHC or provincial subsidy
- Non-profit management (often)
- Income verification and annual review
- Enhanced accessibility features
- Support service connections

---

### Type 3: SHELTER_HOUSING

```typescript
{
  type_id: 3,
  type_name: "SHELTER_HOUSING",
  regulation_framework: "Homelessness Act & Housing & Support Services Act",
  rent_control_policy: "Free or minimal cost (subsidized)",
  max_occupants_per_unit: 2,
  accessibility_requirements: "Universal design principles",
  support_services_included: [
    "case_management",
    "mental_health",
    "addiction_support",
    "emergency_response"
  ]
}
```

**Characteristics**:
- Short-term emergency housing
- Free or heavily subsidized (government funded)
- Intensive case management
- Support services mandatory
- No formal lease (occupancy agreement)
- Case manager assigned
- Intake assessment required

**Example Resident**:
```
Jorge - Emergency Shelter Resident
- Became homeless after job loss
- Assigned to shelter with case manager
- Accesses mental health counseling
- Works with job training program
- Goal: Transition to affordable housing within 6-12 months
```

**Key Features**:
- Government or non-profit operation
- Multi-disciplinary support team
- Rapid re-housing focus
- Data sharing with social services (with consent)
- Evening/weekend staffing

---

### Type 4: COOP_HOUSING

```typescript
{
  type_id: 4,
  type_name: "COOP_HOUSING",
  regulation_framework: "Cooperatives Act",
  rent_control_policy: "Member-determined (typically lower market)",
  max_occupants_per_unit: 4,
  accessibility_requirements: "Inclusive design",
  support_services_included: ["communal_maintenance", "member_events"]
}
```

**Characteristics**:
- Member-owned cooperative structure
- Democratic governance (member votes)
- Equity share system (buy-in required)
- Collectively managed operations
- Member commitment to cooperative principles
- Internal dispute resolution

**Example Co-op**:
```
Parkdale Housing Co-op (Toronto)
- 250 member households
- Monthly member meetings
- Board elected by members
- Shared maintenance costs
- Consensus-based decision making
```

**Lease Type**: COOP (member contract, not traditional lease)

**Key Features**:
- Member voting rights
- Transparent finances
- Shared responsibility
- Community building focus
- Lower costs than market rent

---

### Type 5: SENIOR_HOUSING

```typescript
{
  type_id: 5,
  type_name: "SENIOR_HOUSING",
  regulation_framework: "Accessibility for Seniors Act",
  rent_control_policy: "Market rate or subsidized",
  max_occupants_per_unit: 2,
  accessibility_requirements: "Full accessibility - mobility, vision, hearing",
  support_services_included: [
    "health_services",
    "meal_programs",
    "transportation",
    "social_activities"
  ]
}
```

**Characteristics**:
- Age 55+ or 65+ (varies by facility)
- Accessible design mandatory
- On-site health services (may vary)
- Social/recreational programming
- Transportation assistance
- Medication management support

**Example Facility**:
```
Greenfield Seniors Community (Ontario)
- 120 private apartments
- Dining room with daily meals
- Physiotherapy center
- Doctor visits twice weekly
- Social programs: Cards, fitness, arts
- Transportation to medical appointments
```

**Key Features**:
- Enhanced accessibility (lever handles, wide doors, etc.)
- Health care coordination
- Social engagement programming
- Simplified lease terms
- Security features (emergency alert systems)

---

## Properties & Units

### Property Interface

```typescript
interface Property {
  property_id: number;
  owner_id: number;                // FK to USERS (property owner)
  property_type_id: number;        // FK to PROPERTY_TYPES (1-5)
  address: string;                 // Full street address
  legal_description: string;       // PIN and property details
  market_value: number;            // Current estimated value
  ownership_type: "Sole" | "Joint" | "Corporate";
  funding_sources: string[];       // Mortgage, grants, etc.
  total_units: number;             // Number of apartments/units
  units?: Unit[];                  // Nested units (optional)
  acquired_date: string;           // When owner bought property
}
```

### Unit Interface

```typescript
interface Unit {
  unit_id: number;
  property_id: number;             // FK to PROPERTIES
  unit_number: string;             // "4B", "302", "12A"
  bedroom_count: number;
  bathroom_count: number;
  square_footage: number;
  monthly_rent: number;            // Market rate or GTI
  status: "occupied" | "vacant" | "under_maintenance";
  accessibility_features: string[];// Wheelchair accessible, etc.
  current_tenant_id?: number;      // FK to USERS (if occupied)
}
```

### Sample Property Hierarchy

```typescript
// Property 1: Mr. Owner's Private Rental (Multi-unit Building)
const property1 = {
  property_id: 1,
  owner_id: 3,                         // mr_owner
  property_type_id: 1,                 // PRIVATE_RENTAL
  address: "123 Main Street, Toronto, ON M1A 1A1",
  legal_description: "PIN: 12-34-56-78, 12 unit residential building",
  market_value: 2500000,
  ownership_type: "Sole",
  funding_sources: ["MORTGAGE_TD_BANK"],
  total_units: 12,
  acquired_date: "2018-06-15T00:00:00Z"
};

// Units in Property 1
const units = [
  {
    unit_id: 1,
    property_id: 1,
    unit_number: "4B",
    bedroom_count: 2,
    bathroom_count: 1,
    square_footage: 850,
    monthly_rent: 2400,
    status: "occupied",
    accessibility_features: [],
    current_tenant_id: 1  // john_renter
  },
  {
    unit_id: 2,
    property_id: 1,
    unit_number: "302",
    bedroom_count: 3,
    bathroom_count: 2,
    square_footage: 1200,
    monthly_rent: 2800,
    status: "occupied",
    accessibility_features: ["wheelchair_accessible", "visual_aid"],
    current_tenant_id: 2  // alice_lease
  }
];

// Property 2: Affordable Housing (with subsidies)
const property2 = {
  property_id: 2,
  owner_id: 3,                         // mr_owner (also owns this!)
  property_type_id: 2,                 // AFFORDABLE_HOUSING
  address: "456 King Avenue, Toronto, ON M2B 2B2",
  legal_description: "PIN: 23-45-67-89, 8 unit affordable housing",
  market_value: 1800000,
  ownership_type: "Joint",             // Owned with partner
  funding_sources: ["GOVERNMENT_SUBSIDY_CMHC", "NONPROFIT_GRANT"],
  total_units: 8,
  acquired_date: "2020-03-01T00:00:00Z"
};

// Property 3: Co-op Housing (democratic governance)
const property3 = {
  property_id: 3,
  owner_id: 3,                         // mr_owner is the co-op operator
  property_type_id: 4,                 // COOP_HOUSING
  address: "789 Queen Street, Toronto, ON M3C 3C3",
  legal_description: "PIN: 34-56-78-90, 20 unit co-op building",
  market_value: 3200000,
  ownership_type: "Sole",
  funding_sources: ["COOP_FINANCING"],
  total_units: 20,
  acquired_date: "2019-09-10T00:00:00Z"
};
```

---

## Lease Agreements

### LeaseAgreement Interface

```typescript
interface LeaseAgreement {
  lease_id: number;
  property_id: number;               // FK to PROPERTIES
  unit_id: number;                   // FK to UNITS
  tenant_id: number;                // FK to USERS
  owner_id: number;                 // FK to USERS (property owner)
  lease_type: "STANDARD" | "PROTECTED" | "SOCIAL" | "SHELTER" | "COOP";
  start_date: string;               // ISO date
  end_date: string;                 // ISO date (or far future for permanent)
  monthly_rent: number;
  terms_conditions: string;         // Lease text/summary
  province_regulation: string;      // "ON" for Ontario, "BC" for BC, etc.
  created_at: string;               // When lease was signed
}
```

### Lease Types Mapping

| Type | Property Type | Term | Flexibility | Renewal |
|------|---------------|------|-------------|---------|
| **STANDARD** | Private Rental | 12 months | Fixed | Annual negotiation |
| **PROTECTED** | Private Rental | Open-ended | Tenant protection | Indefinite |
| **SOCIAL** | Affordable/Shelter | Open-ended | Income-responsive | Annual verification |
| **SHELTER** | Shelter Housing | 90-180 days | Case manager exit plan | As needed |
| **COOP** | Co-op Housing | Member tenure | Equity share | Lifetime/transfer |

### Sample Lease Records

```typescript
// Lease 1: Standard Private Rental
{
  lease_id: 1,
  property_id: 1,
  unit_id: 1,
  tenant_id: 1,              // john_renter
  owner_id: 3,               // mr_owner
  lease_type: "STANDARD",
  start_date: "2024-09-01T00:00:00Z",
  end_date: "2025-08-31T00:00:00Z",
  monthly_rent: 2400,
  terms_conditions: "Standard Ontario RTA provisions apply. No pets. Utilities included.",
  province_regulation: "ON",
  created_at: "2024-08-20T00:00:00Z"
}

// Lease 2: Affordable Housing (Geared-to-Income)
{
  lease_id: 2,
  property_id: 2,
  unit_id: 3,
  tenant_id: 2,              // alice_lease (as leaseholder)
  owner_id: 3,               // mr_owner
  lease_type: "SOCIAL",
  start_date: "2024-06-01T00:00:00Z",
  end_date: "2099-12-31T00:00:00Z",  // Indefinite
  monthly_rent: 960,         // GTI: 30% of $3,200 income
  terms_conditions: "Affordable housing lease. Income verification required annually.",
  province_regulation: "ON",
  created_at: "2024-05-15T00:00:00Z"
}
```

---

## Role-Based Permissions

### Permission Matrix (Simplified)

```
Capability                 | RENTER | LEASEHOLDER | OWNER | MANAGER | SOCIAL_MGR
---------------------------|--------|-------------|-------|---------|------------
View own billing           |   ✓    |      ✓      |   ✓   |    ✓    |     ✓
Pay rent                   |   ✓    |      ✓      |    -   |    -    |     -
Submit maintenance         |   ✓    |      ✓      |   ✓   |    -    |     ✓
Manage lease               |    -    |      ✓      |   ✓   |    ✓    |     ✓
Screen tenants             |    -    |      -      |   ✓   |    ✓    |     -
View all properties        |    -    |      -      |   ✓   |    ✓    |     ✓
Manage subsidies           |    -    |      -      |   -   |    -    |     ✓
Verify tenant income       |    -    |      -      |   ✓   |    -    |     ✓
System administration      |    -    |      -      |   -   |    ✓    |     -
```

### How Permissions Enforce Access

```typescript
// In portal pages (e.g., /portal/owner)
useEffect(() => {
  if (!isAuthenticated || user?.role.role_name !== "OWNER") {
    router.push("/");  // Redirect if not authorized
  }
}, [isAuthenticated, user, router]);

// In database queries
export function getPropertiesByOwner(owner_id: number) {
  return PROPERTIES.filter(p => p.owner_id === owner_id);
  // Only returns properties the user owns
}
```

---

## Multi-Property Scenarios

### Scenario 1: Individual Investor (mr_owner)

```
Mr. Property Owner (user_id: 3)
├─ Role: OWNER (Individual Investor)
├─ Annual Income: $450,000 (from properties)
├─ Legal Status: Single Person (SIN: 456-78-9123)
│
├─ Property 1: 123 Main Street (Private Rental)
│  ├─ Type: PRIVATE_RENTAL
│  ├─ Units: 12
│  ├─ Tenants: 12
│  └─ Monthly Income: $28,800
│
├─ Property 2: 456 King Avenue (Affordable)
│  ├─ Type: AFFORDABLE_HOUSING
│  ├─ Units: 8
│  ├─ Funding: CMHC subsidy + Non-profit grant
│  ├─ Tenants: 8 (geared-to-income)
│  └─ Monthly Income: ~$6,000 (subsidized rates)
│
└─ Property 3: 789 Queen Street (Co-op)
   ├─ Type: COOP_HOUSING
   ├─ Units: 20 (member-owned)
   ├─ Members: 20 voting participants
   └─ Monthly Income: $24,000 (member fees)

Dashboard Features:
• Property portfolio overview
• Rent collection schedule
• Maintenance approval queue
• Financial dashboards (ROI, expenses)
• Tax report generation
```

### Dashboard Display

When mr_owner logs in to `/portal/owner`, they see:

```
┌─────────────────────────────────────────────────┐
│        Your Property Portfolio                   │
├─────────────────────────────────────────────────┤
│ Property 1: 123 Main Street                      │
│ ├─ 12/12 Units Occupied                          │
│ ├─ $28,800 Monthly Revenue                       │
│ └─ Status: OPEN (accept tenant inquiries)        │
│                                                  │
│ Property 2: 456 King Avenue                      │
│ ├─ 8/8 Units Occupied                            │
│ ├─ ~$6,000 Monthly Revenue (subsidized)          │
│ └─ Status: FULL (waitlist active)                │
│                                                  │
│ Property 3: 789 Queen Street (Co-op)             │
│ ├─ 20/20 Member Units                            │
│ ├─ $24,000 Monthly Revenue                       │
│ └─ Status: COOPERATIVE (member governance)       │
│                                                  │
│ TOTAL PORTFOLIO VALUE: $7,500,000                │
│ TOTAL MONTHLY INCOME: $58,800                    │
└─────────────────────────────────────────────────┘

Quick Actions:
[View Property 1] [View Property 2] [View Property 3]
[Approve Maintenance] [Tenant Applications] [Financial Reports]
```

---

### Scenario 2: Corporate Housing Company (Future)

```
Corporate Owner (user_id: TBD)
├─ Role: CORPORATE_OWNER
├─ Legal Entity: "Tri-City Housing Inc." (BN: 12-345-67890)
├─ Annual Revenue: $5,000,000
│
├─ Regional Director 1: Alice Chen
│  ├─ Role: OWNER (delegated)
│  └─ Properties: 1-15 (Toronto region)
│
├─ Regional Director 2: [Manager assigned]
│  ├─ Role: OWNER (delegated)
│  └─ Properties: 16-30 (GTA region)
│
├─ Property Manager: [Staff assigned]
│  ├─ Role: BUILDING_MANAGER
│  └─ Assigned: All 30 properties
│
└─ Accountant: [Staff assigned]
   ├─ Role: Support staff
   └─ Access: Financial reports only

Advanced Features:
• Multi-team hierarchy
• Bulk operations (appliance ordering, inspections)
• Advanced analytics (market analysis, ROI projections)
• API access for integrations
• Compliance dashboard (regulatory reporting)
```

---

## Compliance Mapping

### How Each User Type Supports Compliance

| Regulation | Purpose | Supported By | DingDong Feature |
|------------|---------|--------------|------------------|
| **AODA** | Accessibility | All roles | Accessibility features per unit |
| **PIPEDA** | Privacy | All roles | SIN/BN secure storage, profile privacy |
| **RTA** | Tenant protection | Renters, Owners | Lease agreement standards |
| **GTI Rule** | Affordability (30%) | Social managers | Rent calculation by income |
| **Co-op Act** | Democratic governance | Co-op members | Voting system (future) |
| **Homelessness Act** | Emergency support | Shelter staff | Case management features |
| **Digital Act** | Identity verification | Gov authority | SIN/BN verification |

### Example: AODA Compliance

```
1. Property Data Layer
   └─ Each UNIT has accessibility_features array
      ├─ "wheelchair_accessible"
      ├─ "visual_aid"
      ├─ "hearing_aid"
      └─ "service_animal_friendly"

2. Search & Filter Layer (Future)
   └─ Renters can search by accessibility needs
      ├─ Show only wheelchair accessible units
      ├─ Filter by proximity to accessible transit
      └─ Display support services nearby

3. Tenant Screening (Future)
   └─ OWNER can filter compatible tenants
      ├─ View accessibility_needs in renter profile
      ├─ Match to accessible units
      └─ Approve with accommodation confirmation

4. Reporting Layer (Future)
   └─ GOVERNMENT_AUTHORITY can generate AODA reports
      ├─ % of accessible units per property type
      ├─ Accessibility improvement tracking
      └─ Compliance certification
```

---

## Mock Data Walkthrough

### Current Test Data (5 Users)

```typescript
// User 1: John Doe - Renter
Username: john_renter
Password: password123
Role: RENTER
Occupancy: Unit 4B (2BR, 1BA, $2,400/month)
Income: $65,000/year
Status: Can pay rent, request maintenance

// User 2: Alice Chen - Leaseholder (Corporate)
Username: alice_lease
Password: leasepass456
Role: LEASEHOLDER
Occupancy: Unit 12A (Affordable housing, GTI rent)
Income: $5,000,000/year (corporate)
Status: Can manage lease, sub-tenants

// User 3: Mr. Owner - Property Owner (Individual)
Username: mr_owner
Password: owner789
Role: OWNER
Properties: 3 (12 + 8 + 20 units)
Income: $450,000/year
Status: Can approve maintenance, collect rent

// User 4: Building Manager
Username: admin_manager
Password: asade
Role: BUILDING_MANAGER
Manages: All properties
Status: Can coordinate maintenance, view all units

// User 5: Sarah Johnson - Social Housing Manager
Username: social_housing_mgr
Password: social123
Role: SOCIAL_HOUSING_MANAGER
Manages: Property 2 (Affordable housing)
Status: Can verify income, calculate GTI rent
```

### Extending Mock Data

To add more users (social workers, shelter residents, co-op members):

```typescript
// Add to USERS array in database.ts
export const USERS: User[] = [
  // ... existing 5 users ...
  
  {
    user_id: 6,
    username: "maria_shelter",
    password: "shelter123",
    email: "maria@shelter.ca",
    full_name: "Maria Santos",
    legal_sin_or_bn: "234-56-7890",
    phone: "416-555-0006",
    role_id: 6,                        // SHELTER_RESIDENT
    profile_type: "Individual",
    status: "verified",
    properties: [],
    created_at: "2025-01-10T00:00:00Z"
  },
  
  {
    user_id: 7,
    username: "coop_member_1",
    password: "coop123",
    email: "james@coop.ca",
    full_name: "James Wilson",
    legal_sin_or_bn: "345-67-8901",
    phone: "416-555-0007",
    role_id: 5,                        // COOP_MEMBER
    profile_type: "Individual",
    status: "verified",
    properties: [],                    // Co-op members don't "own" property
    created_at: "2024-08-15T00:00:00Z"
  },
  
  // ... etc
];

// And add to USER_PROFILES, LEASE_AGREEMENTS, UNITS as needed
```

---

## Summary

The DingDong database implements a **sophisticated, real-world housing ecosystem** where:

1. **11 Role Types** serve different stakeholders
2. **5 Property Models** support diverse housing markets
3. **Rich User Profiles** capture compliance data
4. **Flexible Lease Types** match regulatory environments
5. **Permission System** enforces role-based access
6. **Multi-Property Support** enables portfolio management

This foundation can expand to support 100+ user types, thousands of properties, and complex business logic while maintaining regulatory compliance with Canadian housing standards.
