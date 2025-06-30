# Code Forge - Firebase Setup Instructions

## Prerequisites

1. **Firebase Account**: Create a Firebase account at https://firebase.google.com
2. **Node.js**: Install Node.js (version 18 or higher)
3. **Firebase CLI**: Install Firebase CLI globally
   ```bash
   npm install -g firebase-tools
   ```

## Firebase Project Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `code-forge` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Firebase Services

#### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Enable "Google" provider (optional)
4. Configure authorized domains if needed

#### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (we'll update rules later)
4. Select a location close to your users

#### Cloud Messaging
1. Go to Project Settings > Cloud Messaging
2. Generate a new key pair for VAPID
3. Copy the VAPID key for later use

#### Hosting
1. Go to Hosting
2. Click "Get started"
3. Follow the setup instructions

### 3. Get Firebase Configuration

1. Go to Project Settings > General
2. Scroll down to "Your apps"
3. Click "Add app" > Web app
4. Register app with nickname "Code Forge"
5. Copy the Firebase configuration object

## Code Configuration

### 1. Update Firebase Config

Replace the placeholder config in `script.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
};
```

### 2. Update Service Worker

Update `firebase-messaging-sw.js` with the same config:

```javascript
firebase.initializeApp({
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
});
```

### 3. Update VAPID Key

In `script.js`, update the VAPID key in the `initializeFirebaseMessaging` method:

```javascript
const token = await messaging.getToken({
    vapidKey: 'your-vapid-key-here'
});
```

## Deployment

### 1. Initialize Firebase in Project

```bash
cd code-forge-rebuilt
firebase login
firebase init
```

Select:
- Hosting
- Firestore
- Functions

### 2. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore
```

### 3. Deploy Cloud Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 4. Deploy Hosting

```bash
firebase deploy --only hosting
```

### 5. Complete Deployment

```bash
firebase deploy
```

## Testing

### 1. Local Testing

```bash
# Start Firebase emulators
firebase emulators:start

# Test functions locally
firebase functions:shell
```

### 2. Production Testing

1. Visit your deployed site
2. Test user registration/login
3. Test code voting
4. Test comment posting
5. Test notification permissions
6. Test "I am not a robot" counter

## Configuration Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password, Google)
- [ ] Firestore database created
- [ ] Cloud Messaging configured with VAPID key
- [ ] Hosting enabled
- [ ] Firebase config updated in code
- [ ] Service worker config updated
- [ ] VAPID key updated
- [ ] Firestore rules deployed
- [ ] Cloud Functions deployed
- [ ] Website deployed to Firebase Hosting

## Security Considerations

### 1. Firestore Rules
The provided rules ensure:
- Users can only access their own data
- Votes are properly authenticated
- Comments are validated
- Reports are secure

### 2. Cloud Functions
- All callable functions verify authentication
- Input validation prevents malicious data
- Rate limiting should be considered for production

### 3. API Keys
- Client-side API keys are safe for web apps
- Server-side keys should be kept secure
- Consider domain restrictions for production

## Monitoring

### 1. Firebase Console
- Monitor authentication usage
- Check Firestore read/write operations
- Review Cloud Function logs
- Monitor hosting traffic

### 2. Error Handling
- Check browser console for errors
- Monitor Cloud Function error rates
- Set up alerting for critical failures

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure domain is authorized in Firebase
2. **Permission Denied**: Check Firestore rules
3. **Function Timeout**: Increase timeout in functions config
4. **Notification Issues**: Verify VAPID key and service worker

### Debug Steps

1. Check browser console for errors
2. Verify Firebase config is correct
3. Test with Firebase emulators
4. Check Cloud Function logs
5. Verify Firestore rules

## Production Optimizations

1. **Performance**:
   - Enable Firestore offline persistence
   - Implement proper caching strategies
   - Optimize bundle size

2. **Security**:
   - Implement rate limiting
   - Add input sanitization
   - Monitor for abuse

3. **Monitoring**:
   - Set up error tracking
   - Monitor performance metrics
   - Implement analytics

## Support

For issues with this setup:
1. Check Firebase documentation
2. Review error logs in Firebase Console
3. Test with Firebase emulators
4. Check browser developer tools

