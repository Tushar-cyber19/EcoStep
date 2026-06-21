"use server";

import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

interface FootprintRecord {
  userId: string;
  electricity: number;
  transport: number;
  totalCO2: number;
  createdAt: Timestamp;
  month: string; // YYYY-MM format
}

export async function saveFootprint(
  userId: string,
  electricity: number,
  transport: number,
  totalCO2: number
): Promise<{ error: { message: string } | null; data?: any }> {
  try {
    const footprintsRef = collection(db, "footprints");
    
    const month = new Date().toISOString().substring(0, 7);
    
    const docRef = await addDoc(footprintsRef, {
      userId,
      electricity,
      transport,
      totalCO2,
      createdAt: Timestamp.now(),
      month,
    } as FootprintRecord);

    return { error: null, data: { id: docRef.id } };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to save footprint";
    return { error: { message: errorMessage } };
  }
}

export async function getUserFootprints(userId: string, limitCount: number = 30) {
  try {
    const footprintsRef = collection(db, "footprints");
    
    const q = query(
      footprintsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    
    const footprints = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));

    return { error: null, data: footprints };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch footprints";
    return { error: { message: errorMessage } };
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
    return { error: { message: errorMessage } };
  }
}
