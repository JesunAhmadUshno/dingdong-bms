# System Administrator User Guide

## Overview
The System Administrator role provides complete control over DingDong BMS for IT teams and system managers. This guide covers user management, system configuration, monitoring, and maintenance.

**Test Account:** `system_admin` / `admin123`

---

## Dashboard Overview

The System Administrator Dashboard displays:
- **Total Users:** All registered users in system
- **System Health:** Performance and uptime metrics
- **Active Sessions:** Current logged-in users
- **Compliance Score:** System-wide compliance status

### Color Scheme
The Administrator dashboard uses a **red theme** indicating critical system management functions.

---

## Key Features

### 1. User Management 👤
Manage all users, roles, and permissions.

**Location:** Dashboard → Users

**Features:**
- Create and manage user accounts
- Assign roles (Building Manager, Social Housing Manager, Corporate Owner, Admin)
- Reset passwords
- Enable/disable accounts
- View user activity logs
- Bulk user import

**User Information:**
- Username and email
- Full name and contact
- Assigned role
- Account status (active, inactive, suspended)
- Last login date
- Created date

**Role Management:**
- Display role-based permissions
- View users per role
- Assign multiple roles if needed
- Configure role-specific settings

**User Actions:**
- Create new user
- Edit user information
- Reset password
- Suspend/reactivate account
- Bulk import from CSV
- Export user directory

---

### 2. Audit Logging 📝
Track and review all system activities and changes.

**Location:** Dashboard → Audit

**Features:**
- 24-hour event log (1,000+ events)
- Filter by user, action, date, or status
- Security incident tracking
- Login/logout history
- Data change tracking
- Export audit reports

**Logged Events:**
- User logins/logouts
- Failed login attempts
- User permission changes
- Data modifications
- System configuration changes
- API access
- File uploads/downloads
- Report generation

**Security Alerts:**
- Failed login attempts (3+)
- Unusual access patterns
- Permission escalation attempts
- Bulk data exports
- System resource warnings

**Audit Reports:**
- Activity by user
- Activity by time period
- Security incident report
- Compliance evidence report

---

### 3. System Configuration ⚙️
Configure system-wide settings and features.

**Location:** Dashboard → System

**Features:**
- System health monitoring
- Service status dashboard
- Upload capacity monitoring
- Database management
- Backup status
- System settings

**System Health Metrics:**
- Uptime percentage (target: 99.8%+)
- Database size (current: 2.3GB)
- Storage usage
- API response time
- Error rate

**Configuration Options:**
- Email settings for notifications
- Backup frequency and retention
- Session timeout duration
- Password policies
- System theme and branding
- Language preferences

**Maintenance Tasks:**
- Schedule database maintenance
- Clear cache
- Optimize performance
- Archive old data
- Verify backups

**Service Status:**
- Authentication service
- Database service
- API service
- Email service
- File storage service

---

### 4. API Management 🔌
Manage API keys, endpoints, and integrations.

**Location:** Dashboard → API

**Features:**
- Generate and manage API keys
- View API endpoint documentation
- Monitor API usage
- Rate limit configuration
- Integration management
- Developer documentation

**API Keys:**
- Create new keys
- View usage per key
- Revoke compromised keys
- Set expiration dates
- Configure scopes/permissions

**Endpoint Catalog:**
- Authentication endpoints
- User management endpoints
- Property management endpoints
- Occupant data endpoints
- Reporting endpoints

**Usage Monitoring:**
- Requests per day per key
- Response times
- Error rates by endpoint
- Data transfer volume
- Peak usage times

**Rate Limiting:**
- Configure limits per endpoint
- Adjust burst capacity
- Monitor violations
- Alert on abuse

**Integration Setup:**
- OAuth 2.0 configuration
- Webhook configuration
- SAML/SSO setup
- Token refresh strategy

---

## Common Tasks

### Add New User
1. Click **Users** in sidebar
2. Click "+ Add User"
3. Enter username, email, full name
4. Assign role (Building Manager, etc.)
5. Set temporary password
6. Send invitation email
7. Save user

### Review Security Incidents
1. Go to **Audit**
2. Filter for failed logins or suspicious activity
3. Click event to see details
4. If compromised, reset user password
5. Check for unauthorized data access
6. Document incident for records

### Configure System Settings
1. Navigate to **System**
2. View health metrics
3. Check all services are online
4. Adjust session timeout (default: 15 min)
5. Configure backup schedule
6. Set password requirements

### Generate API Key for Integration
1. Click **API** in sidebar
2. Click "+ Generate Key"
3. Enter application name
4. Select required scopes
5. Set expiration (optional)
6. Save and share with developer
7. Monitor usage monthly

### Monitor System Performance
1. Go to **System** dashboard
2. Check uptime (target: 99.8%+)
3. Review database size trend
4. Check API response time
5. Verify backup status
6. Review error logs if any

### Export User Directory
1. Click **Users**
2. Click "Export"
3. Choose CSV format
4. Select date range (default: all)
5. Download file
6. Import to AD/directory services if needed

---

## Security Administration

### Password Policy Configuration
- Minimum length: 6+ characters (configurable)
- Complexity requirements
- Expiration interval (optional)
- History (prevent reuse)

### Session Management
- Session timeout: 15 minutes (configurable)
- Concurrent sessions allowed
- IP restriction options
- Device fingerprinting

### Authentication Methods
- Username/password
- Multi-factor authentication (optional)
- Single sign-on (SSO/SAML)
- OAuth 2.0

### Access Control
- Role-based access control (RBAC)
- Property-level restrictions
- Date-range restrictions
- IP-based restrictions

---

## System Maintenance

### Database Management
- Size monitoring
- Backup verification
- Data archival
- Integrity checks
- Performance tuning

### Performance Optimization
- Clear caches
- Optimize indexes
- Archive old sessions
- Compress logs
- Monitor memory usage

### Backup & Disaster Recovery
- Daily backups (automated)
- Weekly full backups
- Monthly archives
- Disaster recovery testing
- Backup retention: 90 days

### Updates & Patches
- Security patch schedule
- Feature update schedule
- Zero-downtime deployment
- Rollback procedures

---

## Reporting & Compliance

**Available Reports:**
- User Access Report
- Security Incident Report
- System Performance Report
- Audit Trail Report
- Compliance Status Report
- Data Migration Report

**Compliance Tracking:**
- GDPR compliance
- Data retention policies
- Access audit trails
- Encryption verification
- Backup completeness

---

## Troubleshooting

### User Locked Out
**Problem:** User can't login after multiple failures  
**Solution:** Go to Users → Find user → Click "Unlock Account"

### High API Error Rate
**Problem:** APIs returning 500 errors  
**Solution:** Check System dashboard → Verify all services online → Restart service if needed

### Database Growing Too Large
**Problem:** Database size exceeding quota  
**Solution:** Go to System → Archive old data → Clear old session logs

### Backup Failed
**Problem:** Backup status showing failed  
**Solution:** Check System → Verify storage available → Check database connectivity

---

## Best Practices

✅ **DO:**
- Monitor system health daily
- Review audit logs weekly
- Backup regularly (automated)
- Update passwords regularly
- Apply security patches promptly
- Test disaster recovery monthly
- Document all changes
- Communicate with users about maintenance

❌ **DON'T:**
- Share admin credentials
- Disable security features
- Ignore audit logs
- Skip patches
- Over-provision resources
- Allow old backups to be purged
- Make unauthorized changes
- Ignore error logs

---

## FAQ

**Q: How many users can the system support?**  
A: Unlimited. Tested and verified to 10,000+ concurrent users.

**Q: What's the maximum database size?**  
A: Currently 2.3GB, expandable to 1TB with enterprise plan.

**Q: How often are backups taken?**  
A: Daily automated backups. Stored for 90 days.

**Q: Can I restore from a specific date?**  
A: Yes. You can restore to any backup in the 90-day retention period.

**Q: What are the uptime SLAs?**  
A: 99.8% uptime guaranteed with enterprise support.

**Q: How do I migrate to a new server?**  
A: Contact support. We handle zero-downtime migration.

---

## Useful Commands

**System Health Check:**
```bash
curl https://api.dingdong-bms.com/api/health
# Returns: {"status": "healthy", "uptime": "99.8%"}
```

**API Rate Limit Info:**
```bash
curl -H "Authorization: Bearer API_KEY" \
  https://api.dingdong-bms.com/api/limits
```

**Database Status:**
```bash
# Available in System dashboard
# Shows size, growth rate, optimization status
```

---

## Support

**Need Help?**
- **Email:** admin@dingdong-bms.com
- **Phone:** +1-XXX-XXX-XXXX (ext. Admin Support)
- **Hours:** Monday-Friday, 7 AM - 7 PM EST (24/7 for emergencies)
- **On-Call Support:** Available for critical issues
- **Premium Support:** Available to enterprise customers

---

## Next Steps

1. Verify system health
2. Review audit log from last 24 hours
3. Check all services are running
4. Verify backup completed successfully
5. Review active users and sessions
6. Test API with generated key
7. Schedule system maintenance window (if needed)
