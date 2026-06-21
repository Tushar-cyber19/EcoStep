"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Navbar() {
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

        {/* Navigation Links */}
        <div className="flex items-center gap-6">

          <Link
            href="/awareness"
            className="font-medium text-gray-700 hover:text-green-600"
          >
            Awareness
          </Link>

          <Link
            href="/calculator"
            className="font-medium text-gray-700 hover:text-green-600"
          >
            Calculator
          </Link>

          <Link
            href="/history"
            className="font-medium text-gray-700 hover:text-green-600"
          >
            History
          </Link>

          <Link
            href="/challenges"
            className="font-medium text-gray-700 hover:text-green-600"
          >
            Challenges
          </Link>

          <Link
            href="/auth/login"
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Login
          </Link>

        </div>
      </div>
    </nav>
  );
}
