import CalculatorForm from "@/components/calculator/CalculatorForm";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-green-700">
            Carbon Footprint Calculator
          </h1>
          <p className="text-gray-700">
            Calculate your carbon emissions by entering your consumption patterns below. 
            We'll show you the breakdown and give you tips to reduce your impact.
          </p>
        </div>

        <CalculatorForm />
      </div>
    </div>
  );
}