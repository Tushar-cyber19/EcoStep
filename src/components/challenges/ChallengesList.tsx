"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  startChallenge, 
  completeChallenge, 
  stopChallenge,
  getUserChallengeProgress,
  getLeaderboard,
  getUserLeaderboardRank,
  getUserStats,
} from "@/services/challenges.firebase";
import { Zap, Leaf, Utensils, Droplet, Zap as Bolt, TrendingUp, Users } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: string;
  icon: React.ReactNode;
  difficulty: "Easy" | "Medium" | "Hard";
  reward: number;
  tips: string[];
}

interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: "active" | "completed" | "stopped";
  startedAt: Date;
  completedAt?: Date;
  stoppedAt?: Date;
  points: number;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  totalPoints: number;
  completedChallenges: number;
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Energy Saver",
    description: "Reduce your electricity usage by 20%",
    target: 20,
    unit: "%",
    icon: <Bolt className="text-yellow-500" size={32} />,
    difficulty: "Medium",
    reward: 100,
    tips: [
      "Switch to LED bulbs",
      "Use smart power strips",
      "Adjust thermostat settings",
      "Use natural lighting",
    ],
  },
  {
    id: "2",
    title: "Green Commute",
    description: "Use public transport for at least 50% of your trips",
    target: 50,
    unit: "%",
    icon: <Leaf className="text-green-600" size={32} />,
    difficulty: "Medium",
    reward: 120,
    tips: [
      "Use public transportation",
      "Carpool with friends",
      "Try cycling or walking",
      "Plan routes efficiently",
    ],
  },
  {
    id: "3",
    title: "Meatless Mondays",
    description: "Go vegetarian for 4 weeks",
    target: 4,
    unit: "weeks",
    icon: <Utensils className="text-orange-500" size={32} />,
    difficulty: "Easy",
    reward: 80,
    tips: [
      "Try new plant-based recipes",
      "Join cooking classes",
      "Explore local markets",
      "Experiment with legumes",
    ],
  },
  {
    id: "4",
    title: "Water Warrior",
    description: "Reduce water usage by 25%",
    target: 25,
    unit: "%",
    icon: <Droplet className="text-blue-500" size={32} />,
    difficulty: "Easy",
    reward: 75,
    tips: [
      "Take shorter showers",
      "Fix leaky faucets",
      "Use water-efficient appliances",
      "Collect rainwater",
    ],
  },
  {
    id: "5",
    title: "Zero Waste Champion",
    description: "Achieve 90% recycling rate for 24 hours",
    target: 90,
    unit: "%",
    icon: <Leaf className="text-emerald-600" size={32} />,
    difficulty: "Hard",
    reward: 150,
    tips: [
      "Learn local recycling rules",
      "Compost organic waste",
      "Use reusable bags",
      "Buy minimal packaging products",
    ],
  },
  {
    id: "6",
    title: "Carbon Neutral Hero",
    description: "Keep your daily footprint below 10 kg CO₂",
    target: 10,
    unit: "kg",
    icon: <Zap className="text-green-500" size={32} />,
    difficulty: "Hard",
    reward: 200,
    tips: [
      "Combine all practices",
      "Use renewable energy",
      "Minimize travel",
      "Plant trees to offset",
    ],
  },
];

export default function ChallengesList() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [userChallenges, setUserChallenges] = useState<Map<string, UserChallenge>>(new Map());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [userStats, setUserStats] = useState({ totalPoints: 0, completedChallenges: 0 });
  const [timeRemaining, setTimeRemaining] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const challengesRes = await getUserChallengeProgress(user.uid);
        if (!challengesRes.error && challengesRes.data && isMounted) {
          const challengeMap = new Map<string, UserChallenge>();
          challengesRes.data.forEach((challenge: any) => {
            challengeMap.set(challenge.challengeId, challenge);
          });
          setUserChallenges(challengeMap);
        }

        const leaderboardRes = await getLeaderboard(5);
        if (!leaderboardRes.error && leaderboardRes.data && isMounted) {
          setLeaderboard(leaderboardRes.data as LeaderboardEntry[]);
        }

        const rankRes = await getUserLeaderboardRank(user.uid);
        if (!rankRes.error && rankRes.data && isMounted) {
          setUserRank(rankRes.data.rank);
        }

        const statsRes = await getUserStats(user.uid);
        if (!statsRes.error && statsRes.data && isMounted) {
          setUserStats(statsRes.data as typeof userStats);
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load challenge data:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  // Timer effect for active challenges
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining = new Map<string, number>();
      const now = Date.now();

      userChallenges.forEach((challenge, challengeId) => {
        if (challenge.status === "active") {
          const startTime = new Date(challenge.startedAt).getTime();
          const endTime = startTime + 24 * 60 * 60 * 1000;
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
          newTimeRemaining.set(challengeId, remaining);
        }
      });

      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [userChallenges]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStartChallenge = async (challengeId: string) => {
    if (!user?.uid) return;

    const res = await startChallenge(user.uid, challengeId, 0);
    if (!res.error) {
      const challengesRes = await getUserChallengeProgress(user.uid);
      if (!challengesRes.error && challengesRes.data) {
        const challengeMap = new Map<string, UserChallenge>();
        challengesRes.data.forEach((challenge: any) => {
          challengeMap.set(challenge.challengeId, challenge);
        });
        setUserChallenges(challengeMap);
      }
    }
  };

  const handleCompleteChallenge = async (challengeId: string, reward: number) => {
    if (!user?.uid) return;

    const res = await completeChallenge(user.uid, challengeId, reward);
    if (!res.error) {
      const challengesRes = await getUserChallengeProgress(user.uid);
      if (!challengesRes.error && challengesRes.data) {
        const challengeMap = new Map<string, UserChallenge>();
        challengesRes.data.forEach((challenge: any) => {
          challengeMap.set(challenge.challengeId, challenge);
        });
        setUserChallenges(challengeMap);
      }

      const statsRes = await getUserStats(user.uid);
      if (!statsRes.error && statsRes.data) {
        setUserStats(statsRes.data as typeof userStats);
      }

      const leaderboardRes = await getLeaderboard(5);
      if (!leaderboardRes.error && leaderboardRes.data) {
        setLeaderboard(leaderboardRes.data as LeaderboardEntry[]);
      }

      const rankRes = await getUserLeaderboardRank(user.uid);
      if (!rankRes.error && rankRes.data) {
        setUserRank(rankRes.data.rank);
      }
    }
  };

  const handleStopChallenge = async (challengeId: string) => {
    if (!user?.uid) return;

    const res = await stopChallenge(user.uid, challengeId);
    if (!res.error) {
      const challengesRes = await getUserChallengeProgress(user.uid);
      if (!challengesRes.error && challengesRes.data) {
        const challengeMap = new Map<string, UserChallenge>();
        challengesRes.data.forEach((challenge: any) => {
          challengeMap.set(challenge.challengeId, challenge);
        });
        setUserChallenges(challengeMap);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getActiveChallenge = (challengeId: string) => {
    return userChallenges.get(challengeId);
  };

  const getCompletedChallengesCount = () => {
    return Array.from(userChallenges.values()).filter(
      (c) => c.status === "completed"
    ).length;
  };

  const completedCount = getCompletedChallengesCount();
  const progressPercentage = (completedCount / challenges.length) * 100;

  if (loading) {
    return <div className="text-center py-8">Loading challenges...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar at Top */}
      <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 border border-green-200">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={24} className="text-green-600" />
            Your Progress
          </h3>
          <span className="text-sm font-semibold text-gray-600">
            {completedCount} of {challenges.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Total Points</p>
            <p className="text-2xl font-bold text-yellow-600">🏆 {userStats.totalPoints}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Your Rank</p>
            <p className="text-2xl font-bold text-blue-600">#{userRank || 'N/A'}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users size={24} className="text-blue-600" />
          Top Performers
        </h3>
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.userId}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.userId === user?.uid ? "bg-blue-200 border-2 border-blue-600" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                  index === 0 ? "bg-yellow-500 text-white" :
                  index === 1 ? "bg-gray-400 text-white" :
                  index === 2 ? "bg-orange-500 text-white" :
                  "bg-gray-200 text-gray-700"
                }`}>
                  {entry.rank}
                </span>
                <div>
                  <p className="font-semibold text-gray-800">
                    {entry.userId === user?.uid ? "You" : `User ${entry.userId.slice(0, 8)}`}
                  </p>
                  <p className="text-xs text-gray-600">{entry.completedChallenges} challenges</p>
                </div>
              </div>
              <p className="font-bold text-lg text-yellow-600">🏆 {entry.totalPoints}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => {
          const activeChallenge = getActiveChallenge(challenge.id);
          const isActive = activeChallenge?.status === "active";
          const isCompleted = activeChallenge?.status === "completed";
          const timeLeft = timeRemaining.get(challenge.id) || 0;

          return (
            <div
              key={challenge.id}
              className={`relative rounded-xl border-2 p-6 transition ${
                isCompleted
                  ? "border-green-500 bg-green-50"
                  : isActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-green-400"
              }`}
            >
              {/* Status Badge */}
              {isCompleted && (
                <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white font-bold">
                  ✓
                </div>
              )}
              {isActive && (
                <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xs">
                  ▶
                </div>
              )}

              {/* Icon */}
              <div className="mb-4">{challenge.icon}</div>

              {/* Title */}
              <h3 className="mb-2 text-lg font-bold text-gray-800">{challenge.title}</h3>

              {/* Description */}
              <p className="mb-4 text-sm text-gray-600">{challenge.description}</p>

              {/* Timer (if active) */}
              {isActive && (
                <div className="mb-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                  <p className="text-xs font-semibold text-yellow-700">⏱️ Time Remaining:</p>
                  <p className="text-sm font-bold text-yellow-900">{formatTime(timeLeft)}</p>
                </div>
              )}

              {/* Difficulty & Reward */}
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                  🏆 {challenge.reward}
                </span>
              </div>

              {/* Duration */}
              <div className="mb-4 text-xs text-gray-500">⏱️ 24 hours max</div>

              {/* Action Buttons */}
              {!isActive && !isCompleted && (
                <button
                  onClick={() => handleStartChallenge(challenge.id)}
                  className="w-full rounded-lg py-2 font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition"
                >
                  Start Challenge
                </button>
              )}

              {isActive && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleCompleteChallenge(challenge.id, challenge.reward)}
                    className="w-full rounded-lg py-2 font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    ✓ Complete Challenge
                  </button>
                  <button
                    onClick={() => handleStopChallenge(challenge.id)}
                    className="w-full rounded-lg py-2 font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    ✕ Stop Challenge
                  </button>
                </div>
              )}

              {isCompleted && (
                <button
                  disabled
                  className="w-full rounded-lg py-2 font-semibold bg-green-600 text-white cursor-default opacity-70"
                >
                  ✓ Completed
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded Challenge Details */}
      {selected && (
        <div className="rounded-xl border-2 border-green-400 bg-green-50 p-8">
          {(() => {
            const challenge = challenges.find((c) => c.id === selected);
            if (!challenge) return null;

            return (
              <div className="max-w-3xl">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="mb-2 text-3xl font-bold text-gray-800">
                      {challenge.title}
                    </h2>
                    <p className="text-lg text-gray-600">{challenge.description}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-2xl text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-white p-4">
                    <p className="text-sm text-gray-600">Target</p>
                    <p className="text-2xl font-bold text-green-700">
                      {challenge.target} {challenge.unit}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-4">
                    <p className="text-sm text-gray-600">Reward Points</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      🏆 {challenge.reward}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-4">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-2xl font-bold text-blue-600">24 hours</p>
                  </div>
                </div>

                {/* Tips */}
                <div className="rounded-lg bg-white p-6">
                  <h3 className="mb-4 text-lg font-bold text-gray-800">💡 Tips to Complete</h3>
                  <ul className="space-y-3">
                    {challenge.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="inline-block w-6 h-6 rounded-full bg-green-200 text-green-700 font-bold text-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
