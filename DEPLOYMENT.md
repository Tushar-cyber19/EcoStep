# EcoStep Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables Setup
Create/verify `.env.local` file in the root directory with:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Firebase Firestore Security Rules Deployment

**Method 1: Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your EcoStep project
3. Navigate to **Firestore Database** → **Rules**
4. Copy the entire content from `firestore.rules` file
5. Replace the rules in the console
6. Click **Publish**

**Method 2: Firebase CLI**
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

### 3. Firestore Collections Structure

The following collections will be **auto-created** on first use:
- `users` - User profiles and preferences
- `footprints` - Carbon footprint records
- `userChallenges` - User challenge progress
- `userStats` - User statistics and leaderboard data

No manual collection creation is needed. The app will create them automatically when users first interact with features.

### 4. Build and Deployment

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test locally before deployment
npm run dev

# Build optimization check
npm run lint
```

### 5. Deployment Options

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Option B: Firebase Hosting
```bash
# Initialize Firebase Hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting
```

#### Option C: Docker
```bash
docker build -t ecostep .
docker run -p 3000:3000 -e NODE_ENV=production ecostep
```

## Testing Checklist

### Authentication
- [ ] Google Sign-In works
- [ ] User can sign out
- [ ] Protected routes redirect to login when not authenticated
- [ ] User session persists after page refresh

### Calculator Page
- [ ] Page displays with light theme (white background)
- [ ] All input fields accept numeric values
- [ ] Form validation prevents empty submissions
- [ ] Results calculate correctly
- [ ] Results save to Firestore after login
- [ ] Success message appears after save

### History Page
- [ ] Page shows loading state initially
- [ ] Footprints load successfully
- [ ] Charts display correctly
- [ ] No "Missing permissions" error
- [ ] Monthly stats calculate correctly
- [ ] Can view 30-day history

### Challenges Page
- [ ] Page loads without "idle stream timeout" error
- [ ] Challenge list displays all 6 challenges
- [ ] User can start a challenge
- [ ] User can complete a challenge
- [ ] Leaderboard shows top users
- [ ] User rank updates after completing challenges

### Responsive Design
- [ ] Desktop view (1920px) works perfectly
- [ ] Tablet view (768px) responsive
- [ ] Mobile view (375px) mobile-friendly

## Troubleshooting

### Issue: "Missing or insufficient permissions" on History Page
**Solution:**
1. Verify `firestore.rules` has been deployed
2. Check that user is authenticated (check Firebase Console Auth tab)
3. Ensure `userId` field in footprints matches `request.auth.uid`

### Issue: "RPC 'Listen' stream error - Timed out" on Challenges Page
**Solution:**
1. This is usually not critical and happens with idle connections
2. The app now has proper cleanup in components (no real-time listeners)
3. If persistent, check Firebase console for quota limits

### Issue: Collections not being created automatically
**Solution:**
1. Verify Firestore is initialized in `src/lib/firebase/config.ts`
2. Check that security rules allow authenticated users to create documents
3. Ensure user is authenticated before attempting to save data

### Issue: Build fails with TypeScript errors
**Solution:**
```bash
# Clear build cache
rm -rf .next
npm run build
```

## Performance Optimization

### Already Implemented
- ✅ Light theme (reduces battery usage)
- ✅ Automatic listener cleanup (prevents memory leaks)
- ✅ Error boundary in components
- ✅ Lazy loading for charts
- ✅ Optimized images and assets

### Optional Enhancements
1. **Enable Compression**
   ```bash
   npm install compression
   ```

2. **Add Service Worker**
   ```bash
   npm install next-pwa
   ```

3. **Database Indexes** (for production at scale)
   - Create index on `footprints(userId, createdAt)`
   - Create index on `userChallenges(userId, status)`
   - Create index on `userStats(totalPoints)`

## Monitoring

### Firebase Console Monitoring
1. **Authentication**: Monitor sign-up/sign-in rates
2. **Firestore**: Monitor read/write operations and errors
3. **Realtime Database Rules Simulator**: Test rule changes

### Application Monitoring
- Use Next.js built-in analytics
- Monitor error logs in browser console
- Check server logs for API errors

## Production Checklist Before Launch

- [ ] Environment variables configured
- [ ] Firebase Security Rules deployed
- [ ] Build passes without errors (`npm run build`)
- [ ] All pages tested in production build (`npm run start`)
- [ ] No console errors in DevTools
- [ ] Authentication working (test with multiple accounts)
- [ ] Database operations working (save/read data)
- [ ] All charts rendering correctly
- [ ] Responsive design tested on mobile
- [ ] SSL certificate valid (if using custom domain)
- [ ] CDN configured (if using one)
- [ ] Database backups configured
- [ ] Monitoring/alerting set up
- [ ] Privacy policy and terms displayed
- [ ] Contact/support information provided

## Rollback Procedure

If something goes wrong:

```bash
# Rollback Firestore Rules
firebase deploy --only firestore:rules  # (use previous version)

# Rollback Hosting
vercel rollback  # For Vercel
# OR
firebase hosting:versions:list
firebase deploy --only hosting

# Clear browser cache
# Hard refresh: Ctrl+Shift+R or Cmd+Shift+R
```

## Post-Deployment

1. Monitor error logs for first 24 hours
2. Test all features with real users
3. Gather feedback
4. Monitor Firestore usage and costs
5. Plan incremental updates

## Support

For issues:
1. Check Firebase Console for errors
2. Review browser DevTools Console
3. Check application logs
4. Contact Firebase support if database issues persist
