import { useState, useEffect } from "react";
import { View, TextInput, Alert, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Activity, NavigationProp } from "../types";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";
import PrimaryButton from "../components/PrimaryButton";

type Props = {
  route: { params?: { activity?: Activity } };
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
};

export default function AddEditScreen({ route, setActivities }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const activity = route.params?.activity;
  const [type, setType] = useState<string>(activity?.type || "");
  const [duration, setDuration] = useState<string>(
    activity?.duration.toString() || ""
  );
  const [calories, setCalories] = useState<string>(
    activity?.calories.toString() || ""
  );

  useEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, [navigation]);

  const handleSubmit = () => {
    const isPositiveInteger = (s: string) => /^[1-9]\d*$/.test(s.trim());
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

    if (activity) {
      setActivities((prev) =>
        prev.map((a) =>
          a.id === activity.id
            ? { ...a, type: trimmedType, duration: durationNum, calories: caloriesNum }
            : a
        )
      );
    } else {
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: trimmedType,
        duration: durationNum,
        calories: caloriesNum,
      };
      setActivities((prev) => [...prev, newActivity]);
    }
    navigation.navigate("Home");
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
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
        placeholderTextColor={colors.placeholder}
      />

      <TextInput
        style={styles.input}
        placeholder="Calories (optional, default: duration * 10)"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
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
