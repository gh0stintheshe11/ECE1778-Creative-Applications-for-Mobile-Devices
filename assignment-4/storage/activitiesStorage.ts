import AsyncStorage from "@react-native-async-storage/async-storage";
import { Activity } from "../types";

const STORAGE_KEY = "@FitnessTracker_activities";

export async function loadActivities(): Promise<Activity[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as Activity[];
    }
    return [];
  } catch {
    return [];
  }
}

export async function saveActivities(activities: Activity[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch {
    // Ignore storage errors, no need to implement anything here
  }
}
