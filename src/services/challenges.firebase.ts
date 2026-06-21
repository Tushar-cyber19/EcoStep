"use server";

import { getAdminDb } from "@/lib/firebase/admin-config";
import * as admin from "firebase-admin";

// @ts-ignore - firebase-admin types incomplete
const Timestamp = admin.firestore.Timestamp;

interface ChallengeProgress {
  userId: string;
  challengeId: string;
  status: "active" | "completed" | "stopped";
  startedAt: any;
  completedAt?: any;
  stoppedAt?: any;
  points: number;
  notes?: string;
}

interface UserChallengeStats {
  userId: string;
  totalPoints: number;
  completedChallenges: number;
  leaderboardRank?: number;
}

/**
 * Start a challenge for a user
 */
export async function startChallenge(
  userId: string,
  challengeId: string,
  points: number = 0
): Promise<{ error: { message: string } | null; data?: any }> {
  try {
    if (!userId) {
      return { error: { message: "User ID is required" } };
    }

    const db = getAdminDb();
    const docRef = await db.collection("userChallenges").add({
      userId,
      challengeId,
      status: "active",
      // @ts-ignore - firebase-admin types incomplete
      startedAt: admin.firestore.Timestamp.now(),
      points,
      notes: "",
    } as ChallengeProgress);

    return { error: null, data: { id: docRef.id } };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to start challenge";
    console.error("Start challenge error:", errorMessage, err);
    return { error: { message: errorMessage } };
  }
}

/**
 * Complete a challenge for a user
 */
export async function completeChallenge(
  userId: string,
  challengeId: string,
  points: number
): Promise<{ error: { message: string } | null; data?: any }> {
  try {
    if (!userId || !challengeId) {
      return { error: { message: "User ID and Challenge ID are required" } };
    }

    const db = getAdminDb();
    
    const snapshot = await db.collection("userChallenges")
      .where("userId", "==", userId)
      .where("challengeId", "==", challengeId)
      .where("status", "==", "active")
      .get();
    
    if (snapshot.empty) {
      return { error: { message: "No active challenge found" } };
    }

    const docId = snapshot.docs[0].id;
    
    await db.collection("userChallenges").doc(docId).update({
      status: "completed",
      // @ts-ignore - firebase-admin types incomplete
      completedAt: admin.firestore.Timestamp.now(),
      points,
    });

    // Update user stats
    await updateUserStats(userId, points);

    return { error: null, data: { id: docId } };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to complete challenge";
    console.error("Complete challenge error:", errorMessage, err);
    return { error: { message: errorMessage } };
  }
}

/**
 * Stop a challenge for a user
 */
export async function stopChallenge(
  userId: string,
  challengeId: string
): Promise<{ error: { message: string } | null; data?: any }> {
  try {
    const db = getAdminDb();
    
    const snapshot = await db.collection("userChallenges")
      .where("userId", "==", userId)
      .where("challengeId", "==", challengeId)
      .where("status", "==", "active")
      .get();
    
    if (snapshot.empty) {
      return { error: { message: "No active challenge found" } };
    }

    const docId = snapshot.docs[0].id;
    
    await db.collection("userChallenges").doc(docId).update({
      status: "stopped",
      // @ts-ignore - firebase-admin types incomplete
      stoppedAt: admin.firestore.Timestamp.now(),
    });

    return { error: null, data: { id: docId } };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to stop challenge";
    console.error("Stop challenge error:", errorMessage, err);
    return { error: { message: errorMessage } };
  }
}

/**
 * Get all challenge progress for a user
 */
export async function getUserChallengeProgress(userId: string) {
  try {
    if (!userId) {
      return { error: null, data: [] };
    }

    const db = getAdminDb();
    const snapshot = await db.collection("userChallenges")
      .where("userId", "==", userId)
      .get();
    
    // Sort client-side by startedAt descending
    // @ts-ignore - firebase-admin types incomplete
    const challenges = snapshot.docs
      .map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        startedAt: doc.data().startedAt?.toDate?.() || new Date(),
        completedAt: doc.data().completedAt?.toDate?.() || null,
        stoppedAt: doc.data().stoppedAt?.toDate?.() || null,
      }))
      // @ts-ignore - firebase-admin types incomplete
      .sort((a: any, b: any) => {
        const dateA = new Date(a.startedAt).getTime();
        const dateB = new Date(b.startedAt).getTime();
        return dateB - dateA; // Descending order
      });

    return { error: null, data: challenges };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch challenge progress";
    console.error("Get challenge progress error:", errorMessage, err);
    return { error: { message: errorMessage }, data: [] };
  }
}

/**
 * Get active challenge for a user on a specific challenge
 */
export async function getActiveChallengeForUser(userId: string, challengeId: string) {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("userChallenges")
      .where("userId", "==", userId)
      .where("challengeId", "==", challengeId)
      .where("status", "==", "active")
      .get();
    
    if (snapshot.empty) {
      return { error: null, data: null };
    }

    const doc = snapshot.docs[0];
    return { 
      error: null, 
      data: {
        id: doc.id,
        ...doc.data(),
        startedAt: doc.data().startedAt?.toDate?.() || new Date(),
      }
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch active challenge";
    console.error("Get active challenge error:", errorMessage, err);
    return { error: { message: errorMessage } };
  }
}

/**
 * Update user challenge statistics
 */
async function updateUserStats(userId: string, points: number) {
  try {
    const db = getAdminDb();
    const userStatsRef = db.collection("userStats").doc(userId);
    
    const userStatsDoc = await userStatsRef.get();
    
    if (userStatsDoc.exists()) {
      const currentStats = userStatsDoc.data() as UserChallengeStats;
      await userStatsRef.update({
        totalPoints: (currentStats.totalPoints || 0) + points,
        completedChallenges: (currentStats.completedChallenges || 0) + 1,
      });
    } else {
      await userStatsRef.set({
        userId,
        totalPoints: points,
        completedChallenges: 1,
      });
    }

    return { error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to update user stats";
    console.error("Update user stats error:", errorMessage, err);
    return { error: { message: errorMessage } };
  }
}

/**
 * Get leaderboard - top users by points
 */
export async function getLeaderboard(topN: number = 10) {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("userStats")
      .limit(topN * 2)
      .get();
    
    // Sort client-side by totalPoints descending
    // @ts-ignore - firebase-admin types incomplete
    const leaderboard = snapshot.docs
      .map((doc: any) => ({
        ...doc.data(),
      }))
      // @ts-ignore - firebase-admin types incomplete
      .sort((a: any, b: any) => (b.totalPoints || 0) - (a.totalPoints || 0))
      .slice(0, topN)
      // @ts-ignore - firebase-admin types incomplete
      .map((entry: any, index: number) => ({
        rank: index + 1,
        ...entry,
      }));

    return { error: null, data: leaderboard };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch leaderboard";
    console.error("Get leaderboard error:", errorMessage, err);
    return { error: { message: errorMessage }, data: [] };
  }
}

/**
 * Get user's leaderboard rank
 */
export async function getUserLeaderboardRank(userId: string) {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("userStats").get();
    
    // Sort client-side by totalPoints descending
    // @ts-ignore - firebase-admin types incomplete
    const sortedStats = snapshot.docs
      .map((doc: any) => ({
        id: doc.id,
        totalPoints: doc.data().totalPoints || 0,
      }))
      // @ts-ignore - firebase-admin types incomplete
      .sort((a: any, b: any) => b.totalPoints - a.totalPoints);

    let userRank = 0;
    for (let i = 0; i < sortedStats.length; i++) {
      if (sortedStats[i].id === userId) {
        userRank = i + 1;
        break;
      }
    }

    return { error: null, data: { rank: userRank } };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch user rank";
    console.error("Get user rank error:", errorMessage, err);
    return { error: { message: errorMessage } };
  }
}

/**
 * Get user stats
 */
export async function getUserStats(userId: string) {
  try {
    const db = getAdminDb();
    const userStatsDoc = await db.collection("userStats").doc(userId).get();
    
    if (!userStatsDoc.exists) {
      return { error: null, data: { userId, totalPoints: 0, completedChallenges: 0 } };
    }

    return { error: null, data: userStatsDoc.data() };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch user stats";
    console.error("Get user stats error:", errorMessage, err);
    return { error: { message: errorMessage } };
  }
}
