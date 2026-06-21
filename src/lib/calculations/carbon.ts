/**
 * Calculate carbon footprint based on DAILY lifestyle factors
 * All inputs are per DAY, outputs are per DAY in kg CO2
 * Customized for India household measurements
 * @param params - Object containing daily consumption data
 * @returns Object with CO2 emissions breakdown by category (daily)
 */
export function calculateCarbon(params: {
  electricity: number;        // kWh per day
  renewablePercentage: number; // % of renewable energy
  carKm: number;              // km per day
  carType: string;            // Electric, Hybrid, Petrol, Diesel
  publicTransit: number;      // km per day
  flightHours: number;        // hours per day (annual average)
  meatServings: number;       // servings per day
  veganDays: number;          // days per week
  recyclingRate: number;      // % recycled
  wasteKg: number;            // kg per day
  heatingType: string;        // gas, electric, oil, renewable
  heatingUsage: number;       // % of usage per day
  waterUsage: number;         // liters per day
}) {
  // ========== ELECTRICITY (kWh/day → CO2/day) ==========
  // India grid: ~0.92 kg CO2/kWh (coal-heavy)
  const ELECTRICITY_FACTOR = 0.92;
  const renewableFactor = (100 - params.renewablePercentage) / 100;
  const electricityCO2 = params.electricity * ELECTRICITY_FACTOR * renewableFactor;

  // ========== TRANSPORT (daily) ==========
  // Car emissions per km by type (India standards)
  const carFactors: { [key: string]: number } = {
    electric: 0.05,    // kg CO2/km - Electric (minimal, grid based)
    hybrid: 0.10,      // kg CO2/km - Hybrid
    petrol: 0.25,      // kg CO2/km - Petrol car
    diesel: 0.28,      // kg CO2/km - Diesel car
  };
  
  const carFactor = carFactors[params.carType] || 0.25;
  const carCO2 = params.carKm * carFactor;
  
  // Public transit: ~0.04 kg CO2/km (bus/metro average in India)
  const publicTransitCO2 = params.publicTransit * 0.04;
  
  // Flights: ~0.25 kg CO2/km per person (900 km/h avg)
  const flightKm = params.flightHours * 900;
  const flightCO2 = flightKm * 0.25;
  
  const transportCO2 = carCO2 + publicTransitCO2 + flightCO2;

  // ========== DIET (daily) ==========
  // India: Meat consumption is lower, veg diet is common
  const meatCO2 = params.meatServings * 2.5; // kg CO2 per serving (avg meat)
  
  // Vegan day offset: ~1.5 kg CO2/day reduction
  const veganOffset = (params.veganDays / 7) * 1.5; // Average per day
  const dietCO2 = Math.max(0, meatCO2 - veganOffset);

  // ========== WASTE & RECYCLING (daily) ==========
  // India: Waste disposal varies, recycling not universal
  const wasteEmissions = params.wasteKg * 0.5; // kg CO2 per kg waste
  const recyclingBenefit = wasteEmissions * (params.recyclingRate / 100) * 0.8;
  const wasteCO2 = Math.max(0, wasteEmissions - recyclingBenefit);

  // ========== HEATING & COOLING (daily average) ==========
  // India: Not major factor, but included for northern regions
  const heatingFactors: { [key: string]: number } = {
    gas: 0.20,       // kg CO2/unit per day (low usage in India)
    electric: 0.09,  // kg CO2/kWh
    oil: 0.27,       // kg CO2/liter
    renewable: 0.01, // kg CO2 (minimal)
  };
  
  const heatingFactor = heatingFactors[params.heatingType] || 0.20;
  const heatingCO2 = (heatingFactor * params.heatingUsage / 100) * 2; // Seasonal adjustment

  // ========== WATER USAGE (daily) ==========
  // India: ~0.0003 kg CO2 per liter (treatment + minimal heating)
  const waterCO2 = params.waterUsage * 0.0003;

  // ========== TOTAL (per day in kg CO2) ==========
  const totalCO2 =
    electricityCO2 +
    transportCO2 +
    dietCO2 +
    wasteCO2 +
    heatingCO2 +
    waterCO2;

  return {
    electricityCO2,
    transportCO2,
    dietCO2,
    wasteCO2,
    heatingCO2,
    waterCO2,
    totalCO2,
  };
}
