import { View, FlatList, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
// TODO: Import useActivities from "../contexts/ActivityContext"
// TODO: Import globalStyles
// TODO: Import ActivityListItem
// TODO: Import PrimaryButton

export default function HomeScreen() {
  const router = useRouter();
  // TODO: Get activities from useActivities()

  return (
    <View style={globalStyles.container} testID="container">
      {/* TODO: Display header text "Fitness Tracker" using globalStyles.headerText */}

      {/* TODO: Add a PrimaryButton with label "Add New Activity"
          - On press, navigate to "/add-edit" */}

      <View style={styles.buttonSpacer} />

      {/* TODO: Add a FlatList to render activities
          - Use activities as data
          - keyExtractor should use item.id
          - renderItem should render ActivityListItem with activity
          - Apply styles.list as contentContainerStyle
          - Add testID="activity-list" */}
    </View>
  );
}

const styles = StyleSheet.create({
  // TODO: Define list padding (paddingBottom: 20)
  list: {},

  // TODO: Define button spacer (height: 20)
  buttonSpacer: {},
});
