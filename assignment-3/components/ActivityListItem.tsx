import { Pressable, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Activity } from "../types";
import { useActivities } from "../contexts/ActivityContext";
import ActionButton from "./ActionButton";
import Card from "./Card";
import { colors } from "../constants/colors";

type Props = {
  activity: Activity;
};

export default function ActivityListItem({ activity }: Props) {
  const router = useRouter();
  const { deleteActivity } = useActivities();

  const handleDelete = () => {
    deleteActivity(activity.id);
  };

  return (
    <Card style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.content, { opacity: pressed ? 0.6 : 1 }]}
        onPress={() => router.push(`/details/${activity.id}`)}
      >
        <Text style={styles.text}>Type: {activity.type}</Text>
        <Text style={styles.text}>Duration: {activity.duration} min</Text>
        <Text style={styles.text}>Calories: {activity.calories} cal</Text>
      </Pressable>

      <View style={styles.buttons}>
        <ActionButton
          variant="primary"
          onPress={() => router.push(`/add-edit?id=${activity.id}`)}
        >
          Edit
        </ActionButton>
        <ActionButton variant="danger" onPress={handleDelete}>
          Delete
        </ActionButton>
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
