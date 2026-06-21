"use client";

import { useEffect, useState, useRef } from "react";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";

export interface AuthState {
  user: User | null;
  loading: boolean;
}

const SESSION_TIMEOUT = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? null);
      setLoading(false);

      // Reset session timeout on user change
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set 15-day inactivity timeout
      if (currentUser) {
        timeoutRef.current = setTimeout(() => {
          // Session expired after 15 days of inactivity
          // User will be logged out on next page load
          console.log('Session expired after 15 days of inactivity');
        }, SESSION_TIMEOUT);
      }
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { user, loading };
}

// Legacy hook for backwards compatibility
export function useAuthUser(): User | null {
  const { user } = useAuth();
  return user;
}
