# Code Forge - Firestore Database Schema

## Collections Overview

### 1. `users` Collection
Stores user profile information and preferences.

**Document ID**: User UID from Firebase Auth
**Structure**:
```javascript
{
  email: "user@example.com",
  favoriteGames: ["genshin", "hsr", "zzz"], // Array of game IDs
  notifications: {
    newCodes: true,        // Boolean: Enable new code notifications
    favoritesOnly: false   // Boolean: Only notify for favorite games
  },
  fcmToken: "fcm_token_string", // Firebase Cloud Messaging token
  lastUpdated: Timestamp,
  createdAt: Timestamp
}
```

### 2. `votes` Collection
Stores user votes (upvotes/downvotes) for redemption codes.

**Document ID**: `{game}_{codeId}_{userId}` (composite key to ensure one vote per user per code)
**Structure**:
```javascript
{
  userId: "user_uid",
  codeId: "code_identifier", // Usually the code string itself
  game: "genshin",           // Game identifier: "genshin", "hsr", "zzz"
  voteType: "upvote",        // "upvote" or "downvote"
  timestamp: Timestamp
}
```

### 3. `comments` Collection
Stores user comments for each game's code section.

**Document ID**: Auto-generated
**Structure**:
```javascript
{
  userId: "user_uid",
  userEmail: "user@example.com", // For display purposes
  game: "genshin",               // Game identifier
  comment: "This code worked great!", // Max 500 characters
  timestamp: Timestamp
}
```

### 4. `reports` Collection
Stores user reports for expired or invalid codes.

**Document ID**: Auto-generated
**Structure**:
```javascript
{
  userId: "user_uid",
  codeId: "code_identifier",
  game: "genshin",
  reason: "Code expired",    // Optional reason provided by user
  timestamp: Timestamp,
  status: "pending"          // "pending", "reviewed", "resolved"
}
```

### 5. `counters` Collection
Stores various counters for the application.

**Document ID**: Counter name (e.g., "visitors")
**Structure**:
```javascript
{
  count: 1234 // Integer counter value
}
```

### 6. `system` Collection
Stores system-wide configuration and cached data.

**Document ID**: Configuration name
**Examples**:

#### `lastKnownCodes` Document:
```javascript
{
  genshin: [
    {
      code: "GENSHINGIFT",
      description: "50 primogems and three hero's wit",
      // ... other code properties
    }
  ],
  hsr: [...],
  zzz: [...]
}
```

## Security Rules Summary

- **Users**: Can only read/write their own user document
- **Votes**: Anyone can read (for vote counts), users can only create/update/delete their own votes
- **Comments**: Anyone can read, authenticated users can create, users can only edit/delete their own comments
- **Reports**: Authenticated users can create, only admins can read (via Cloud Functions)
- **Counters**: Anyone can read, authenticated users can increment visitor counter
- **System**: Anyone can read, only Cloud Functions can write

## Indexes Required

1. **Votes Collection**:
   - Composite index: `game` (ASC) + `codeId` (ASC)

2. **Comments Collection**:
   - Composite index: `game` (ASC) + `timestamp` (DESC)

3. **Reports Collection**:
   - Composite index: `status` (ASC) + `timestamp` (DESC)

## Cloud Functions

### 1. `checkForNewCodes`
- **Trigger**: Scheduled (every 30 minutes)
- **Purpose**: Monitor API for new codes and send push notifications
- **Process**:
  1. Fetch current codes from API
  2. Compare with last known codes in Firestore
  3. Identify new codes
  4. Send notifications to users based on preferences
  5. Update last known codes

### 2. `voteOnCode`
- **Trigger**: HTTPS Callable
- **Purpose**: Handle code voting with authentication
- **Parameters**: `{ codeId, voteType, game }`
- **Returns**: Vote action result

### 3. `getVoteCounts`
- **Trigger**: HTTPS Callable
- **Purpose**: Get aggregated vote counts for codes
- **Parameters**: `{ game, codeIds }`
- **Returns**: Vote count object

### 4. `reportCode`
- **Trigger**: HTTPS Callable
- **Purpose**: Submit code reports
- **Parameters**: `{ codeId, game, reason }`
- **Returns**: Success confirmation

### 5. `addComment`
- **Trigger**: HTTPS Callable
- **Purpose**: Add comments with validation
- **Parameters**: `{ game, comment }`
- **Returns**: Comment details

### 6. `getComments`
- **Trigger**: HTTPS Callable
- **Purpose**: Retrieve comments for a game
- **Parameters**: `{ game, limit }`
- **Returns**: Array of comments

## Data Flow

1. **User Registration/Login**: Creates/updates user document in `users` collection
2. **Code Voting**: Creates/updates document in `votes` collection
3. **Comment Posting**: Creates document in `comments` collection
4. **Code Reporting**: Creates document in `reports` collection
5. **Visitor Counting**: Increments counter in `counters/visitors` document
6. **Push Notifications**: Cloud Function monitors API and sends notifications based on user preferences

## Performance Considerations

- Vote counts are aggregated in real-time via Cloud Functions to avoid client-side calculations
- Comments are paginated (default 20 per request)
- Indexes are optimized for common query patterns
- FCM tokens are cleaned up automatically when invalid

## Privacy & Security

- User emails are only stored for display purposes in comments
- All user data is protected by authentication rules
- Reports are only accessible to administrators
- Vote anonymity is maintained (only counts are public)
- FCM tokens are securely managed and cleaned up

