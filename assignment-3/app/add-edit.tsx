import { useState, useEffect } from "react";
import { View, TextInput, Alert, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
// TODO: Import useActivities from contexts
// TODO: Import globalStyles
// TODO: Import colors from constants
// TODO: Import PrimaryButton component

export default function AddEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  // TODO: Get activities, addActivity, updateActivity from useActivities()

  // TODO: If an id is provided, find the matching activity from the list
  const activity = /* check if id exists, then find the corresponding activity from activities */;

  // TODO: Create state for type, duration, calories
  const [type, setType] = useState;
  const [duration, setDuration] = useState;
  const [calories, setCalories] = useState;

  useEffect(() => {
    if (activity) {
      // TODO: If editing an existing activity, populate state with activity values
    }
  }, [activity]);

  const handleSubmit = () => {
    // TODO: Validate inputs (reused from Assignment 1 & 2)
    // - type required
    // - duration must be positive integer
    // - calories optional (positive integer or default = duration * 10)

    if (activity) {
      // TODO: Update existing activity using updateActivity
    } else {
      // TODO: Add new activity using addActivity
    }
    // TODO: Navigate back to Home ("/")
  };

  return (
    <View style={globalStyles.container}>
      {/* TODO: Display header text "Add Activity" or "Edit Activity" */}

      {/* TODO: TextInput for activity type */}
      <TextInput
        style={styles.input}
        placeholder="Activity Type (e.g., Running)"
        value={}
        onChangeText={}
        placeholderTextColor={colors.placeholder}
      />

      {/* TODO: TextInput for duration (numeric keyboard) */}
      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        value={}
        onChangeText={}
        placeholderTextColor={colors.placeholder}
      />

      {/* TODO: TextInput for calories (numeric keyboard, optional) */}
      <TextInput
        style={styles.input}
        placeholder="Calories (optional, default: duration * 10)"
        value={}
        onChangeText={}
        placeholderTextColor={colors.placeholder}
      />

      {/* TODO: PrimaryButton to submit */}
      {/* - Label: "Add Activity" or "Update Activity" */}
      {/* - onPress: call handleSubmit */}
      {/* - IMPORTANT: Include testID="add-button" */}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
});
