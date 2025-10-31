import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { saveActivities } from "../../storage/activitiesStorage";
import { Activity } from "../../types";
import { RootState } from "../../store/store";

interface ActivitiesState {
  activities: Activity[];
  loaded: boolean;
}

const initialState: ActivitiesState = {
  activities: [],
  loaded: false,
};

const activitiesSlice = createSlice<ActivitiesState>({
  name: "activities",
  initialState,
  reducers: {
  addActivity: (state: ActivitiesState, action: PayloadAction<Omit<Activity, "id">>) => {
      const id = Date.now().toString();
      const newActivity: Activity = { id, ...action.payload };
      state.activities.push(newActivity);
      // fire-and-forget persistence
      void saveActivities(state.activities);
    },
    updateActivity: (
      state: ActivitiesState,
      action: PayloadAction<{ id: string; updated: Omit<Activity, "id"> }>
    ) => {
      for (let i = 0; i < state.activities.length; i++) {
        if (state.activities[i].id === action.payload.id) {
          state.activities[i] = {
            id: action.payload.id,
            ...action.payload.updated,
          };
          void saveActivities(state.activities);
          break;
        }
      }
    },
    deleteActivity: (state: ActivitiesState, action: PayloadAction<string>) => {
      state.activities = state.activities.filter((a: Activity) => a.id !== action.payload);
      void saveActivities(state.activities);
    },
  setActivities: (state: ActivitiesState, action: PayloadAction<Activity[]>) => {
      state.activities = action.payload;
      state.loaded = true;
    },
  },
});

export const { addActivity, updateActivity, deleteActivity, setActivities } =
  activitiesSlice.actions;

export const selectActivities = (state: RootState) =>
  state.activities.activities;

export const selectActivityById = (state: RootState, id: string) => {
  for (const a of state.activities.activities) {
    if (a.id === id) return a;
  }
  return undefined;
};

export default activitiesSlice.reducer;
