"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Props = {
  result: {
    electricityCO2: number;
    transportCO2: number;
    dietCO2: number;
    wasteCO2: number;
    heatingCO2: number;
    waterCO2: number;
    totalCO2: number;
  };
};

export default function ResultCard({ result }: Props) {
  const categories = [
    { name: "⚡ Electricity", value: result.electricityCO2, color: "#FFC107" },
    { name: "🚗 Transport", value: result.transportCO2, color: "#FF6B6B" },
    { name: "🍽️ Diet", value: result.dietCO2, color: "#FF9500" },
    { name: "♻️ Waste", value: result.wasteCO2, color: "#9CCC65" },
    { name: "🔥 Heating", value: result.heatingCO2, color: "#FF5252" },
    { name: "💧 Water", value: result.waterCO2, color: "#29B6F6" },
  ];

  const chartData = categories.filter(cat => cat.value > 0.01);
  const COLORS = chartData.map(cat => cat.color);

  return (
    <div className="space-y-6">
      {/* Main Summary */}
      <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 border-2 border-green-200">
        <h2 className="mb-4 text-2xl font-bold text-green-800">
          Your Daily Carbon Footprint
        </h2>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-xs text-gray-600 mb-1">DAILY</p>
              <p className="text-xl font-bold text-green-700">
                {result.totalCO2.toFixed(2)} kg
              </p>
              <p className="text-xs text-gray-500">per day</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-xs text-gray-600 mb-1">MONTHLY</p>
              <p className="text-xl font-bold text-green-700">
                {(result.totalCO2 * 30).toFixed(0)} kg
              </p>
              <p className="text-xs text-gray-500">×30 days</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-xs text-gray-600 mb-1">YEARLY</p>
              <p className="text-xl font-bold text-green-700">
                {(result.totalCO2 * 365).toFixed(0)} kg
              </p>
              <p className="text-xs text-gray-500">×365 days</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-green-200 text-sm text-green-700">
            <p>📈 <strong>Annual in Metric Tons:</strong> {(result.totalCO2 * 365 / 1000).toFixed(2)} MT</p>
            {(result.totalCO2 * 365) > 4000 ? (
              <p className="text-orange-600">⚠️ <strong>{((result.totalCO2 * 365 / 4000) * 100).toFixed(0)}%</strong> above global average (4 MT/year)</p>
            ) : (
              <p className="text-green-700">✅ <strong>{((result.totalCO2 * 365 / 4000) * 100).toFixed(0)}%</strong> of global average</p>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown Chart */}
      {chartData.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-800">Emission Breakdown</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)} kg`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${Number(value).toFixed(2)} kg CO₂`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed Breakdown */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-800">Category Details</h3>
        
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="font-medium text-gray-800">{category.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      backgroundColor: category.color,
                      width: `${(category.value / result.totalCO2) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-bold text-gray-800 w-16 text-right">
                  {category.value.toFixed(2)} kg
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equivalents */}
      <div className="rounded-xl bg-blue-50 p-6 border border-blue-200">
        <h3 className="mb-3 text-lg font-bold text-blue-900">🌍 Real-World Comparisons (Yearly)</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>🌳 <strong>{Math.ceil(result.totalCO2 * 365 / 20)} trees</strong> needed to offset your yearly emissions</li>
          <li>🍾 Equivalent to <strong>{Math.floor(result.totalCO2 * 365 / 0.24).toLocaleString()}</strong> plastic bottles</li>
          <li>✈️ One round-trip flight to Europe produces ~2500 kg CO₂ (= {(result.totalCO2 * 365 / 2500).toFixed(1)} flights)</li>
          <li>🚗 Your transport emissions: <strong>{(result.transportCO2 * 365 / 1000).toFixed(2)} MT/year</strong></li>
          <li>⚡ Your electricity emissions: <strong>{(result.electricityCO2 * 365 / 1000).toFixed(2)} MT/year</strong></li>
        </ul>
      </div>

      {/* How We Calculate */}
      <div className="rounded-xl bg-gray-50 p-6 border border-gray-200">
        <h3 className="mb-3 text-lg font-bold text-gray-800">📊 How We Calculate (Daily Basis)</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>⚡ Electricity:</strong> kWh/day × 0.92 kg CO₂/kWh × (1 - renewable%) [India grid: 0.92 kg/kWh]</p>
          <p><strong>🚗 Transport (Car):</strong> km/day × car-type factor (Electric: 0.05, Hybrid: 0.10, Petrol: 0.25, Diesel: 0.28)</p>
          <p><strong>🚌 Public Transit:</strong> km/day × 0.04 kg CO₂/km (bus, metro, train)</p>
          <p><strong>✈️ Flights:</strong> hours/day × 900 km/h × 0.25 kg CO₂/km (annual average)</p>
          <p><strong>🍽️ Diet:</strong> meat servings/day × 2.5 kg CO₂ - vegan-day reduction</p>
          <p><strong>♻️ Waste:</strong> kg/day × 0.5 - recycling benefit (80% offset)</p>
          <p><strong>🔥 Heating:</strong> Usage% × fuel-type factor (seasonal adjustment)</p>
          <p><strong>💧 Water:</strong> liters/day × 0.0003 kg CO₂ (treatment & heating)</p>
          <p className="mt-3 pt-3 border-t italic text-gray-600">💡 Monthly = Daily × 30 | Yearly = Daily × 365</p>
        </div>
      </div>
    </div>
  );
}