import HistoryDashboard from "@/components/history/HistoryDashboard";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <div 
        className="mx-auto max-w-6xl p-8"
        style={{
          backgroundColor: '#ffffff',
          color: '#171717',
        }}
      >
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-green-700">
            Emissions History
          </h1>
          <p className="text-gray-600">
            View all your carbon footprint calculations and track your progress over time.
          </p>
        </div>

        <HistoryDashboard />
      </div>
    </ProtectedRoute>
  );
}