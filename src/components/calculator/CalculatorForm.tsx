"use client";

import { useState } from "react";
import { calculateCarbon } from "@/lib/calculations/carbon";
import ResultCard from "./ResultCard";
import { useAuth } from "@/hooks/useAuth";
import { saveFootprint } from "@/services/footprint.service";
import { ChevronDown } from "lucide-react";

type CalculationResult = {
  electricityCO2: number;
  transportCO2: number;
  dietCO2: number;
  wasteCO2: number;
  heatingCO2: number;
  waterCO2: number;
  totalCO2: number;
};

export default function CalculatorForm() {
  const { user, loading } = useAuth();

  const [expandedSections, setExpandedSections] = useState({
    electricity: true,
    transport: true,
    diet: false,
    waste: false,
    heating: false,
    water: false,
  });

  // Electricity inputs (DAILY)
  const [electricity, setElectricity] = useState("");
  const [renewablePercentage, setRenewablePercentage] = useState("0");

  // Transport inputs (DAILY)
  const [carKm, setCarKm] = useState("");
  const [carType, setCarType] = useState("petrol");
  const [publicTransit, setPublicTransit] = useState("");
  const [flights, setFlights] = useState("0");

  // Diet inputs (DAILY)
  const [meatServings, setMeatServings] = useState("0.5");
  const [veganDays, setVeganDays] = useState("2");

  // Waste inputs (DAILY)
  const [recyclingRate, setRecyclingRate] = useState("50");
  const [wasteKg, setWasteKg] = useState("0.5");

  // Heating inputs
  const [heatingType, setHeatingType] = useState("gas");
  const [heatingUsage, setHeatingUsage] = useState("50");

  // Water inputs (DAILY)
  const [waterUsage, setWaterUsage] = useState("100");

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading_calc, setLoadingCalc] = useState(false);
  const [message, setMessage] = useState("");

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  async function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    // Validate inputs
    if (!electricity && !carKm && !publicTransit && !flights) {
      setMessage("Please enter at least one value to calculate.");
      return;
    }

    const data = calculateCarbon({
      electricity: Number(electricity) || 0,
      renewablePercentage: Number(renewablePercentage),
      carKm: Number(carKm) || 0,
      carType,
      publicTransit: Number(publicTransit) || 0,
      flightHours: Number(flights) || 0,
      meatServings: Number(meatServings) || 0,
      veganDays: Number(veganDays) || 0,
      recyclingRate: Number(recyclingRate),
      wasteKg: Number(wasteKg) || 0,
      heatingType,
      heatingUsage: Number(heatingUsage) || 0,
      waterUsage: Number(waterUsage) || 0,
    });

    setResult(data);

    if (user) {
      try {
        setLoadingCalc(true);
        const breakdown = {
          electricityCO2: data.electricityCO2,
          transportCO2: data.transportCO2,
          dietCO2: data.dietCO2,
          wasteCO2: data.wasteCO2,
          heatingCO2: data.heatingCO2,
          waterCO2: data.waterCO2,
        };

        const details = {
          electricity: Number(electricity) || 0,
          renewablePercentage: Number(renewablePercentage),
          carKm: Number(carKm) || 0,
          carType,
          publicTransit: Number(publicTransit) || 0,
          flightHours: Number(flights) || 0,
          meatServings: Number(meatServings) || 0,
          veganDays: Number(veganDays) || 0,
          recyclingRate: Number(recyclingRate),
          wasteKg: Number(wasteKg) || 0,
          heatingType,
          heatingUsage: Number(heatingUsage) || 0,
          waterUsage: Number(waterUsage) || 0,
        };

        const { error } = await saveFootprint(
          user.uid,
          Number(electricity) || 0,
          Number(carKm) || 0,
          data.totalCO2,
          breakdown,
          details
        );

        if (error) {
          console.error(error);
          setMessage("Calculation completed but could not save result.");
        } else {
          setMessage("Result saved successfully! ✓");
        }
      } catch (err) {
        console.error(err);
        setMessage("Something went wrong while saving.");
      } finally {
        setLoadingCalc(false);
      }
    } else {
      setMessage("Login to save your calculation history.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Form Section */}
      <form
        onSubmit={handleCalculate}
        className="lg:col-span-2 rounded-xl border bg-white p-8 shadow-sm"
      >
        <h2 className="mb-6 text-2xl font-bold text-green-700">Daily Carbon Footprint Calculator</h2>
        <p className="mb-6 text-sm text-gray-600 bg-blue-50 p-3 rounded">
          💡 All values are on a DAILY basis. We'll calculate monthly (×30) and yearly (×365) totals.
        </p>

        {/* Electricity Section */}
        <div className="mb-6 border-b">
          <button
            type="button"
            onClick={() => toggleSection("electricity")}
            className="mb-4 w-full flex items-center justify-between text-lg font-bold text-green-700 hover:text-green-800"
          >
            ⚡ Electricity & Energy (Daily)
            <ChevronDown size={20} className={expandedSections.electricity ? "rotate-180" : ""} />
          </button>

          {expandedSections.electricity && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Daily Electricity Usage (kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Example: 5"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                  value={electricity}
                  onChange={(e) => setElectricity(e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-600">
                  India avg: 4-6 kWh/day. Includes AC, fridge, lights, appliances
                </p>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Renewable Energy %
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={renewablePercentage}
                  onChange={(e) => setRenewablePercentage(e.target.value)}
                  className="w-full"
                />
                <p className="mt-1 text-sm text-gray-600">{renewablePercentage}% from renewable sources (solar, wind)</p>
              </div>
            </div>
          )}
        </div>

        {/* Transport Section */}
        <div className="mb-6 border-b">
          <button
            type="button"
            onClick={() => toggleSection("transport")}
            className="mb-4 w-full flex items-center justify-between text-lg font-bold text-green-700 hover:text-green-800"
          >
            🚗 Transportation (Daily)
            <ChevronDown size={20} className={expandedSections.transport ? "rotate-180" : ""} />
          </button>

          {expandedSections.transport && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Daily Car Travel (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Example: 20"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                  value={carKm}
                  onChange={(e) => setCarKm(e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-600">Average commute distance per day</p>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Car Type (India-specific)
                </label>
                <select
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                >
                  <option value="electric">🔌 Electric (0.05 kg CO₂/km) - Lowest emissions</option>
                  <option value="hybrid">🔄 Hybrid (0.10 kg CO₂/km) - Mixed fuel</option>
                  <option value="petrol">⛽ Petrol (0.25 kg CO₂/km) - Standard cars</option>
                  <option value="diesel">🛢️ Diesel (0.28 kg CO₂/km) - SUVs & commercial</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Daily Public Transit Distance (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Example: 10"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                  value={publicTransit}
                  onChange={(e) => setPublicTransit(e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-600">Bus, metro, train: ~0.04 kg CO₂/km (India)</p>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Flights (daily average - annual)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Example: 0.02"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                  value={flights}
                  onChange={(e) => setFlights(e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-600">
                  Divide annual flight hours by 365. E.g., 20 hours/year = 0.055 hours/day
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Diet Section */}
        <div className="mb-6 border-b">
          <button
            type="button"
            onClick={() => toggleSection("diet")}
            className="mb-4 w-full flex items-center justify-between text-lg font-bold text-green-700 hover:text-green-800"
          >
            🍽️ Diet & Food (Daily)
            <ChevronDown size={20} className={expandedSections.diet ? "rotate-180" : ""} />
          </button>

          {expandedSections.diet && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Meat Servings per Day
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Example: 0.5"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                  value={meatServings}
                  onChange={(e) => setMeatServings(e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-600">
                  1 serving = 100g meat. Chicken: 1.3 kg CO₂, Lamb: 27 kg CO₂, Beef: 27 kg CO₂
                </p>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Vegetarian Days per Week
                </label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  placeholder="Example: 3"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                  value={veganDays}
                  onChange={(e) => setVeganDays(e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-600">India: Many people are vegetarian - select 7 if fully veg</p>
              </div>
            </div>
          )}
        </div>

        {/* Waste Section */}
        <div className="mb-6 border-b">
          <button
            type="button"
            onClick={() => toggleSection("waste")}
            className="mb-4 w-full flex items-center justify-between text-lg font-bold text-green-700 hover:text-green-800"
          >
            ♻️ Waste & Recycling (Daily)
            <ChevronDown size={20} className={expandedSections.waste ? "rotate-180" : ""} />
          </button>

          {expandedSections.waste && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Waste Generated (kg/day)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Example: 0.5"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                  value={wasteKg}
                  onChange={(e) => setWasteKg(e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-600">Average Indian household: 0.3-0.5 kg/day (plastic, food, paper)</p>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Recycling Rate (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={recyclingRate}
                  onChange={(e) => setRecyclingRate(e.target.value)}
                  className="w-full"
                />
                <p className="mt-1 text-sm text-gray-600">{recyclingRate}% of waste recycled (compost, recycle bins)</p>
              </div>
            </div>
          )}
        </div>

        {/* Heating Section */}
        <div className="mb-6 border-b">
          <button
            type="button"
            onClick={() => toggleSection("heating")}
            className="mb-4 w-full flex items-center justify-between text-lg font-bold text-green-700 hover:text-green-800"
          >
            🔥 Heating & Cooling
            <ChevronDown size={20} className={expandedSections.heating ? "rotate-180" : ""} />
          </button>

          {expandedSections.heating && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Heating Type
                </label>
                <select
                  value={heatingType}
                  onChange={(e) => setHeatingType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                >
                  <option value="gas">Gas (natural gas heater)</option>
                  <option value="electric">Electric (heater/AC with electricity)</option>
                  <option value="oil">Oil (rarely used in India)</option>
                  <option value="renewable">Renewable (solar heating)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Heating/AC Usage (% of year)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Example: 50"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                  value={heatingUsage}
                  onChange={(e) => setHeatingUsage(e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-600">
                  India: 0% (no heating), 30-50% (AC in summer months)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Water Section */}
        <div className="mb-6 border-b">
          <button
            type="button"
            onClick={() => toggleSection("water")}
            className="mb-4 w-full flex items-center justify-between text-lg font-bold text-green-700 hover:text-green-800"
          >
            💧 Water Usage (Daily)
            <ChevronDown size={20} className={expandedSections.water ? "rotate-180" : ""} />
          </button>

          {expandedSections.water && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block font-medium text-gray-800">
                  Daily Water Usage (liters)
                </label>
                <input
                  type="number"
                  step="10"
                  min="0"
                  placeholder="Example: 100"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
                  value={waterUsage}
                  onChange={(e) => setWaterUsage(e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-600">
                  India avg: 50-150 liters/day (shower: 40L, cooking: 10L, washing: 50L)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 py-3 text-white font-bold transition hover:bg-green-700 mb-4"
        >
          Calculate My Daily Footprint
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.includes("saved") ? "bg-green-50 text-green-700" : message.includes("Login") ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}
      </form>

      {/* Results Section */}
      {result && (
        <div className="lg:col-span-1">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
}
