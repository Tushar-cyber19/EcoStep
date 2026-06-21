"use client";

import { redirect } from "next/navigation";

export default function SignupPage() {
  // Redirect to login page since we only use Google Sign-In
  redirect("/auth/login");
}