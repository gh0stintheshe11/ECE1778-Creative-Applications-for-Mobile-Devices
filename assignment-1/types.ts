// Define and export a TypeScript type named `Activity` for the fitness tracker app.
// The type should represent an activity with the following properties:
// - id: a string for the unique identifier
// - type: a string for the activity type (e.g., "Running", "Swimming")
// - duration: a number for the duration in minutes
// - calories: a number for the calories burned

export type Activity = {
  id: string;
  type: string;
  duration: number;
  calories: number;
};