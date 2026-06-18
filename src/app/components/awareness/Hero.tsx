import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-green-50 py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h1 className="mb-6 text-5xl font-bold text-green-800">
          Understand Your Carbon Footprint
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Learn how your daily choices impact the environment and discover
          simple ways to reduce emissions.
        </p>

        <Link
          href="/calculator"
          className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          Calculate My Footprint
        </Link>
      </div>
    </section>
  );
}