import { Pressable, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Activity, NavigationProp } from "../types";
import ActionButton from "./ActionButton";
import Card from "./Card";
import { colors } from "../constants/colors";

type Props = {
  activity: Activity;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
};

export default function ActivityListItem({ activity, setActivities }: Props) {
  const navigation = useNavigation<NavigationProp>();

  const handleDelete = () => {
    setActivities((prev) => prev.filter((a) => a.id !== activity.id));
  };

  return (
    <Card style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.content, { opacity: pressed ? 0.6 : 1 }]}
        onPress={() => navigation.navigate("Details", { activity })}
      >
        <Text style={styles.text}>Type: {activity.type}</Text>
        <Text style={styles.text}>Duration: {activity.duration} min</Text>
        <Text style={styles.text}>Calories: {activity.calories} cal</Text>
      </Pressable>

      <View style={styles.buttons}>
        <ActionButton
          variant="primary"
          onPress={() => navigation.navigate("AddEdit", { activity })}
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
