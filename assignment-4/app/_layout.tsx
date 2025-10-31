import { useEffect } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { setActivities } from "../features/activities/activitiesSlice";
import { loadActivities } from "../storage/activitiesStorage";
import { colors } from "../constants/colors";

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      const data = await loadActivities();
      store.dispatch(setActivities(data));
    })();
  }, []);

  return (
    <Provider store={store}>
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
        <Stack.Screen name="details/[id]" options={{ title: "Activity Details" }} />
      </Stack>
    </Provider>
  );
}
