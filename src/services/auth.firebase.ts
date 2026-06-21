import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

interface AuthResponse {
  error: { message: string } | null;
  data?: User;
}

/**
 * Sign in a user with Google OAuth (client-side)
 * @returns Object with error property if authentication fails
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { error: null, data: result.user };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Google sign-in failed";
    return { error: { message: errorMessage } };
  }
}

/**
 * Sign out the current user
 * @returns Object with error property if sign out fails
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Sign out failed";
    return { error: { message: errorMessage } };
  }
}

/**
 * Get the current authenticated user
 * @returns Current user or null
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

