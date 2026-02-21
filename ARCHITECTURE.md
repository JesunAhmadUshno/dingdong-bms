# Building Management System (BMS) - "DingDong" Architecture

## Overview
A dynamic, scalable Building Management System treating the building as a "living organism". The system integrates IoT (Hardware), Cloud Infrastructure (Software), and User Experience.

## Tech Stack
- **Frontend:** Next.js (React)
- **Backend:** Serverless / Cloud Functions
- **Database:** Hybrid
    - **Relational (SQL):** Identity, Billing, Requisition
    - **Time-Series / NoSQL:** IoT sensors, Elevators, Energy
- **Real-time:** WebSockets / MQTT

## User Roles & Access Control 🔐

The system distinguishes between different types of occupants and management to tailor the dashboard visibility and permissions.

### 1. Residents / Occupants
- **Renter (Short-term/Standard):**
  - **Visibility:** Rent payments, basic maintenance requests, standard amenity booking.
  - **Restrictions:** No access to structural modification requests or long-term lease negotiations.
- **Leaseholder (Long-term/Corporate):**
  - **Visibility:** Lease agreement terms, renewal options, subletting controls (if permitted), advanced billing history.
- **Owner (Property Owner):**
  - **Visibility:** Property value tracking, HOA/Management fee payments, community voting rights, renovation requests, long-term asset management.
  - **Permissions:** Can authorize maintenance tasks that require owner approval.

### 2. Management & Administration
- **Building Manager:**
  - **Visibility:** Full operational overview (all units), tenant directory, critical system alerts, financial reports.
  - **Permissions:** Approve move-ins, override security protocols, issue broadcast notifications.

## Core Modules & Functional Pillars

### 1. Identity & Access 👤
- **Tenant Onboarding:** Digital keys, database records customized by role (Renter vs Owner).
- **Visitor Management:** Access control for guests.
- **Parking:** Spot assignment, availability tracking.

### 2. Operations & IoT 🏗️
- **Elevators:** Status monitoring, optimization.
- **Gardens:** Irrigation, environmental monitoring.
- **Safety & Emergency:** Smoke detection, automated lockdown, fire exits.

### 3. Fiscal & Workflow 💳
- **Billing:** Automated invoicing, payment processing.
- **Requisition:** Maintenance requests, inventory.
- **Earning/Spending:** Concierge services, amenity booking.

### 4. Logistics 🚗
- **Commute:** Traffic/transit integration.
- **Meeting Room Booking:** Scheduling and occupancy sensing.

### 5. Sustainability 🌿
- **Air Quality:** IAQ monitoring, ventilation adjustment.
- **Energy Optimization:** Predictive HVAC, smart lighting.
- **Waste Management:** Smart bins, recycling tracking.

### 6. Experience ✨
- **Concierge:** AI-driven assistance.
- **Wayfinding:** Indoor navigation.
- **Community:** Social feed, event announcements.

## Architecture Patterns
- **Hybrid Communication:**
    - **Event-Driven (Pub/Sub):** For real-time, critical systems (Safety, Elevators).
    - **Request-Response (API):** For transactional, administrative tasks (Billing, Onboarding).
- **Scalability:** Microservices / Serverless Functions.

## SDLC & Methodology
- **Process:** Iterative & Incremental (Agile).
- **Phases:**
    1. **Walking Skeleton:** Core infrastructure.
    2. **Functional Zones:** Iterative addition of modules (e.g., Visitor & Parking Zone).
