import { useState, useEffect } from "react";
import { View, TextInput, Alert, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Activity, NavigationProp } from "../types";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";
// TODO: Import PrimaryButton

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
      title: "", // Remove header title to avoid redundancy
    });
  }, [navigation]);

  const handleSubmit = () => {
    // TODO: Validate inputs
    // - type required
    // - duration positive integer
    // - calories optional (positive integer or default = duration * 10)

    if (activity) {
      // TODO: If editing, update the existing activity
    } else {
      // TODO: If adding, create new Activity with unique id (Date.now().toString())
    }
    // TODO: After updating state, navigate back to "Home"
  };

  return (
    <View style={globalStyles.container}>
      {/* TODO: Show header text "Add Activity" or "Edit Activity" */}

      {/* TODO: TextInput for activity type */}
      <TextInput
        style={}
        placeholder="Activity Type (e.g., Running)"
        value={}
        onChangeText={}
        placeholderTextColor={colors.placeholder}
      />

      {/* TODO: TextInput for duration (numeric keyboard) */}
      <TextInput
        style={}
        placeholder="Duration (minutes)"
        value={}
        onChangeText={}
        placeholderTextColor={colors.placeholder}
      />

      {/* TODO: TextInput for calories (numeric keyboard, optional) */}
      <TextInput
        style={}
        placeholder="Calories (optional, default: duration * 10)"
        value={}
        onChangeText={}
        placeholderTextColor={colors.placeholder}
      />
      {/* TODO: Add PrimaryButton to submit */}
      {/* - Label: "Add Activity" or "Update Activity" */}
      {/* - onPress: call handleSubmit */}
      {/* - IMPORTANT: Include testID="add-button" for autograding */}
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
