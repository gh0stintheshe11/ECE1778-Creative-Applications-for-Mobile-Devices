import { Stack } from "expo-router";
import { ActivityProvider } from "../contexts/ActivityContext";
import { colors } from "../constants/colors";

export default function RootLayout() {
  return (
    <ActivityProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Fitness Tracker" }} />
        <Stack.Screen name="add-edit" options={{ title: "" }} />
        <Stack.Screen
          name="details/[id]"
          options={{ title: "Activity Details" }}
        />
      </Stack>
    </ActivityProvider>
  );
}
