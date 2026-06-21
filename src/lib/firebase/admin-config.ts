import * as admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;
let initError: Error | null = null;

export function getAdminApp() {
  if (adminApp) {
    return adminApp;
  }

  if (initError) {
    throw initError;
  }

  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      const missing = [];
      if (!projectId) missing.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
      if (!clientEmail) missing.push('FIREBASE_CLIENT_EMAIL');
      if (!privateKey) missing.push('FIREBASE_PRIVATE_KEY');
      
      throw new Error(
        `Missing Firebase Admin credentials: ${missing.join(', ')}\n` +
        `Add these to .env.local with your service account from Firebase Console > Project Settings > Service Accounts`
      );
    }

    // Check if already initialized
    try {
      adminApp = admin.app('admin-challenges');
      return adminApp;
    } catch {
      // App not initialized yet, initialize it
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        } as admin.ServiceAccount),
      }, 'admin-challenges');

      console.log('✅ Firebase Admin SDK initialized');
      return adminApp;
    }
  } catch (error) {
    initError = error instanceof Error ? error : new Error(String(error));
    console.error('Failed to initialize Firebase Admin SDK:', initError);
    throw initError;
  }
}

export function getAdminDb() {
  const app = getAdminApp();
  return admin.firestore(app);
}

export function getAdminAuth() {
  const app = getAdminApp();
  return admin.auth(app);
}
