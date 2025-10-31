import { useState, useEffect } from "react";
import { View, TextInput, Alert, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  addActivity,
  updateActivity,
  selectActivityById,
} from "../features/activities/activitiesSlice";
import type { RootState, AppDispatch } from "../store/store";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";
import PrimaryButton from "../components/PrimaryButton";

export default function AddEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const actId = Array.isArray(id) ? id[0] : (id as string | undefined);
  const activity = useSelector((state: RootState) =>
    actId ? selectActivityById(state, actId) : undefined
  );

  const [type, setType] = useState<string>("");
  const [duration, setDuration] = useState<string>("0");
  const [calories, setCalories] = useState<string>("");

  useEffect(() => {
    if (activity) {
      setType(activity.type);
      setDuration(String(activity.duration));
      setCalories(String(activity.calories));
    }
  }, [activity]);

  const handleSubmit = () => {
    if (!type.trim()) {
      Alert.alert("Validation", "Activity type is required");
      return;
    }

    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert("Validation", "Duration must be a positive integer");
      return;
    }

    const caloriesNum = calories.trim() ? parseInt(calories, 10) : durationNum * 10;
    if (isNaN(caloriesNum) || caloriesNum < 0) {
      Alert.alert("Validation", "Calories must be a positive integer");
      return;
    }

    const payload = {
      type: type.trim(),
      duration: durationNum,
      calories: caloriesNum,
    };

    if (activity) {
      dispatch(updateActivity({ id: activity.id, updated: payload }));
    } else {
      dispatch(addActivity(payload));
    }

    router.push("/");
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>
        {activity ? "Edit Activity" : "Add Activity"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Activity Type (e.g., Running)"
        value={type}
        onChangeText={setType}
        placeholderTextColor={colors.placeholder}
      />

    
      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholderTextColor={colors.placeholder}
      />


      <TextInput
        style={styles.input}
        placeholder="Calories (optional, default: duration * 10)"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        placeholderTextColor={colors.placeholder}
      />

      <PrimaryButton onPress={handleSubmit} testID="add-button">
        {activity ? "Update Activity" : "Add Activity"}
      </PrimaryButton>
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
