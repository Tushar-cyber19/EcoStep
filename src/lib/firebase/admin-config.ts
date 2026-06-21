import * as admin from 'firebase-admin';

type App = any; // Type from firebase-admin/app

let adminApp: App | null = null;
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

    // Initialize Firebase Admin SDK
    adminApp = admin.initializeApp({
      // @ts-ignore - firebase-admin types incomplete
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });

    console.log('✅ Firebase Admin SDK initialized');
    return adminApp;
  } catch (error) {
    initError = error instanceof Error ? error : new Error(String(error));
    console.error('Failed to initialize Firebase Admin SDK:', initError);
    throw initError;
  }
}

export function getAdminDb() {
  const app = getAdminApp();
  // @ts-ignore - firebase-admin types incomplete
  return admin.firestore(app);
}

export function getAdminAuth() {
  const app = getAdminApp();
  // @ts-ignore - firebase-admin types incomplete
  return admin.auth(app);
}
