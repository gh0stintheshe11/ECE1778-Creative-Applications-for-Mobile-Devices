import { createContext, useContext, useState, ReactNode } from "react";
// TODO: Import Activity and ActivityContextType from "../types"

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);

  // TODO: Implement addActivity
  // - Accepts new activity without id
  // - Generates unique id (e.g., Date.now().toString())
  // - Adds to activities state
  const addActivity = (newActivity: Omit<Activity, "id">) => {};

  // TODO: Implement updateActivity
  // - Accepts id and updated activity data (without id)
  // - Updates matching activity in state
  const updateActivity = () => {};

  // TODO: Implement deleteActivity
  // - Accepts id and removes matching activity from state
  const deleteActivity = () => {};

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
  const context = ;

  // TODO: throw an error with message "useActivities must be used within an ActivityProvider" if context is undefined

  return context;
}
