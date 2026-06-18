import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-5xl font-bold">
        EcoStep
      </h1>

      <p className="mb-8 text-gray-600">
        Track and reduce your carbon footprint.
      </p>

      <Link
        href="/awareness"
        className="rounded-lg bg-green-600 px-6 py-3 text-white"
      >
        Get Started
      </Link>
    </div>
  );
}