import { db, auth } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

interface SaveFootprintResponse {
  error: { message: string } | null;
  data?: any;
}

/**
 * Initialize user profile in Firestore (called on first footprint save)
 */
async function initializeUserProfile(userId: string) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const user = auth.currentUser;
      await setDoc(userRef, {
        email: user?.email || "",
        displayName: user?.displayName || "User",
        photoURL: user?.photoURL || "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        preferences: {
          theme: "light",
          units: "metric",
        },
        stats: {
          totalCalculations: 0,
          lastCalculation: Timestamp.now(),
        },
      });
    }
  } catch (err) {
    console.error("Failed to initialize user profile:", err);
    // Don't throw - this is non-critical
  }
}

/**
 * Save user's carbon footprint calculation to the database
 * @param userId - The user's ID
 * @param electricity - Monthly electricity usage in kWh
 * @param transport - Weekly travel distance in km
 * @param totalCO2 - Total CO2 emissions in kg
 * @returns Object with error property if something went wrong
 */
export async function saveFootprint(
  userId: string,
  electricity: number,
  transport: number,
  totalCO2: number,
  breakdown?: any,
  details?: any
): Promise<SaveFootprintResponse> {
  try {
    // Initialize user profile if first time
    await initializeUserProfile(userId);

    const footprintsRef = collection(db, "footprints");
    
    const month = new Date().toISOString().substring(0, 7);
    
    const docRef = await addDoc(footprintsRef, {
      userId,
      electricity,
      transport,
      totalCO2,
      breakdown: breakdown || {},
      details: details || {},
      createdAt: Timestamp.now(),
      month,
    });

    return { error: null, data: { id: docRef.id } };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to save footprint";
    console.error("Save footprint error:", err);
    return { error: { message: errorMessage } };
  }
}

export async function getUserFootprints(userId: string, limitCount: number = 30) {
  try {
    if (!userId) {
      console.warn("getUserFootprints: No userId provided");
      return { error: null, data: [] };
    }

    const footprintsRef = collection(db, "footprints");
    
    // Simple query without orderBy to avoid needing composite index
    const q = query(
      footprintsRef,
      where("userId", "==", userId),
      limit(limitCount * 2) // Fetch extra in case we need sorting
    );

    console.log("Fetching footprints for user:", userId);
    const snapshot = await getDocs(q);
    
    console.log("Footprints snapshot received, doc count:", snapshot.docs.length);

    if (snapshot.empty) {
      console.log("No footprints found for user:", userId);
      return { error: null, data: [] };
    }

    // Sort client-side by createdAt descending
    const footprints = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order
      })
      .slice(0, limitCount); // Limit after sorting

    console.log("Successfully loaded footprints:", footprints.length);
    return { error: null, data: footprints };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch footprints";
    console.error("getUserFootprints error:", errorMessage, err);
    return { error: { message: errorMessage }, data: [] };
  }
}

export async function getUserMonthlyStats(userId: string, month: string) {
  try {
    const footprintsRef = collection(db, "footprints");
    
    const q = query(
      footprintsRef,
      where("userId", "==", userId),
      where("month", "==", month)
    );

    const snapshot = await getDocs(q);
    
    let totalCO2 = 0;
    let count = 0;

    snapshot.docs.forEach(doc => {
      totalCO2 += doc.data().totalCO2 || 0;
      count += 1;
    });

    const average = count > 0 ? totalCO2 / count : 0;

    return { error: null, data: { totalCO2, count, average } };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch monthly stats";
    console.error("Get monthly stats error:", err);
    return { error: { message: errorMessage }, data: { totalCO2: 0, count: 0, average: 0 } };
  }
}
