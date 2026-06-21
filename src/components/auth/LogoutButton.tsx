"use client";

import { signOut } from "@/services/auth.firebase";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    if (!confirm("Are you sure you want to logout?")) {
      return;
    }

    const { error } = await signOut();

    if (error) {
      alert("Logout failed: " + error.message);
      return;
    }

    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 text-left"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}