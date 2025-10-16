import { Stack } from "expo-router";
// TODO: Import ActivityProvider from contexts
// TODO: Import colors for consistent header styling

export default function RootLayout() {
  return (
    // TODO: Wrap the navigation stack with ActivityProvider
    <Stack
      screenOptions={
        {
          // TODO: Configure header styling
          // - Use colors.primary for background
          // - Use colors.white for tint
          // - Bold fontWeight for title
          // - Center align the title
          // - Set back button text to "Back"
        }
      }
    >
      {/* TODO: Define index screen with title "Fitness Tracker" */}
      <Stack.Screen name="index" options={{}} />

      {/* TODO: Define add-edit screen with empty title */}
      <Stack.Screen name="add-edit" options={{}} />

      {/* TODO: Define details/[id] screen with title "Activity Details" */}
      <Stack.Screen name="details/[id]" options={{}} />
    </Stack>
  );
}
