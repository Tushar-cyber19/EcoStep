import InfoCard from "./InfoCard";

export default function ClimateStats() {
  const cards = [
    {
      title: "What is CO₂?",
      description:
        "Carbon dioxide is the primary greenhouse gas released through burning fossil fuels."
    },
    {
      title: "What is Methane?",
      description:
        "Methane traps significantly more heat than CO₂ and is released from agriculture and waste."
    },
    {
      title: "Why Climate Change Matters?",
      description:
        "Increasing greenhouse gases contribute to rising temperatures and extreme weather events."
    },
    {
      title: "How You Can Help",
      description:
        "Reduce energy consumption, use public transportation, and adopt sustainable habits."
    }
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 text-center text-3xl font-bold">
          Learn About Climate Impact
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <InfoCard
              key={card.title}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}