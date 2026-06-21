import ProtectedRoute from "@/components/layout/ProtectedRoute";
import ChallengesList from "@/components/challenges/ChallengesList";

export default function ChallengesPage() {
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
            Eco Challenges
          </h1>
          <p className="text-gray-600">
            Complete challenges to reduce your carbon footprint and earn rewards!
          </p>
        </div>

        <ChallengesList />
      </div>
    </ProtectedRoute>
  );
}
