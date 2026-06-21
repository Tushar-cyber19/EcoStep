import InfoCard from "./InfoCard";

export default function ClimateStats() {
  const cards = [
    {
      title: "What is Carbon Footprint?",
      description:
        "Your carbon footprint is the total greenhouse gases (CO₂) produced by your actions. The average person produces 4-8 metric tons per year."
    },
    {
      title: "Real-World Examples",
      description:
        "🔹 Plastic bottle = 0.24 kg CO₂\n🔹 One car trip (10 km) = 2.0 kg CO₂\n🔹 Charging phone daily = 1.5 kg CO₂/year\n🔹 One flight (1000 km) = 255 kg CO₂"
    },
    {
      title: "Why It Matters",
      description:
        "Rising CO₂ levels trap heat in the atmosphere, causing climate change, extreme weather, melting ice caps, and threatening ecosystems and communities worldwide."
    },
    {
      title: "How You Can Reduce It",
      description:
        "💚 Use renewable energy\n💚 Use public transport or bike\n💚 Eat less meat\n💚 Buy local & reduce waste\n💚 Support sustainable brands"
    }
  ];

  return (
    <section className="py-16 bg-green-50">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-800">
          Understanding Carbon Footprint
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Learn what carbon footprint means, see real-world examples, and discover actionable steps to reduce your environmental impact.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <InfoCard
              key={card.title}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 rounded-xl bg-white p-8 shadow-sm border-l-4 border-green-600">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            💡 Did You Know?
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-3 text-green-600 font-bold">•</span>
              <span>India's average carbon footprint per capita is about 1.7 metric tons per year, significantly lower than developed nations (USA: 16, UK: 8.5 metric tons)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-green-600 font-bold">•</span>
              <span>Coal accounts for 70% of India's electricity generation. Switching to renewable energy can reduce your carbon footprint by 50-60%</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-green-600 font-bold">•</span>
              <span>Transportation contributes 11% of India's total emissions. Using public transport instead of personal vehicles can save up to 0.5 tons of CO₂ per year</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-green-600 font-bold">•</span>
              <span>India's vegetarian population (about 30%) has a significantly lower carbon footprint. Plant-based diets can reduce emissions by 30-50%</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-green-600 font-bold">•</span>
              <span>Planting one tree in India can offset about 16-20 kg of CO₂ over its lifetime. India aims to achieve 33% forest cover by 2032</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-green-600 font-bold">•</span>
              <span>By 2030, India targets 50% of its electricity from renewable sources. Your solar adoption helps achieve this national goal</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}