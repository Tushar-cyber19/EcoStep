import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-32 px-4 sm:px-6 lg:px-8">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop')",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-500/80 z-1" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-5xl font-bold text-white sm:text-6xl">
          Understand Your Carbon Footprint
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-green-50">
          Every action has an impact. Learn how your daily choices affect our planet and discover 
          simple ways to reduce your carbon emissions and make a real difference.
        </p>

        <Link
          href="/calculator"
          className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-green-600 hover:bg-green-50 transition shadow-lg"
        >
          Start Calculating Your Impact
        </Link>
      </div>
    </section>
  );
}