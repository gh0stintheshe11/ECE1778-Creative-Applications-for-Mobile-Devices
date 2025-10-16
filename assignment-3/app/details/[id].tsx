import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
// TODO: Import useActivities from contexts
// TODO: Import globalStyles
// TODO: Import DetailsCard and ActionButton components

export default function DetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  // TODO: Get activities and deleteActivity from useActivities()
  // TODO: Find the activity that matches the id

  // TODO: Handle case when activity is not found
  // - Return a View with globalStyles.container
  // - Show "Activity Not Found" using globalStyles.headerText

  const handleDelete = () => {
    // TODO: Delete activity from context
    // TODO: Navigate back to Home ("/")
  };

  return (
    <View style={globalStyles.container}>
      {/* TODO: Display header text "Activity Details" using globalStyles.headerText */}
      {/* TODO: Render DetailsCard to show the current activity */}

      {/* TODO: Row of ActionButtons */}
      <View style={styles.buttons}>
        {/* TODO: Edit button */}
        {/* - variant="primary" */}
        {/* - navigates to "/add-edit?id=..." with the current activity */}
        {/* - use styles.button */}
        {/* - IMPORTANT: Include testID="edit-button" */}

        {/* TODO: Delete button */}
        {/* - variant="danger" */}
        {/* - deletes activity and navigates back to Home */}
        {/* - use styles.button */}
        {/* - IMPORTANT: Include testID="delete-button" */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // TODO: Row style for buttons
  buttons: {},
  // TODO: Individual button style
  button: {},
});
