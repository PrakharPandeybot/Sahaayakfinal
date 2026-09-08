# Sahaayak API Documentation

## Base URL

http://localhost:5000/api

---

# Authentication APIs

## 1. Register

POST /auth/register

Access: Public

### Body

```json
{
  "name": "Naman",
  "email": "naman@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "worker",
  "language": "hi"
}
```

## 2. Login

POST /auth/login

Access: Public

### Body

```json
{
  "email": "naman@example.com",
  "password": "password123"
}
```

## 3. Get Current User

GET /auth/me

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

---

# Worker APIs

All worker APIs require:

Authorization: Bearer <JWT_TOKEN>

Role required: worker

## 4. Create Worker Profile

POST /workers/profile

Access: Authenticated Worker

### Body

```json
{
  "occupation": "Electrician",
  "skills": ["Wiring", "Repair"],
  "experience": 3,
  "certifications": [],
  "availability": true,
  "serviceRadius": 10,
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  }
}
```

## 5. Get My Worker Profile

GET /workers/profile

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

## 6. Update Worker Profile

PUT /workers/profile

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "occupation": "Electrician",
  "skills": ["Wiring", "Repair", "Installation"],
  "experience": 4,
  "serviceRadius": 15,
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  }
}
```

## 7. Update Worker Availability

PATCH /workers/availability

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "availability": true
}
```

---

# Service APIs

## 8. Get All Services

GET /services

Access: Public

## 9. Get Service By ID

GET /services/:id

Access: Public

## 10. Create Service

POST /services

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "name": "Electrical Repair",
  "category": "Electrical",
  "description": "Home electrical repair service",
  "basePrice": 500,
  "estimatedDuration": 60
}
```

## 11. Update Service

PUT /services/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "name": "Electrical Repair",
  "category": "Electrical",
  "description": "Home electrical repair service",
  "basePrice": 600,
  "estimatedDuration": 90
}
```

## 12. Delete / Deactivate Service

DELETE /services/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

---

# Booking APIs

All booking APIs require:

Authorization: Bearer <JWT_TOKEN>

## 13. Create Booking

POST /bookings

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "service": "<SERVICE_ID>",
  "scheduledDate": "2026-09-10T10:00:00.000Z",
  "address": "123 Main Street, Delhi",
  "location": {
    "type": "Point",
    "coordinates": [77.1025, 28.7041]
  },
  "description": "Need electrical repair at home",
  "price": 500
}
```

## 14. Get My Bookings

GET /bookings/my

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>

## 15. Get Worker Bookings

GET /bookings/worker

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

## 16. Get Booking By ID

GET /bookings/:id

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

## 17. Accept Booking

PATCH /bookings/:id/accept

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

## 18. Reject Booking

PATCH /bookings/:id/reject

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

## 19. Update Booking Status

PATCH /bookings/:id/status

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "status": "in-progress"
}
```

Possible status values:

- accepted
- in-progress
- completed
- cancelled

## 20. Cancel Booking

PATCH /bookings/:id/cancel

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>

---

# Payment APIs

All payment APIs require:

Authorization: Bearer <JWT_TOKEN>

## 21. Create Payment

POST /payments

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "booking": "<BOOKING_ID>",
  "paymentMethod": "upi"
}
```

## 22. Get My Payments

GET /payments/my

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>

## 23. Get Payment By ID

GET /payments/:id

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>

## 24. Update Payment Status

PATCH /payments/:id/status

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "paymentStatus": "paid",
  "transactionId": "TXN123456789"
}
```

Possible payment methods:

- cash
- upi
- card
- online

Possible payment statuses:

- pending
- paid
- failed
- refunded

---

# Welfare APIs

## 25. Get All Welfare Schemes

GET /welfare

Access: Public

### Query Parameter

category

Example:

GET /welfare?category=health

## 26. Get Welfare Scheme By ID

GET /welfare/:id

Access: Public

## 27. Create Welfare Scheme

POST /welfare

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "title": "Health Insurance Scheme",
  "description": "Healthcare support scheme for eligible workers",
  "provider": "Government",
  "category": "Health",
  "benefits": "Financial assistance for healthcare expenses",
  "eligibility": "Eligible registered workers",
  "requiredDocuments": [
    "Aadhaar Card",
    "Income Certificate"
  ],
  "applicationProcess": "Apply through the official government portal",
  "applicationUrl": "https://example.gov.in"
}
```

## 28. Update Welfare Scheme

PUT /welfare/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "title": "Updated Health Insurance Scheme",
  "description": "Updated healthcare support scheme",
  "benefits": "Updated benefits",
  "eligibility": "Updated eligibility"
}
```

## 29. Delete / Deactivate Welfare Scheme

DELETE /welfare/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

---

# Scheme APIs

## 30. Get All Schemes

GET /schemes

Access: Public

### Query Parameter

category

Example:

GET /schemes?category=health

## 31. Get Scheme By ID

GET /schemes/:id

Access: Public

## 32. Create Scheme

POST /schemes

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "title": "Health Insurance Scheme",
  "description": "Healthcare support scheme for eligible workers",
  "provider": "Government",
  "category": "Health",
  "benefits": "Financial assistance for healthcare expenses",
  "eligibility": "Eligible registered workers",
  "requiredDocuments": [
    "Aadhaar Card",
    "Income Certificate"
  ],
  "applicationProcess": "Apply through the official government portal",
  "applicationUrl": "https://example.gov.in"
}
```

## 33. Update Scheme

PUT /schemes/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "title": "Updated Health Insurance Scheme",
  "description": "Updated healthcare support scheme",
  "benefits": "Updated benefits",
  "eligibility": "Updated eligibility"
}
```

## 34. Delete / Deactivate Scheme

DELETE /schemes/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Smart Scheme Eligibility Fields

Schemes can optionally contain the following fields for smart worker recommendations:

- `targetOccupations` — occupations targeted by the scheme
- `minimumAge` — minimum eligible age
- `maximumAge` — maximum eligible age
- `maximumIncome` — maximum income allowed
- `eligibleStates` — states where the scheme applies
- `requiredSkills` — skills relevant to the scheme
- `eligibleWorkerTypes` — `worker`, `customer`, or `all`

The recommendation system uses the worker's profile information to calculate an eligibility score and return matching schemes.

---

# Admin APIs

All Admin APIs require:

Authorization: Bearer <JWT_TOKEN>

Access: Authenticated Admin

## 35. Get Admin Dashboard Statistics

GET /admin/dashboard

### Header

Authorization: Bearer <JWT_TOKEN>

### Response

```json
{
  "success": true,
  "statistics": {
    "totalUsers": 0,
    "totalWorkers": 0,
    "totalServices": 0,
    "totalBookings": 0,
    "totalPayments": 0,
    "totalWelfareSchemes": 0,
    "totalSchemes": 0,
    "pendingWorkers": 0,
    "pendingBookings": 0
  }
}
```

## 36. Get Workers For Admin

GET /admin/workers

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Query Parameter

status

Possible values:

- pending
- verified
- rejected

Example:

GET /admin/workers?status=pending

## 37. Update Worker Verification Status

PATCH /admin/workers/:id/verification

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "verificationStatus": "verified"
}
```

Possible verification statuses:

- pending
- verified
- rejected

When a worker is rejected or moved back to pending, their availability is automatically set to false.

---

# Review & Rating APIs

## 38. Create Review

POST /reviews

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "booking": "<BOOKING_ID>",
  "rating": 5,
  "comment": "Excellent service and very professional."
}
```

### Rules

- Only the customer who owns the booking can create the review.
- The booking must have status `completed`.
- The booking must have an assigned worker.
- Only one review can be created per booking.
- Rating must be an integer from 1 to 5.

## 39. Get Worker Reviews

GET /reviews/worker/:workerId

Access: Public

### Example

GET /reviews/worker/<WORKER_ID>

Returns the reviews and ratings submitted for the specified worker.

---

# Insurance APIs

## 40. Get All Insurance Plans

GET /insurance

Access: Public

Returns all active insurance plans available on the platform.

## 41. Get Insurance Plan By ID

GET /insurance/:id

Access: Public

Returns details of a specific active insurance plan.

## 42. Create Insurance Plan

POST /insurance

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "provider": "LIC",
  "planName": "Worker Protection Plan",
  "description": "Insurance coverage designed for eligible workers",
  "coverageAmount": 500000,
  "premiumAmount": 1200,
  "premiumFrequency": "yearly",
  "eligibility": "Registered workers meeting the eligibility criteria",
  "benefits": [
    "Accidental coverage",
    "Medical assistance"
  ],
  "documentsRequired": [
    "Aadhaar Card",
    "Income Certificate"
  ],
  "applicationUrl": "https://example.gov.in"
}
```

## 43. Update Insurance Plan

PUT /insurance/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "planName": "Updated Worker Protection Plan",
  "premiumAmount": 1300,
  "benefits": [
    "Accidental coverage",
    "Medical assistance",
    "Emergency support"
  ]
}
```

## 44. Delete / Deactivate Insurance Plan

DELETE /insurance/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

This deactivates the insurance plan instead of permanently deleting it.

---

# User Profile APIs

## 45. Get My Profile

GET /users/profile

Access: Authenticated User

### Header

Authorization: Bearer <JWT_TOKEN>

### Response

```json
{
  "success": true,
  "user": {
    "id": "<USER_ID>",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "9876543210",
    "role": "customer",
    "language": "en",
    "isVerified": false
  }
}
```

## 46. Update My Profile

PATCH /users/profile

Access: Authenticated User

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "name": "Updated Name",
  "phone": "9876543210",
  "language": "hi"
}
```

### Updatable Fields

name

phone

language

Users cannot change their role, verification status, email or password through this endpoint.

### Worker Profile Fields

Worker users can also have:

- `occupation`
- `skills`
- `certifications`
- `age`
- `income`
- `location.state`
- `location.city`
- `location.address`

These fields are used by features such as smart scheme recommendations and worker training.

---

# Notification APIs

## 47. Get My Notifications

GET /notifications

Access: Authenticated User

### Header

Authorization: Bearer <JWT_TOKEN>

Returns all notifications belonging to the currently logged-in user.

## 48. Mark Notification As Read

PATCH /notifications/:id/read

Access: Authenticated User

### Header

Authorization: Bearer <JWT_TOKEN>

Marks a specific notification as read.

## 49. Mark All Notifications As Read

PATCH /notifications/read-all

Access: Authenticated User

### Header

Authorization: Bearer <JWT_TOKEN>

Marks all unread notifications belonging to the current user as read.

---

# Health Check

## 50. Check Backend Status

GET /api/health

Access: Public

This endpoint checks whether the backend is running.

---

# Worker Salary & Income Security APIs

These APIs implement the worker income-security system.

The system provides:

- Guaranteed base salary for eligible workers.
- A monthly job limit.
- Overtime/incentive pay for jobs completed above the monthly limit.
- Performance bonus and administrative adjustment support.
- Salary history and payment status tracking.

The base salary is not reduced when platform demand is low.

## 51. Get My Current Salary

GET /worker-salary/my

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

### Response

Returns the current month's salary record, including:

- `baseSalary`
- `monthlyJobLimit`
- `completedJobs`
- `extraJobs`
- `overtimeRate`
- `overtimePay`
- `performanceBonus`
- `adjustment`
- `finalSalary`
- `status`

## 52. Get My Salary History

GET /worker-salary/my/history

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

Returns the worker's salary records for previous and current months.

## 53. Get All Worker Salaries

GET /worker-salary

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

Returns salary records for workers for admin management.

## 54. Recalculate Worker Salary

PUT /worker-salary/:id/recalculate

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

Recalculates salary using:

Final Salary = Base Salary + Overtime Pay + Performance Bonus + Adjustment

Overtime Pay = Extra Jobs × Overtime Rate

Extra Jobs = max(0, Completed Jobs - Monthly Job Limit)

## 55. Mark Worker Salary As Paid

PUT /worker-salary/:id/pay

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

Marks the selected salary record as paid and records the payment timestamp.

### Automatic Job Count Update

When a booking changes to `completed`, the worker's current-month salary record is automatically updated.

The system:

1. Increments `completedJobs`.
2. Calculates `extraJobs` after the monthly job limit.
3. Calculates overtime pay.
4. Updates `finalSalary`.
5. Sends the worker an earnings notification.

---

# Training Program APIs

## 56. Get Active Training Programs

GET /training

Access: Authenticated User

Returns active training programs available on the platform.

## 57. Get Training Program By ID

GET /training/:id

Access: Authenticated User

Returns details of a specific training program.

## 58. Create Training Program

POST /training

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "title": "Advanced Electrical Safety",
  "description": "Training program focused on electrical safety and modern repair practices.",
  "provider": "Sahaayak Training Center",
  "skills": [
    "Electrical Safety",
    "Advanced Wiring"
  ],
  "duration": "4 weeks",
  "eligibility": "Registered electricians",
  "certification": "Advanced Electrical Safety Certificate",
  "applicationUrl": "https://example.gov.in/training",
  "isFree": true
}
```

## 59. Update Training Program

PUT /training/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "title": "Updated Electrical Safety Training",
  "description": "Updated training description",
  "duration": "6 weeks",
  "isFree": true
}
```

## 60. Delete / Deactivate Training Program

DELETE /training/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

This deactivates the training program instead of permanently deleting it.

---

# Worker Training APIs

## 61. Enroll In Training

POST /worker-training/:trainingId/enroll

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

Enrolls the currently logged-in worker in the selected training program.

## 62. Get My Training Enrollments

GET /worker-training/my

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

Returns the worker's training enrollments with program details.

## 63. Get My Training Enrollment By ID

GET /worker-training/my/:id

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

Returns a specific training enrollment belonging to the logged-in worker.

## 64. Update My Training Status

PUT /worker-training/my/:id/status

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

```json
{
  "status": "completed",
  "certificateUrl": "https://example.com/certificate.pdf"
}
```

Possible statuses:

- enrolled
- in-progress
- completed
- cancelled

When a worker completes training:

- The completion date is recorded.
- The certificate URL can be stored.
- Training skills are added to the worker profile.
- The training certification is added to the worker profile.
- A training-completion notification is sent.

## 65. Cancel My Training Enrollment

DELETE /worker-training/my/:id

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

Cancels the worker's training enrollment. Completed training cannot be cancelled.

---

# Smart Scheme Recommendation API

## 66. Get My Recommended Schemes

GET /schemes/recommended

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

Returns active schemes ranked according to the logged-in worker's profile.

The recommendation system considers available profile information such as:

- Worker type
- Age
- Income
- State
- Occupation
- Skills

Each recommendation includes an eligibility result, score, reasons, and warnings.

The recommendation is an informational matching system. Final eligibility is determined by the official scheme authority.
