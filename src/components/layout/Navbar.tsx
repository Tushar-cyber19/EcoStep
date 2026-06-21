"use client";

import Link from "next/link";
import { Leaf, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import LogoutButton from "../auth/LogoutButton";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-green-700"
        >
          <Leaf size={28} />
          EcoStep
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/calculator"
            className="font-medium text-gray-700 transition hover:text-green-600"
          >
            Calculator
          </Link>

          <Link
            href="/history"
            className={`font-medium transition ${user ? 'text-gray-700 hover:text-green-600' : 'cursor-not-allowed text-gray-400'}`}
            onClick={(e) => !user && e.preventDefault()}
          >
            History
          </Link>

          <Link
            href="/challenges"
            className={`font-medium transition ${user ? 'text-gray-700 hover:text-green-600' : 'cursor-not-allowed text-gray-400'}`}
            onClick={(e) => !user && e.preventDefault()}
          >
            Challenges
          </Link>

          {!loading && (
            user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-green-700 transition hover:bg-green-100"
                >
                  <span className="max-w-[150px] truncate text-sm font-medium">
                    {user.displayName || user.email?.split('@')[0] || 'Profile'}
                  </span>
                  <ChevronDown size={18} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="border-b px-4 py-3">
                      <p className="text-xs text-gray-500">Logged in as</p>
                      <p className="truncate font-medium text-gray-900">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <LogoutButton />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}