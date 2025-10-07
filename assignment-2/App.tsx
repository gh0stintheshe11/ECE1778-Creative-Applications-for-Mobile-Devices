import { useState } from "react";
// TODO: Import additional navigation components
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Activity, RootStackParamList } from "./types";
// TODO: Import the remaining screen components
import HomeScreen from "./screens/HomeScreen";
// TODO: Import colors for consistent header styling

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
      // TODO: Set the initial screen to "Home"

      // TODO: Configure screenOptions for header styling
      // Use colors.primary for header background, colors.white for header tint, bold fontWeight, centered title, and "Back" for back button
      screenOptions={{}}
    >
      <Stack.Screen name="Home">
        {(props) => (
          <HomeScreen
            {...props}
            // TODO: Pass activities and setActivities as props
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddEdit">
        {/* TODO: Define AddEdit screen to render AddEditScreen */}
        {/* Pass setActivities as a prop using the render function pattern */}
        {/* Example: {(props) => <AddEditScreen ... />} */}
        {}
      </Stack.Screen>
      <Stack.Screen name="Details">
        {/* TODO: Define Details screen to render DetailsScreen */}
        {/* Pass setActivities as a prop using the render function pattern */}
        {}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  return (
    <SafeAreaProvider>
      {/* TODO: Wrap RootStack with NavigationContainer */}
      {/* TODO: Pass activities and setActivities to RootStack */}
    </SafeAreaProvider>
  );
}
