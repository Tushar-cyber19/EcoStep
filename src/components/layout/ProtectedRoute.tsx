"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Public pages that don't require authentication
  const publicPages = ["/", "/calculator"];
  
  // Protected pages that require authentication
  const protectedPages = ["/history", "/challenges"];

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;
    
    setIsChecking(false);

    // If accessing a protected page without being logged in, redirect to login
    if (protectedPages.some(page => pathname.startsWith(page)) && !user) {
      router.push("/auth/login");
    }
  }, [user, router, pathname, loading]);

  // Show loading spinner while checking auth
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If user is not logged in but trying to access protected pages, don't render
  if (protectedPages.some(page => pathname.startsWith(page)) && !user) {
    return null;
  }

  return <>{children}</>;
}