# DingDong BMS API Documentation

## Overview
DingDong Building Management System provides RESTful APIs for authentication, session management, and occupant data operations.

**Base URL (Production):** `https://api.dingdong-bms.com`  
**Base URL (Development):** `http://localhost:3000`

---

## Authentication

### Login
Create a new user session with credentials.

**Endpoint:** `POST /api/auth/session`

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "username": "string (3-50 chars)",
  "password": "string (6+ chars)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "sessionId": "hex-string-64-chars",
  "token": "hex-string-64-chars",
  "user": {
    "user_id": 1,
    "username": "admin_manager",
    "email": "manager@example.com",
    "full_name": "Building Manager",
    "phone": "+1-XXX-XXX-XXXX",
    "legal_sin_or_bn": "123-45-6789",
    "profile_type": "Individual",
    "role_id": 8,
    "status": "verified"
  }
}
```

**Error Response (400):**
```json
{
  "error": "VALIDATION_ERROR",
  "statusCode": 400,
  "errors": [
    {
      "path": "username",
      "message": "Username must be between 3 and 50 characters"
    }
  ]
}
```

**Error Response (401):**
```json
{
  "error": "AUTHENTICATION_ERROR",
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

### Validate Session
Check if a session is still active and retrieve session data.

**Endpoint:** `GET /api/auth/session`

**Request Headers:**
```json
{
  "x-session-id": "session-id-from-login",
  "x-session-token": "token-from-login"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "session": {
    "user_id": 1,
    "username": "admin_manager",
    "email": "manager@example.com",
    "full_name": "Building Manager",
    "phone": "+1-XXX-XXX-XXXX",
    "legal_sin_or_bn": "123-45-6789",
    "profile_type": "Individual",
    "role_id": 8,
    "role_name": "BUILDING_MANAGER",
    "properties": [],
    "status": "verified"
  }
}
```

**Error Response (401):**
```json
{
  "error": "AUTHENTICATION_ERROR",
  "statusCode": 401,
  "message": "Session expired or invalid"
}
```

---

### Logout
Invalidate the current session.

**Endpoint:** `DELETE /api/auth/session`

**Request Headers:**
```json
{
  "x-session-id": "session-id-from-login",
  "x-session-token": "token-from-login"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

**Error Response (401):**
```json
{
  "error": "AUTHENTICATION_ERROR",
  "statusCode": 401,
  "message": "Invalid session"
}
```

---

## Occupants API

### Get All Occupants
Retrieve a list of all registered occupants.

**Endpoint:** `GET /api/occupants`

**Request Headers:**
```json
{
  "x-session-id": "session-id",
  "x-session-token": "token"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "occupant_id": 1,
      "lease_id": 1,
      "property_id": 1,
      "unit_id": 101,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-XXX-XXX-XXXX",
      "relationshipToLeaseholder": "Primary Leaseholder",
      "registrationDate": "2024-01-15",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Error Handling

All endpoints return standardized error responses with appropriate HTTP status codes:

| Status Code | Type | Description |
|-----------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid input or missing required fields |
| 401 | AUTHENTICATION_ERROR | Missing, invalid, or expired session |
| 403 | AUTHORIZATION_ERROR | User lacks permission for this action |
| 404 | NOT_FOUND | Requested resource not found |
| 500 | INTERNAL_ERROR | Server error (retry later) |

---

## Rate Limiting

API endpoints are rate-limited to:
- **Authentication:** 5 requests per minute per IP
- **General API:** 100 requests per minute per session
- **Data Export:** 10 requests per minute per session

Exceeding limits returns `429 Too Many Requests`.

---

## Security

### Headers
Always include authentication headers for protected endpoints:
```
x-session-id: [from login response]
x-session-token: [from login response]
```

### SSL/TLS
All production API endpoints require HTTPS.

### CORS Policy
- Origins: `https://dingdong-bms.com`, `https://app.dingdong-bms.com`
- Methods: GET, POST, PUT, DELETE
- Credentials: Allowed

---

## Code Examples

### Login (JavaScript/Fetch)
```typescript
const response = await fetch('/api/auth/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin_manager',
    password: 'asade123'
  })
});

const result = await response.json();
if (result.success) {
  localStorage.setItem('sessionId', result.sessionId);
  localStorage.setItem('sessionToken', result.token);
}
```

### Validate Session (JavaScript/Fetch)
```typescript
const sessionId = localStorage.getItem('sessionId');
const token = localStorage.getItem('sessionToken');

const response = await fetch('/api/auth/session', {
  method: 'GET',
  headers: {
    'x-session-id': sessionId,
    'x-session-token': token
  }
});

const result = await response.json();
console.log(result.session); // Current user data
```

### Get Occupants (JavaScript/Fetch)
```typescript
const sessionId = localStorage.getItem('sessionId');
const token = localStorage.getItem('sessionToken');

const response = await fetch('/api/occupants', {
  method: 'GET',
  headers: {
    'x-session-id': sessionId,
    'x-session-token': token
  }
});

const result = await response.json();
console.log(result.data); // List of occupants
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Authentication endpoints
- Session management
- Occupant data operations

---

## Support

For API support and documentation updates, contact: **api-support@dingdong-bms.com**
