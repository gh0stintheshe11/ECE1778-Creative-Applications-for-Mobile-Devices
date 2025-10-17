import { createContext, useContext, useState, ReactNode } from "react";
import { Activity, ActivityContextType } from "../types";

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);

  // TODO: Implement addActivity
  // - Accepts new activity without id
  // - Generates unique id (e.g., Date.now().toString())
  // - Adds to activities state
  const addActivity = (newActivity: Omit<Activity, "id">) => {
    const id = Date.now().toString();
    setActivities((prev) => [...prev, { id, ...newActivity }]);
  };

  // TODO: Implement updateActivity
  // - Accepts id and updated activity data (without id)
  // - Updates matching activity in state
  const updateActivity = (id: string, updated: Omit<Activity, "id">) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  // TODO: Implement deleteActivity
  // - Accepts id and removes matching activity from state
  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <ActivityContext.Provider
      value={{ activities, addActivity, updateActivity, deleteActivity }}
    >
      {children}
    </ActivityContext.Provider>
  );
}


// TODO: Implement a custom hook to access ActivityContext
export function useActivities(): ActivityContextType {
  // Get the context value with useContext
  const context = useContext(ActivityContext);

  // TODO: throw an error with message "useActivities must be used within an ActivityProvider" if context is undefined
  if (!context) {
    throw new Error(
      "useActivities must be used within an ActivityProvider"
    );
  }

  return context;
}
