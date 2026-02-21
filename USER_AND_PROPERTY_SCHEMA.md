# DingDong BMS - Complete User & Property Schema Design
## Based on Canadian Housing Standards, AODA, and Digital Act Requirements

---

## 📋 User Types & Roles (10 Primary)

### **Category 1: Occupants (Residents)**

#### 1. **Tenant - Short-Term Renter**
- **Regulation Framework**: Residential Tenancies Act (Provincial)
- **Profile Requirements**:
  - Legal name (verified ID)
  - Income verification (last 2 pay stubs or NOA)
  - Employment status
  - Credit check consent
  - Emergency contacts (min 2)
  - Rental history/references
- **Accessibility**: AODA compliant units only if requested
- **Features**:
  - View property details
  - Report maintenance
  - Pay rent online
  - View lease terms
  - Request early termination (with conditions)

#### 2. **Leaseholder - Long-Term Leaseholder**
- **Regulation Framework**: Long-term Lease Act (Commercial & Residential)
- **Profile Requirements**:
  - Legal name & entity type (Individual/Partnership/Corporation)
  - Business Number (BN) if corporate
  - Financial statements (annual)
  - Corporate structure docs
  - Insurance details
- **Accessibility**: Common areas must be AODA compliant
- **Features**:
  - Manage subletting
  - Register subtenants
  - View detailed lease terms
  - Access financial reports
  - Manage corporate occupants

#### 3. **Shelter Resident - Social/Emergency Housing**
- **Regulation Framework**: Housing & Homelessness Services Act
- **Profile Requirements**:
  - Basic legal name
  - Emergency contact
  - Health/Accessibility needs
  - Referral source (Social Services/Emergency Services)
  - Support case manager info
- **Accessibility**: Universal design principles mandatory
- **Features**:
  - Minimal restrictions
  - Case manager interface
  - Support services access
  - Secure messaging with supports

---

### **Category 2: Owners & Investors**

#### 4. **Individual Property Owner**
- **Regulation Framework**: Taxation Act, Residential Tenancies Act
- **Profile Requirements**:
  - Legal name (verified with SIN)
  - Proof of ownership (deed/title)
  - Property tax assessment
  - Mortgage details (if applicable)
  - Multiple properties (if owned)
- **Accessibility**: Properties must meet provincial standards
- **Features**:
  - Manage multiple properties
  - Tenant applications & screening
  - Rent collection & reporting
  - Maintenance coordination
  - Financial reporting for CRA
  - Renovation approvals

#### 5. **Corporate Owner / Real Estate Company**
- **Regulation Framework**: Corporate Law Act, Securities Act
- **Profile Requirements**:
  - Business Number (BN)
  - Corporate registration
  - Directors & officers list
  - Financial statements (audited)
  - Insurance certificates
  - Portfolio overview
- **Accessibility**: Corporate accessibility coordinator required
- **Features**:
  - Multi-site property management
  - Hierarchical staff roles
  - Bulk tenant management
  - Advanced analytics
  - Compliance dashboard
  - Investment vehicle tracking

#### 6. **Co-op Housing Member/Owner**
- **Regulation Framework**: Co-operatives Act
- **Profile Requirements**:
  - Co-op membership certificate
  - Share ownership record
  - Household composition
  - Income certification
  - Occupancy agreement
- **Accessibility**: Inclusive design required
- **Features**:
  - Voting on co-op decisions
  - Maintenance request system (communal)
  - Move rights management
  - Co-op financial transparency
  - Member communication board

---

### **Category 3: Institutional & Support**

#### 7. **Social Housing / Non-Profit Organization Manager**
- **Regulation Framework**: Charity Act, Social Housing Act (Provincial)
- **Profile Requirements**:
  - Charity Registration Number
  - Organizational structure
  - Board of Directors
  - Financial audits (annual)
  - Mission statement documentation
- **Accessibility**: Universal design + surplus accessibility
- **Features**:
  - Government subsidy management
  - Tenant support integration
  - Needs-based allocation
  - Social impact reporting
  - Grant management

#### 8. **Housing Authority / Government Manager**
- **Regulation Framework**: Housing act, Digital Services Act
- **Profile Requirements**:
  - Government ID + clearance
  - Agency authorization
  - Delegated authority limits
- **Accessibility**: 100% accessibility requirements
- **Features**:
  - Waitlist management (provincial)
  - Subsidy administration
  - Policy enforcement
  - Public reporting
  - Digital identity verification

---

### **Category 4: Support & Maintenance**

#### 9. **Building Manager / Superintendent**
- **Regulation Framework**: Residential Tenancies Act
- **Profile Requirements**:
  - Employment contract
  - Background check (vulnerable sector)
  - Training certifications
  - Emergency protocols
- **Accessibility**: Emergency accessibility contact point
- **Features**:
  - Daily operations
  - Maintenance coordination
  - Security management
  - Emergency response
  - Tenant communications

#### 10. **Support Services Provider**
- **Regulation Framework**: Social Services Act, Health Protection Act
- **Profile Requirements**:
  - Professional credentials
  - Insurance (liability)
  - Privacy/PIPEDA training
  - Reference verification
- **Accessibility**: Multiple language support
- **Features**:
  - Case management
  - Service appointment scheduling
  - Confidential notes
  - Support service linking

---

## 🏠 Property Types (5 Core)

| Type | Regulation | Rent Control | Max Occupancy | Support Services | Accessibility | Typical Owner |
|------|-----------|-------------|---------------|------------------|---------------|---------------|
| **PRIVATE_RENTAL** | Residential Tenancies Act | Provincial rules | Unit-specific | Optional | AODA basic | Individual/Corporate |
| **AFFORDABLE_HOUSING** | Housing Act | Geared-to-Income (GTI) | Per unit | Counseling | Enhanced | Non-profit |
| **SHELTER_HOUSING** | Homelessness Act | Free/Subsidized | Flexible | Case management | Universal | Government/NGO |
| **COOP_HOUSING** | Cooperatives Act | Member-set | Per bylaws | Communal | Design-based | Co-op Members |
| **SENIOR_HOUSING** | Accessibility for Seniors Act | Market/Subsidized | Age-restricted | Health services | Full accessibility | Specialized operators |

---

## 💼 Role-Based Permissions by Property Type

### Private Rental (Market)
- **Renter**: View lease → Pay rent → Request maintenance
- **Owner**: Screen tenants → Collect rent → Manage maintenance → 10% annual increase
- **Manager**: Daily ops → Tenant liaison → Maintenance dispatch

### Affordable Housing
- **Tenant**: View lease → Pay (if required) → Request maintenance → Access support services
- **Organization**: Apply subsidies → GTI calculation → Eligibility verification → Annual income review
- **Housing Authority**: Approve subsidies → Monitor outcomes → Policy enforcement

### Shelter Housing
- **Resident**: Access basics only → Contact case manager
- **Case Manager**: Full resident profile → Service coordination → Risk assessment
- **Facility Manager**: Room assignments → Capacity management → Emergency protocols

### Co-op Housing
- **Member**: Vote on decisions → Pay shares → Request maintenance → Subletting approval
- **Co-op Board**: Financial management → Maintenance → Major decisions → Member communication
- **Membership Committee**: New member approval → Buyback → Removal proceedings

---

## 📊 Multi-Property Owner Example

**John Smith, Portfolio:**
- **Property 1**: 12-unit private rental (Toronto, Market rate)
  - Role: Individual Owner
  - Regulation: Ontario RTA
  - Features: Tenant screening, rent collection
  
- **Property 2**: 8-unit affordable housing (Toronto, GTI)
  - Role: Individual Owner (partnered with Non-profit)
  - Regulation: Housing Act + RTA
  - Features: Subsidy coordination, income verification
  
- **Property 3**: 20-unit co-op (Toronto)
  - Role: Member-owner
  - Regulation: Cooperatives Act
  - Features: Voting, share management, member events
  
- **Property 4**: 15-unit shelter (Partnered with NGO)
  - Role: Housing board member (indirect)
  - Features: Policy input, reports

---

## 🔐 Data Privacy & Compliance

### PIPEDA (Personal Information Protection & Electronic Documents Act)
- Consent required for data collection
- Limited use principle
- Data security requirements
- Individual access rights

### AODA (Accessibility for Ontarians with Disabilities Act)
- Accessibility features documented
- Service accessibility standards
- Communication accessibility
- Emergency procedures documented

### Digital Government Act
- Secure identity verification
- Multi-factor authentication
- Encrypted data transmission
- Audit logging

---

## 🔄 User Verification Flow

```
1. Identity Verification (Government ID + Drivers License)
2. Financial Verification (Income docs, credit check consent)
3. Background Check (property-type dependent)
4. References (Employment/Personal per type)
5. Accessibility Needs Assessment (if required)
6. Document Upload & Verification
7. Final Approval & Role Assignment
```

---

## 📱 Expected System Capabilities

- Multi-property portfolio dashboard
- Role-based feature toggling
- Compliance reporting (automated)
- Income verification integration
- Support services marketplace
- Accessibility feature inventory
- Subsidy administration
- Digital document signing
- Mobile accessibility
- Multi-language support (French mandatory in QC)
