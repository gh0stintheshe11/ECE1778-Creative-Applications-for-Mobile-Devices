import { Pressable, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
// TODO: Import Activity from "../types"
// TODO: Import useActivities from "../contexts/ActivityContext"
// TODO: Import ActionButton component
// TODO: Import Card component
// TODO: Import colors from constants

type Props = {
  activity: Activity;
};

export default function ActivityListItem({ activity }: Props) {
  const router = useRouter();
  // TODO: Get deleteActivity function from useActivities()

  const handleDelete = () => {
    // TODO: Delete the current activity using deleteActivity
  };

  return (
    // TODO: Apply styles.card
    <Card>
      <Pressable
      // TODO: Pressable area for activity content
      // - Apply styles.content
      // - Reduce opacity to 0.6 when pressed
      // - onPress: navigate to details page with current activity
      >
        <Text style={styles.text}>Type: {activity.type}</Text>
        {/* TODO: Display duration with styles.text */}
        {/* TODO: Display calories with styles.text */}
      </Pressable>

      {/* TODO: Column of buttons */}
      {/* - Apply styles.buttons */}
      <View style={styles.buttons}>
        {/* TODO: Edit button (ActionButton) */}
        {/* - variant="primary" */}
        {/* - onPress: navigate to add-edit page with current activity */}

        {/* TODO: Delete button (ActionButton) */}
        {/* - variant="danger" */}
        {/* - onPress: call handleDelete */}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  text: {
    fontSize: 16,
    color: colors.textPrimary,
    marginVertical: 3,
  },
  buttons: {
    flexDirection: "column",
    gap: 10,
  },
});
