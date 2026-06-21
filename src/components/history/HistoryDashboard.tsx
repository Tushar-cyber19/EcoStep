"use client";
import RecentLogs from "./RecentLogs";
import WeeklyBarChart from "./WeeklyBarChart";
import EmissionPieChart from "./EmissionPieChart";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserFootprints, getUserMonthlyStats } from "@/services/footprint.service";

export default function HistoryDashboard() {
  const { user, loading: authLoading } = useAuth();

  const [logs, setLogs] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!user || authLoading) return;

      setLoading(true);
      setError("");

      try {
        // Get footprint history
        const { data, error: historyError } = await getUserFootprints(user.uid, 30);

        if (historyError) {
          console.error("History error:", historyError);
          setError("Failed to load history. Please try again.");
        } else if (data && Array.isArray(data)) {
          setLogs(data);
        } else {
          setLogs([]);
        }

        // Get monthly stats
        const currentMonth = new Date().toISOString().substring(0, 7);
        const { data: stats, error: statsError } = await getUserMonthlyStats(user.uid, currentMonth);

        if (statsError) {
          console.warn("Stats error (non-critical):", statsError);
        }
        
        if (stats) {
          setMonthlyStats(stats);
        }
      } catch (err) {
        console.error("Error loading history:", err);
        setError("Error loading history. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, authLoading]);

  const totalEmissions = logs.reduce(
    (sum, log) => sum + Number(log.totalCO2 || 0),
    0
  );

  const averageEmissions = logs.length > 0 ? totalEmissions / logs.length : 0;

  // Prepare weekly data for chart
  const weeklyData = logs.slice(0, 7).map((log, index) => ({
    week: `Day ${index + 1}`,
    co2: log.totalCO2 || 0,
  }));

  // Prepare pie chart data
  const pieData = logs.slice(0, 10).map(log => ({
    name: new Date(log.createdAt).toLocaleDateString(),
    value: log.totalCO2 || 0,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-green-50 p-6 border border-green-200">
          <h3 className="text-sm font-semibold text-green-700">Total Emissions</h3>
          <p className="mt-2 text-3xl font-bold text-green-800">
            {totalEmissions.toFixed(2)} kg
          </p>
          <p className="mt-1 text-xs text-green-600">{logs.length} calculations</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-6 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-700">Average per Calc</h3>
          <p className="mt-2 text-3xl font-bold text-blue-800">
            {averageEmissions.toFixed(2)} kg
          </p>
          <p className="mt-1 text-xs text-blue-600">Monthly average</p>
        </div>

        <div className="rounded-xl bg-orange-50 p-6 border border-orange-200">
          <h3 className="text-sm font-semibold text-orange-700">This Month</h3>
          <p className="mt-2 text-3xl font-bold text-orange-800">
            {monthlyStats?.totalCO2 ? monthlyStats.totalCO2.toFixed(2) : "0"} kg
          </p>
          <p className="mt-1 text-xs text-orange-600">{monthlyStats?.count || 0} entries</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {weeklyData.length > 0 && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Recent Trend</h3>
            <WeeklyBarChart data={weeklyData} />
          </div>
        )}

        {pieData.length > 0 && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Emissions Distribution</h3>
            <EmissionPieChart data={pieData} />
          </div>
        )}
      </div>

      {/* Recent Logs Table */}
      {logs.length > 0 ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-800">
            All Calculations ({logs.length})
          </h2>
          <RecentLogs logs={logs} />
        </div>
      ) : (
        <div className="rounded-xl border bg-gray-50 p-6">
          <p className="text-center text-gray-600">
            No calculations yet. Start by using the{" "}
            <a href="/calculator" className="font-semibold text-green-600 hover:underline">
              calculator
            </a>
            !
          </p>
        </div>
      )}
    </div>
  );
}