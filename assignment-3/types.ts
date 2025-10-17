// Activity type from Assignment 1
export type Activity = {
  id: string;
  type: string;
  duration: number;
  calories: number;
};

// Activity context shape for Assignment 3
export type ActivityContextType = {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id">) => void;
  updateActivity: (id: string, activity: Omit<Activity, "id">) => void;
  deleteActivity: (id: string) => void;
};
