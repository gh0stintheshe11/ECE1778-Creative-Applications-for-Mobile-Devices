import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Activity, RootStackParamList } from "./types";
import HomeScreen from "./screens/HomeScreen";
import AddEditScreen from "./screens/AddEditScreen";
import DetailsScreen from "./screens/DetailsScreen";
import { colors } from "./constants/colors";

// Initialize the Stack navigator with RootStackParamList for type-safe navigation
const Stack = createNativeStackNavigator<RootStackParamList>();

// RootStack component defines the navigation structure
// Props:
// - activities: array of Activity objects
// - setActivities: function to update activities
function RootStack({
  activities,
  setActivities,
}: {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}) {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="Home">
        {(props: any) => (
          <HomeScreen
            {...props}
            activities={activities}
            setActivities={setActivities}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddEdit">
        {(props: any) => (
          <AddEditScreen {...props} setActivities={setActivities} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Details">
        {(props: any) => (
          <DetailsScreen {...props} setActivities={setActivities} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack activities={activities} setActivities={setActivities} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
