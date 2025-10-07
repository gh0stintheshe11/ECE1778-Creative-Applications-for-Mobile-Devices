import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Activity } from "./types";

// Main component for the fitness tracker app
export default function App() {
  // TODO: Define state variables for:
  // - activities: an array of Activity objects to store logged activities
  //   - Provided below as an example
  // - type: string for activity type input (e.g., "Running")
  // - duration: string for duration input (parsed to number)
  // - calories: string for optional calories input (parsed to number if provided)
  // - editingId: string or null to track the activity being edited
  const [activities, setActivities] = useState<Activity[]>([]);
  const [type, setType] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // TODO: Implement handleSubmit function to:
  // - Validate inputs:
  //   - type: non-empty after trimming ("Please enter an activity type")
  //   - duration: positive integer ("Duration must be a positive integer")
  //   - calories: if provided, positive integer ("Calories must be a positive integer")
  // - Add or update an activity (use duration * 10 for calories if not provided)
  // - Clear form and reset editing state after submission

  const isPositiveInteger = (s: string) => /^[1-9]\d*$/.test(s.trim());

  const handleSubmit = () => {
    // Validate inputs and show Alerts for errors
   const trimmedType = type.trim();
   if (!trimmedType) {
     Alert.alert("Error", "Please enter an activity type");
     return;
   }
    if (!isPositiveInteger(duration)) {
     Alert.alert("Error", "Duration must be a positive integer");
     return;
   }

   const durationNum = parseInt(duration, 10);
   let caloriesNum: number;

   if (calories.trim() === "") {
     caloriesNum = durationNum * 10;
   } else {
     if (!isPositiveInteger(calories)) {
       Alert.alert("Error", "Calories must be a positive integer");
       return;
     }
     caloriesNum = parseInt(calories, 10);
   }

    const newActivity: Activity = {
      id: editingId || Date.now().toString(),
      type,
      duration: parseInt(duration, 10),
      calories: calories ? parseInt(calories, 10) : parseInt(duration, 10) * 10,
    };

    if (editingId) {
      // Update existing activity
      setActivities(prev => prev.map(a => a.id === editingId ? { ...a, type: trimmedType, 
      duration: durationNum, 
      calories: caloriesNum } : a ) );
      setEditingId(null);
    } else {
      // Add new activity
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: trimmedType,
        duration: durationNum,
        calories: caloriesNum,
      };
      setActivities((prev) => [...prev, newActivity]);
    }
    // Clear form
    setType("");
    setDuration("");
    setCalories("");
  };

  // TODO: Implement editActivity function to:
  // - Find the activity by ID
  // - Pre-fill the form with the activity's type, duration, and calories
  // - Set editing state to update mode
  const editActivity = (id: string) => {
    const a = activities.find(x => x.id === id);
    if (!a) return;
    setType(a.type);
    setDuration(String(a.duration));
    setCalories(String(a.calories));
    setEditingId(id);
  };

  // TODO: Implement deleteActivity function to:
  // - Remove an activity by ID from the activities array
  // - Clear form and reset editing state if the deleted activity was being edited
  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    if (editingId === id) {
      setType("");
      setDuration("");
      setCalories("");
      setEditingId(null);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.header}>Fitness Tracker</Text>
          <TextInput
            style={styles.input}
            placeholder="Activity Type (e.g., Running)"
            value={type}
            onChangeText={setType}
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (minutes)"
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
          />
          <TextInput
            style={styles.input}
            placeholder="Calories (optional, default: duration * 10)"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
          />
          <Button
            title={editingId ? "Update Activity" : "Add Activity"}
            onPress={handleSubmit}
          />
          <FlatList
            data={activities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>
                  {item.type} - {item.duration} min - {item.calories} cal
                </Text>
                <View style={styles.buttons}>
                  <Button
                    title="Edit"
                    onPress={() => editActivity(item.id)}
                  />
                  <Button
                    title="Delete"
                    onPress={() => deleteActivity(item.id)}
                    color="red"
                  />    
                </View>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
});