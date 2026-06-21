# Firebase Firestore Schema for EcoStep

## Overview
EcoStep uses Firebase/Firestore for real-time database storage and Firebase Authentication for user management with Google Sign-In.

---

## Database Schema

### Collection: `users`
Stores user profile information and preferences.

```
users/
├── {userId}
│   ├── email: string (user's email from Google)
│   ├── displayName: string (user's display name from Google)
│   ├── photoURL: string (user's profile picture URL)
│   ├── createdAt: Timestamp (account creation date)
│   ├── updatedAt: Timestamp (last update date)
│   ├── preferences: object
│   │   ├── theme: string ("light" | "dark")
│   │   └── units: string ("metric" | "imperial")
│   └── stats: object
│       ├── totalCalculations: number
│       └── lastCalculation: Timestamp
```

**Example Document:**
```json
{
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://lh3.googleusercontent.com/...",
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "preferences": {
    "theme": "light",
    "units": "metric"
  },
  "stats": {
    "totalCalculations": 24,
    "lastCalculation": Timestamp
  }
}
```

**Firestore Rules:**
```
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

---

### Collection: `footprints`
Stores each carbon footprint calculation record.

```
footprints/
├── {recordId}
│   ├── userId: string (reference to user)
│   ├── month: string (YYYY-MM format, e.g., "2026-06")
│   ├── createdAt: Timestamp
│   ├── electricity: number (kWh)
│   ├── transport: number (km/week)
│   ├── totalCO2: number (kg CO₂/month)
│   ├── breakdown: object (detailed emissions)
│   │   ├── electricityCO2: number
│   │   ├── transportCO2: number
│   │   ├── dietCO2: number
│   │   ├── wasteCO2: number
│   │   ├── heatingCO2: number
│   │   └── waterCO2: number
│   └── details: object (input data for calculation)
│       ├── electricity: number
│       ├── renewablePercentage: number
│       ├── carKm: number
│       ├── carType: string ("small" | "medium" | "large")
│       ├── publicTransit: number
│       ├── flightHours: number
│       ├── meatServings: number
│       ├── veganDays: number
│       ├── recyclingRate: number
│       ├── wasteKg: number
│       ├── heatingType: string ("gas" | "electric" | "oil" | "renewable")
│       ├── heatingUsage: number (0-100%)
│       └── waterUsage: number (liters)
```

**Example Document:**
```json
{
  "userId": "user123",
  "month": "2026-06",
  "createdAt": Timestamp,
  "electricity": 250,
  "transport": 100,
  "totalCO2": 142.5,
  "breakdown": {
    "electricityCO2": 100,
    "transportCO2": 86.6,
    "dietCO2": 35.0,
    "wasteCO2": 8.5,
    "heatingCO2": 20.0,
    "waterCO2": 0.04
  },
  "details": {
    "electricity": 250,
    "renewablePercentage": 0,
    "carKm": 50,
    "carType": "medium",
    "publicTransit": 30,
    "flightHours": 0,
    "meatServings": 3,
    "veganDays": 1,
    "recyclingRate": 50,
    "wasteKg": 5,
    "heatingType": "gas",
    "heatingUsage": 100,
    "waterUsage": 150
  }
}
```

**Firestore Rules:**
```
match /footprints/{recordId} {
  allow read, write: if request.auth.uid == resource.data.userId;
  allow create: if request.auth.uid == request.resource.data.userId;
}
```

---

### Collection: `challenges`
Stores challenge/goal data for gamification.

```
challenges/
├── {challengeId}
│   ├── title: string
│   ├── description: string
│   ├── target: number (kg CO₂)
│   ├── startDate: Timestamp
│   ├── endDate: Timestamp
│   ├── rewards: array[string]
│   └── active: boolean
```

**Example Document:**
```json
{
  "title": "Go Green Week",
  "description": "Reduce carbon emissions by 25%",
  "target": 50,
  "startDate": Timestamp,
  "endDate": Timestamp,
  "rewards": ["eco_warrior", "greenstar"],
  "active": true
}
```

---

### Collection: `userChallenges`
Stores user participation in challenges.

```
userChallenges/
├── {participationId}
│   ├── userId: string
│   ├── challengeId: string
│   ├── startDate: Timestamp
│   ├── currentProgress: number
│   ├── completed: boolean
│   └── completionDate: Timestamp
```

**Example Document:**
```json
{
  "userId": "user123",
  "challengeId": "challenge456",
  "startDate": Timestamp,
  "currentProgress": 45.2,
  "completed": false,
  "completionDate": null
}
```

---

## Indexes

Create the following indexes for optimal query performance:

### Index 1: Footprints by User and Date
- Collection: `footprints`
- Fields: `userId` (Ascending), `createdAt` (Descending)
- Use: Fetching user's calculation history

### Index 2: Footprints by User and Month
- Collection: `footprints`
- Fields: `userId` (Ascending), `month` (Descending)
- Use: Monthly statistics

### Index 3: User Challenges
- Collection: `userChallenges`
- Fields: `userId` (Ascending), `completed` (Ascending), `endDate` (Descending)
- Use: Active challenges

---

## Authentication

### Firebase Auth Configuration

**Setup:**
1. Enable Google Sign-In in Firebase Console
2. Configure OAuth consent screen
3. Set authorized redirect URIs

**User Object Properties:**
- `uid`: Unique user identifier
- `email`: User's email address
- `displayName`: User's display name from Google
- `photoURL`: User's profile picture
- `emailVerified`: Boolean flag

**Example:**
```javascript
const user = auth.currentUser;
console.log(user.uid);          // "abc123def456"
console.log(user.email);        // "user@gmail.com"
console.log(user.displayName);  // "John Doe"
```

---

## API Endpoints & Service Functions

### Authentication Services
- `signInWithGoogle()` - Sign in with Google OAuth
- `signOut()` - Sign out user
- `getCurrentUser()` - Get current authenticated user

### Footprint Services
- `saveFootprint(userId, electricity, transport, totalCO2)` - Save calculation
- `getUserFootprints(userId, limit)` - Fetch user's calculations
- `getUserMonthlyStats(userId, month)` - Get monthly statistics

---

## Data Retention & Security

### Retention Policies
- User data: Retained indefinitely (user can delete)
- Footprint records: Retained for 2 years
- Challenge data: Retained for 1 year after completion

### Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Footprints collection
    match /footprints/{recordId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow delete: if request.auth.uid == resource.data.userId;
    }
    
    // Challenges collection (public read)
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
    }
    
    // User Challenges
    match /userChallenges/{participationId} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## Migration from Supabase

The application has been migrated from Supabase to Firebase with the following changes:

| Field (Supabase) | Field (Firebase) | Notes |
|---|---|---|
| `user_id` | `userId` | camelCase naming convention |
| `electricity_usage` | `electricity` | Simplified naming |
| `transport_distance` | `transport` | Simplified naming |
| `total_co2` | `totalCO2` | camelCase |
| `created_at` | `createdAt` | Timestamp object |
| N/A | `month` | New field for monthly grouping |
| N/A | `breakdown` | New field with detailed breakdown |
| N/A | `details` | New field storing all input data |

---

## Firestore Limits & Quotas

- Document size: Max 1 MB
- Collection size: Unlimited
- Concurrent connections: Depends on pricing tier
- Read/Write operations: 50,000 per day (free tier)

---

## Backup & Recovery

Firebase provides automatic daily backups. To restore:
1. Go to Firebase Console
2. Navigate to Firestore > Backups
3. Select desired backup and restore date
4. Confirm restoration

---

## Monitoring & Analytics

Monitor database usage via:
1. Firebase Console > Firestore > Usage
2. Set up alerts for quota usage
3. Review authentication logs for security

---

## Future Enhancements

- [ ] Real-time updates using listeners
- [ ] Offline persistence
- [ ] Data aggregation for reports
- [ ] Integration with Cloud Functions for batch operations
- [ ] Cloud Storage for user exports
