// Mock Database with Initial Users
// In production, replace with real database (PostgreSQL, MongoDB, etc.)
// Based on Canadian Housing Standards, AODA, and Digital Act

export interface User {
  user_id: number;
  username: string;
  password: string; // In real app, this would be hashed
  email: string;
  full_name: string;
  legal_sin_or_bn?: string; // SIN for individuals, BN for corporations
  phone: string;
  role_id: number;
  profile_type: "Individual" | "Corporate" | "NGO" | "Government";
  status: "active" | "inactive" | "verified" | "pending";
  properties?: number[]; // Array of property IDs owned
  created_at: string;
}

export interface UserProfile {
  profile_id: number;
  user_id: number;
  profile_type: "Individual" | "Corporate" | "NGO" | "Government";
  legal_entity_type: string;
  annual_income?: number;
  employment_status: string;
  marital_status?: string;
  dependents?: number;
  emergency_contacts: string[];
  accessibility_needs?: string;
  indigenous_status?: string;
  credit_history?: string;
  references: string[];
  verified_at?: string;
}

export interface Role {
  role_id: number;
  role_name: "RENTER" | "LEASEHOLDER" | "OWNER" | "CORPORATE_OWNER" | "COOP_MEMBER" | "SHELTER_RESIDENT" | "SOCIAL_HOUSING_MANAGER" | "BUILDING_MANAGER" | "SUPPORT_SERVICES" | "GOVERNMENT_AUTHORITY" | "ADMIN";
  description: string;
  category: "Occupant" | "Owner" | "Manager" | "Support" | "Government";
  permissions: string[];
}

export interface PropertyType {
  type_id: number;
  type_name: "PRIVATE_RENTAL" | "AFFORDABLE_HOUSING" | "SHELTER_HOUSING" | "COOP_HOUSING" | "SENIOR_HOUSING";
  regulation_framework: string;
  rent_control_policy: string;
  max_occupants_per_unit: number;
  accessibility_requirements: string;
  support_services_included: string[];
}

export interface Property {
  property_id: number;
  owner_id: number;
  property_type_id: number;
  address: string;
  legal_description: string;
  market_value: number;
  ownership_type: "Sole" | "Joint" | "Corporate";
  funding_sources: string[];
  total_units: number;
  units?: Unit[];
  acquired_date: string;
}

export interface Unit {
  unit_id: number;
  property_id: number;
  unit_number: string;
  bedroom_count: number;
  bathroom_count: number;
  square_footage: number;
  monthly_rent: number;
  status: "occupied" | "vacant" | "under_maintenance";
  accessibility_features: string[];
  current_tenant_id?: number;
}

export interface LeaseAgreement {
  lease_id: number;
  property_id: number;
  unit_id: number;
  tenant_id: number;
  owner_id: number;
  lease_type: "STANDARD" | "PROTECTED" | "SOCIAL" | "SHELTER" | "COOP";
  start_date: string;
  end_date: string;
  monthly_rent: number;
  terms_conditions: string;
  province_regulation: string;
  created_at: string;
}

export interface Occupant {
  occupant_id: number;
  lease_id: number;
  property_id: number;
  unit_id: number;
  name: string;
  email: string;
  phone: string;
  relationshipToLeaseholder: string;
  registrationDate: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface Apartment {
  apartment_id: number;
  unit_number: string;
  building_id: number;
  status: "occupied" | "vacant";
  monthly_rent: number;
}

// Mock Roles with Permissions - Comprehensive Canadian Housing System
export const ROLES: Role[] = [
  {
    role_id: 1,
    role_name: "RENTER",
    description: "Short-term Renter - Private Rental",
    category: "Occupant",
    permissions: ["view_billing", "pay_rent", "submit_maintenance", "view_profile", "view_lease"],
  },
  {
    role_id: 2,
    role_name: "LEASEHOLDER",
    description: "Long-term Leaseholder - Corporate/Individual",
    category: "Occupant",
    permissions: [
      "view_billing",
      "manage_lease",
      "manage_subtenants",
      "view_profile",
      "view_financial_reports",
      "register_occupants",
    ],
  },
  {
    role_id: 3,
    role_name: "OWNER",
    description: "Individual Property Owner",
    category: "Owner",
    permissions: [
      "manage_properties",
      "screen_tenants",
      "view_assets",
      "approve_maintenance",
      "collect_rent",
      "manage_renovations",
      "view_financials",
      "access_tax_reports",
    ],
  },
  {
    role_id: 4,
    role_name: "CORPORATE_OWNER",
    description: "Corporate Real Estate Company",
    category: "Owner",
    permissions: [
      "manage_multiple_properties",
      "hierarchical_staffing",
      "bulk_tenant_management",
      "advanced_analytics",
      "compliance_dashboard",
      "investment_tracking",
      "staff_management",
    ],
  },
  {
    role_id: 5,
    role_name: "COOP_MEMBER",
    description: "Co-op Housing Member",
    category: "Occupant",
    permissions: [
      "vote_on_decisions",
      "view_financial_transparency",
      "request_maintenance",
      "manage_move_rights",
      "access_member_board",
    ],
  },
  {
    role_id: 6,
    role_name: "SHELTER_RESIDENT",
    description: "Shelter/Emergency Housing Resident",
    category: "Occupant",
    permissions: ["access_basic_services", "contact_case_manager", "request_support"],
  },
  {
    role_id: 7,
    role_name: "SOCIAL_HOUSING_MANAGER",
    description: "Non-Profit / Social Housing Organization",
    category: "Manager",
    permissions: [
      "manage_subsidies",
      "verify_income",
      "gti_calculations",
      "tenant_support_integration",
      "social_impact_reporting",
      "grant_management",
    ],
  },
  {
    role_id: 8,
    role_name: "BUILDING_MANAGER",
    description: "Building Superintendent / Manager",
    category: "Manager",
    permissions: [
      "daily_operations",
      "coordinate_maintenance",
      "security_management",
      "emergency_response",
      "tenant_communications",
    ],
  },
  {
    role_id: 9,
    role_name: "SUPPORT_SERVICES",
    description: "Support Services Provider (Social Worker, Counselor, etc)",
    category: "Support",
    permissions: [
      "case_management",
      "schedule_appointments",
      "confidential_notes",
      "service_linking",
      "outcome_tracking",
    ],
  },
  {
    role_id: 10,
    role_name: "GOVERNMENT_AUTHORITY",
    description: "Government Housing Authority",
    category: "Government",
    permissions: [
      "manage_waitlists",
      "subsidy_administration",
      "policy_enforcement",
      "public_reporting",
      "digital_identity_verification",
    ],
  },
  {
    role_id: 11,
    role_name: "ADMIN",
    description: "System Administrator",
    category: "Government",
    permissions: [
      "manage_users",
      "view_all_data",
      "approve_requests",
      "system_config",
      "security_override",
      "audit_logs",
    ],
  },
];

// Property Types based on Canadian Housing Standards
export const PROPERTY_TYPES: PropertyType[] = [
  {
    type_id: 1,
    type_name: "PRIVATE_RENTAL",
    regulation_framework: "Residential Tenancies Act (Provincial)",
    rent_control_policy: "Annual increase max 2.5% (Ontario example)",
    max_occupants_per_unit: 4,
    accessibility_requirements: "AODA basic standards",
    support_services_included: [],
  },
  {
    type_id: 2,
    type_name: "AFFORDABLE_HOUSING",
    regulation_framework: "Housing Act (Provincial)",
    rent_control_policy: "Geared-to-Income (GTI) - max 30% of household income",
    max_occupants_per_unit: 5,
    accessibility_requirements: "AODA enhanced standards",
    support_services_included: ["counseling", "job_training", "childcare"],
  },
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
      "emergency_response",
    ],
  },
  {
    type_id: 4,
    type_name: "COOP_HOUSING",
    regulation_framework: "Cooperatives Act",
    rent_control_policy: "Member-determined (typically lower market)",
    max_occupants_per_unit: 4,
    accessibility_requirements: "Inclusive design",
    support_services_included: ["communal_maintenance", "member_events"],
  },
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
      "social_activities",
    ],
  },
];

// Sample Properties showing multi-property ownership
export const PROPERTIES: Property[] = [
  {
    property_id: 1,
    owner_id: 3, // Mr. Owner
    property_type_id: 1,
    address: "123 Main Street, Toronto, ON M1A 1A1",
    legal_description: "PIN: 12-34-56-78, 12 unit residential building",
    market_value: 2500000,
    ownership_type: "Sole",
    funding_sources: ["MORTGAGE_TD_BANK"],
    total_units: 12,
    acquired_date: "2018-06-15T00:00:00Z",
  },
  {
    property_id: 2,
    owner_id: 3, // Mr. Owner - Second property
    property_type_id: 2,
    address: "456 King Avenue, Toronto, ON M2B 2B2",
    legal_description: "PIN: 23-45-67-89, 8 unit affordable housing",
    market_value: 1800000,
    ownership_type: "Joint",
    funding_sources: ["GOVERNMENT_SUBSIDY_CMHC", "NONPROFIT_GRANT"],
    total_units: 8,
    acquired_date: "2020-03-01T00:00:00Z",
  },
  {
    property_id: 3,
    owner_id: 3, // Mr. Owner - Third property (co-op)
    property_type_id: 4,
    address: "789 Queen Street, Toronto, ON M3C 3C3",
    legal_description: "PIN: 34-56-78-90, 20 unit co-op building",
    market_value: 3200000,
    ownership_type: "Sole",
    funding_sources: ["COOP_FINANCING"],
    total_units: 20,
    acquired_date: "2019-09-10T00:00:00Z",
  },
];

// Sample Units in properties
export const UNITS: Unit[] = [
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
    current_tenant_id: 1,
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
    current_tenant_id: 2,
  },
  {
    unit_id: 3,
    property_id: 2,
    unit_number: "12A",
    bedroom_count: 2,
    bathroom_count: 1,
    square_footage: 800,
    monthly_rent: 960, // 30% of $3200 income (GTI)
    status: "occupied",
    accessibility_features: ["wheelchair_accessible"],
  },
  {
    unit_id: 4,
    property_id: 3,
    unit_number: "1A",
    bedroom_count: 1,
    bathroom_count: 1,
    square_footage: 600,
    monthly_rent: 1200,
    status: "occupied",
    accessibility_features: ["service_animal_friendly"],
  },
];

// Mock Users - Updated with comprehensive profiles
export const USERS: User[] = [
  {
    user_id: 1,
    username: "john_renter",
    password: "password123",
    email: "john@example.com",
    full_name: "John Doe",
    legal_sin_or_bn: "123-45-6789",
    phone: "416-555-0001",
    role_id: 1, // RENTER
    profile_type: "Individual",
    status: "verified",
    properties: [],
    created_at: "2025-01-15T00:00:00Z",
  },
  {
    user_id: 2,
    username: "alice_lease",
    password: "leasepass456",
    email: "alice@corporate.com",
    full_name: "Alice Chen",
    legal_sin_or_bn: "987-65-4321",
    phone: "416-555-0002",
    role_id: 2, // LEASEHOLDER
    profile_type: "Corporate",
    status: "verified",
    properties: [],
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    user_id: 3,
    username: "mr_owner",
    password: "owner789",
    email: "owner@property.com",
    full_name: "Mr. Property Owner",
    legal_sin_or_bn: "456-78-9123",
    phone: "416-555-0003",
    role_id: 3, // OWNER
    profile_type: "Individual",
    status: "verified",
    properties: [1, 2, 3], // Multi-property owner
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    user_id: 4,
    username: "admin_manager",
    password: "asade123",
    email: "manager@dingdong.com",
    full_name: "Building Manager",
    legal_sin_or_bn: "789-01-2345",
    phone: "416-555-0004",
    role_id: 8, // BUILDING_MANAGER
    profile_type: "Individual",
    status: "verified",
    properties: [],
    created_at: "2022-01-01T00:00:00Z",
  },
  {
    user_id: 5,
    username: "social_housing_mgr",
    password: "social123",
    email: "nonprofit@housing.ca",
    full_name: "Sarah Johnson",
    legal_sin_or_bn: "12-34567890",
    phone: "416-555-0005",
    role_id: 7, // SOCIAL_HOUSING_MANAGER
    profile_type: "NGO",
    status: "verified",
    properties: [2],
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    user_id: 6,
    username: "system_admin",
    password: "admin123",
    email: "admin@dingdong.com",
    full_name: "System Administrator",
    legal_sin_or_bn: "999-99-9999",
    phone: "416-555-0006",
    role_id: 11, // ADMIN
    profile_type: "Individual",
    status: "verified",
    properties: [],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    user_id: 7,
    username: "corporate_mgr",
    password: "corporate456",
    email: "manager@realestategroup.com",
    full_name: "Corporate Property Manager",
    legal_sin_or_bn: "12-3456789",
    phone: "416-555-0007",
    role_id: 4, // CORPORATE_OWNER
    profile_type: "Corporate",
    status: "verified",
    properties: [1, 3], // Manages properties 1 and 3
    created_at: "2023-06-01T00:00:00Z",
  },
];

// User Profiles - Detailed information per user
export const USER_PROFILES: UserProfile[] = [
  {
    profile_id: 1,
    user_id: 1,
    profile_type: "Individual",
    legal_entity_type: "Person",
    annual_income: 65000,
    employment_status: "Employed",
    marital_status: "Single",
    dependents: 0,
    emergency_contacts: ["Jane Doe (Sister)", "416-555-1001"],
    accessibility_needs: "None",
    references: ["Previous Landlord John Smith", "Employer HR Manager"],
    verified_at: "2025-01-15T00:00:00Z",
  },
  {
    profile_id: 2,
    user_id: 2,
    profile_type: "Corporate",
    legal_entity_type: "Corporation",
    annual_income: 5000000,
    employment_status: "Business Owner",
    emergency_contacts: [
      "Alice Chen (Director)",
      "CFO: David Zhang",
      "416-555-2001",
    ],
    references: [
      "Bank of Canada",
      "Accounting Firm Smith & Co",
      "Legal Counsel Jane's Law",
    ],
    verified_at: "2024-06-01T00:00:00Z",
  },
  {
    profile_id: 3,
    user_id: 3,
    profile_type: "Individual",
    legal_entity_type: "Person",
    annual_income: 450000,
    employment_status: "Real Estate Investor",
    marital_status: "Married",
    dependents: 2,
    emergency_contacts: ["Spouse: Mary Owner", "416-555-3001"],
    accessibility_needs: "None",
    references: [
      "Business Bank: TD",
      "Accountant: CPA Smith",
      "Real Estate Lawyer: Brown Legal",
    ],
    verified_at: "2023-01-01T00:00:00Z",
  },
];

// Lease Agreements showing multi-property leases
export const LEASE_AGREEMENTS: LeaseAgreement[] = [
  {
    lease_id: 1,
    property_id: 1,
    unit_id: 1,
    tenant_id: 1,
    owner_id: 3,
    lease_type: "STANDARD",
    start_date: "2024-09-01T00:00:00Z",
    end_date: "2025-08-31T00:00:00Z",
    monthly_rent: 2400,
    terms_conditions:
      "Standard Ontario RTA provisions apply. No pets. Utilities included.",
    province_regulation: "ON",
    created_at: "2024-08-20T00:00:00Z",
  },
  {
    lease_id: 2,
    property_id: 2,
    unit_id: 3,
    tenant_id: 2,
    owner_id: 3,
    lease_type: "SOCIAL",
    start_date: "2024-06-01T00:00:00Z",
    end_date: "2025-05-31T00:00:00Z",
    monthly_rent: 960, // GTI 30% of income
    terms_conditions:
      "Affordable housing lease. Income verification required annually.",
    province_regulation: "ON",
    created_at: "2024-05-15T00:00:00Z",
  },
];

// Occupants - Registered inhabitants/sub-tenants
export const OCCUPANTS: Occupant[] = [
  {
    occupant_id: 1,
    lease_id: 2,
    property_id: 2,
    unit_id: 3,
    name: "Alice Chen",
    email: "alice@corporate.com",
    phone: "416-555-0002",
    relationshipToLeaseholder: "Primary Leaseholder",
    registrationDate: "2024-06-01",
    status: "active",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    occupant_id: 2,
    lease_id: 2,
    property_id: 2,
    unit_id: 3,
    name: "Bob Smith",
    email: "bob@corporate.com",
    phone: "416-555-0020",
    relationshipToLeaseholder: "Co-occupant",
    registrationDate: "2024-07-15",
    status: "active",
    created_at: "2024-07-15T00:00:00Z",
  },
];

// Authentication Logic
export async function authenticateUser(
  username: string,
  password: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    console.log("🔍 Authenticating user:", username);
    const user = USERS.find((u) => u.username === username);
    console.log("👤 User found:", !!user, user?.username);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.password !== password) {
      console.log("❌ Password mismatch");
      return { success: false, error: "Invalid password" };
    }

    if (user.status !== "verified") {
      console.log("❌ User not verified:", user.status);
      return { success: false, error: "User account is not verified" };
    }

    console.log("✅ All checks passed. User:", user.username, "Role ID:", user.role_id);
    const returnData = {
      success: true,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        legal_sin_or_bn: user.legal_sin_or_bn,
        profile_type: user.profile_type,
        role_id: user.role_id,
        properties: user.properties,
        status: user.status,
        created_at: user.created_at,
      },
    };
    console.log("📤 Returning:", returnData);
    return returnData;
  } catch (error) {
    console.error("[AUTH ERROR]", error);
    return { success: false, error: "Authentication error" };
  }
}

// Get User by ID with full details
export function getUserById(user_id: number) {
  const user = USERS.find((u) => u.user_id === user_id);
  if (user) {
    const role = ROLES.find((r) => r.role_id === user.role_id);
    const profile = USER_PROFILES.find((p) => p.user_id === user_id);
    return {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      legal_sin_or_bn: user.legal_sin_or_bn,
      profile_type: user.profile_type,
      role: role,
      properties: user.properties,
      status: user.status,
      created_at: user.created_at,
      profile: profile,
    };
  }
  return null;
}

// Get Role by ID
export function getRoleById(role_id: number) {
  return ROLES.find((r) => r.role_id === role_id);
}

// Get Role by Name
export function getRoleByName(role_name: string) {
  return ROLES.find((r) => r.role_name === role_name);
}

// Get Property by ID
export function getPropertyById(property_id: number) {
  return PROPERTIES.find((p) => p.property_id === property_id);
}

// Get Properties by Owner
export function getPropertiesByOwner(owner_id: number) {
  return PROPERTIES.filter((p) => p.owner_id === owner_id);
}

// Get Units by Property
export function getUnitsByProperty(property_id: number) {
  return UNITS.filter((u) => u.property_id === property_id);
}

// Get Unit by ID
export function getUnitById(unit_id: number) {
  return UNITS.find((u) => u.unit_id === unit_id);
}

// Get User Profile by User ID
export function getUserProfile(user_id: number) {
  return USER_PROFILES.find((p) => p.user_id === user_id);
}

// Get Leases by Property
export function getLeasesByProperty(property_id: number) {
  return LEASE_AGREEMENTS.filter((l) => l.property_id === property_id);
}

// Get Leases by Tenant
export function getLeasesByTenant(tenant_id: number) {
  return LEASE_AGREEMENTS.filter((l) => l.tenant_id === tenant_id);
}

// Get Property Type by ID
export function getPropertyTypeById(type_id: number) {
  return PROPERTY_TYPES.find((t) => t.type_id === type_id);
}

// Get all admin users
export function getAdminUsers() {
  return USERS.filter((u) => u.role_id === 11); // ADMIN role
}

// User Management Functions

// Get all users
export function getAllUsers() {
  return USERS;
}

// Get users by role
export function getUsersByRole(role_id: number) {
  return USERS.filter((u) => u.role_id === role_id);
}

// Create a new user
export function createUser(userData: Omit<User, 'user_id' | 'created_at'>) {
  const newUser: User = {
    ...userData,
    user_id: Math.max(...USERS.map(u => u.user_id), 0) + 1,
    created_at: new Date().toISOString(),
  };
  USERS.push(newUser);
  return newUser;
}

// Update user
export function updateUser(user_id: number, updates: Partial<User>) {
  const user = USERS.find((u) => u.user_id === user_id);
  if (!user) return null;
  
  Object.assign(user, updates);
  return user;
}

// Delete user
export function deleteUser(user_id: number) {
  const index = USERS.findIndex((u) => u.user_id === user_id);
  if (index === -1) return false;
  
  USERS.splice(index, 1);
  return true;
}

// Get corporate owner's staff (users they manage)
export function getCorporateOwnerStaff(owner_id: number) {
  const owner = USERS.find((u) => u.user_id === owner_id);
  if (!owner || owner.role_id !== 4) return []; // Not a corporate owner
  
  // In a real system, there would be a many-to-many relationship
  // For now, return staff explicitly assigned
  return USERS.filter((u) => u.role_id !== 11 && u.role_id !== 10 && u.user_id !== 1);
}

// Update user profile (restricted fields - users can only change email, phone, password)
export function updateUserProfile(
  user_id: number,
  updates: {
    email?: string;
    phone?: string;
    password?: string;
  }
) {
  const user = USERS.find((u) => u.user_id === user_id);
  if (!user) return null;

  // Only allow updating specific fields
  if (updates.email) user.email = updates.email;
  if (updates.phone) user.phone = updates.phone;
  if (updates.password) user.password = updates.password;

  return user;
}

// Occupant Management Functions

// Get all occupants
export function getAllOccupants() {
  return OCCUPANTS;
}

// Get occupants by lease
export function getOccupantsByLease(lease_id: number) {
  return OCCUPANTS.filter((o) => o.lease_id === lease_id);
}

// Get occupants by property
export function getOccupantsByProperty(property_id: number) {
  return OCCUPANTS.filter((o) => o.property_id === property_id);
}

// Get occupants by unit
export function getOccupantsByUnit(unit_id: number) {
  return OCCUPANTS.filter((o) => o.unit_id === unit_id);
}

// Get single occupant by ID
export function getOccupantById(occupant_id: number) {
  return OCCUPANTS.find((o) => o.occupant_id === occupant_id);
}

// Create a new occupant
export function createOccupant(occupantData: Omit<Occupant, 'occupant_id' | 'created_at'>) {
  const newOccupant: Occupant = {
    ...occupantData,
    occupant_id: Math.max(...OCCUPANTS.map(o => o.occupant_id), 0) + 1,
    created_at: new Date().toISOString(),
  };
  OCCUPANTS.push(newOccupant);
  return newOccupant;
}

// Update occupant
export function updateOccupant(occupant_id: number, updates: Partial<Occupant>) {
  const occupant = OCCUPANTS.find((o) => o.occupant_id === occupant_id);
  if (!occupant) return null;
  
  Object.assign(occupant, updates);
  return occupant;
}

// Delete occupant
export function deleteOccupant(occupant_id: number) {
  const index = OCCUPANTS.findIndex((o) => o.occupant_id === occupant_id);
  if (index === -1) return false;
  
  OCCUPANTS.splice(index, 1);
  return true;
}
