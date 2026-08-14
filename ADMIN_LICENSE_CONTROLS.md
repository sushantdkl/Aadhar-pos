# Admin Central - License Management Controls

## Overview
The Admin Central system provides complete control over all restaurant licenses, including activation periods, grace periods, and expiry dates.

## License Management Features

### 1. **Add/Remove Days**
- **Location:** Restaurant Detail Page → "Add/Remove Days" button
- **Functionality:**
  - Add days: Enter positive number (e.g., 30 to add 30 days)
  - Remove days: Enter negative number (e.g., -7 to remove 7 days)
  - Shows preview of new expiry date before confirming
- **Use Cases:**
  - Quick extensions for loyal customers
  - Reduce time for refund scenarios
  - Adjust for promotional offers

### 2. **Set Custom Expiry Date**
- **Location:** Restaurant Detail Page → "Set Date" button
- **Functionality:**
  - Pick any future date from calendar
  - Sets expiry to end of selected day (23:59:59)
  - Overrides current expiry completely
- **Use Cases:**
  - Align expiry with specific billing cycles
  - Set exact renewal dates
  - Custom contract terms

### 3. **Grace Period Control**
- **Location:** Restaurant Detail Page → "Grace Period" button
- **Functionality:**
  - Set grace period from 0 to 90 days
  - Determines how many days after expiry restaurant can still operate
  - Default: 5 days
- **Use Cases:**
  - Flexible grace for payment processing delays
  - VIP customers get extended grace periods
  - Zero grace for suspended accounts
- **Impact:**
  - During grace period: Restaurant sees warning banner but can operate
  - After grace ends: Complete system lockout, only settings page accessible

### 4. **Suspend/Activate**
- **Location:** Restaurant Detail Page → "Suspend" or "Activate" button
- **Functionality:**
  - Immediately suspends or activates restaurant
  - Updates both restaurant and license status
  - Cannot be bypassed by restaurant
- **Use Cases:**
  - Payment disputes
  - Terms of service violations
  - Temporary account holds
  - Reactivation after issue resolution

## API Endpoints

### PATCH `/api/restaurants-firebase/[id]`

#### 1. Extend Expiry (Add/Remove Days)
```json
{
  "action": "extend_expiry",
  "additional_days": 30  // Can be negative
}
```

#### 2. Set Custom Expiry Date
```json
{
  "action": "set_custom_expiry",
  "expiry_date": "2026-12-31"
}
```

#### 3. Update Grace Period
```json
{
  "action": "extend_grace",
  "grace_days": 10
}
```

#### 4. Suspend Restaurant
```json
{
  "action": "suspend"
}
```

#### 5. Activate Restaurant
```json
{
  "action": "activate"
}
```

## License Lifecycle

### Active License
- **Status:** Active
- **Display:** Green badge, days remaining shown
- **Restaurant Access:** Full system access
- **Admin Actions:** All controls available

### Expiring Soon (≤7 days)
- **Status:** Active but expiring
- **Display:** Yellow warning banner
- **Restaurant Access:** Full access with warning
- **Admin Actions:** Extend/renew recommended

### Expired (In Grace Period)
- **Status:** Expired but grace active
- **Display:** Red warning banner with grace days remaining
- **Restaurant Access:** Full access with urgent warning
- **Admin Actions:** Extend immediately or suspend

### Completely Expired (Grace Ended)
- **Status:** Expired and grace ended
- **Display:** Full system lockout redirect
- **Restaurant Access:** Settings page only, can update license
- **Admin Actions:** Must extend or provide new license

### Suspended
- **Status:** Manually suspended by admin
- **Display:** System lockout
- **Restaurant Access:** Blocked
- **Admin Actions:** Can activate to restore access

## Firebase Data Structure

### License Document
```javascript
{
  license_key: "POS-2025-XXXXXXXX-XXXXXXXX",
  restaurant_id: "restaurant_doc_id",
  plan_type: "monthly" | "annual" | "lifetime",
  start_date: "2025-01-01T00:00:00.000Z",
  expiry_date: "2026-12-12T23:59:59.999Z",
  grace_period_days: 5,  // Admin controlled
  status: "active" | "expired" | "suspended",
  last_verified: "2025-12-17T10:30:00.000Z",
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-12-17T10:30:00.000Z"
}
```

## Best Practices

### Grace Period Recommendations
- **Standard:** 5 days (default)
- **VIP/Enterprise:** 10-15 days
- **Trial/Free:** 0-2 days
- **Payment Processing:** 7 days
- **Maximum:** 90 days (system limit)

### Extension Guidelines
- **Monthly Plans:** Extend by 30 days
- **Annual Plans:** Extend by 365 days
- **Custom Adjustments:** Use negative days for refunds
- **Emergency Extensions:** Quick 7-day grace increases

### Suspension Protocol
1. Contact restaurant first
2. Document reason for suspension
3. Suspend via admin panel
4. Monitor for resolution
5. Reactivate when cleared

## Security Features

1. **Admin Authentication:** All actions require admin login
2. **Audit Trail:** All changes logged with timestamps
3. **Firebase Security Rules:** Prevents unauthorized access
4. **License Verification:** Restaurant systems verify with Firebase every 24 hours
5. **Offline Enforcement:** License file synced locally, middleware enforces on every request

## Future Enhancements

- [ ] Email notifications for expiry warnings
- [ ] Automatic renewal workflows
- [ ] Payment gateway integration
- [ ] Multi-tier grace periods based on plan type
- [ ] License transfer between restaurants
- [ ] Bulk operations for multiple restaurants
- [ ] Analytics dashboard for license usage
- [ ] Webhook support for license status changes
