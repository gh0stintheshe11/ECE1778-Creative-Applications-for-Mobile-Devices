import { Pressable, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
// TODO: Import Activity and NavigationProp from "../types"
// TODO: Import ActionButton component
// TODO: Import Card component
// TODO: Import colors from constants

type Props = {
  activity: Activity;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
};

export default function ActivityListItem({ activity, setActivities }: Props) {
  const navigation = useNavigation<NavigationProp>();

  const handleDelete = () => {
    // TODO: Remove the current activity from state using setActivities
  };

  return (
    // TODO: Apply styles.card
    <Card>
      <Pressable
      // TODO: Pressable area for the activity content
      // - Apply styles.content
      // - Reduce opacity to 0.6 when pressed
      // - onPress: navigate to "Details" with the current activity
      >
        <Text style={styles.text}>Type: {activity.type}</Text>
        {/* - Apply styles.text to the other two Texts */}
      </Pressable>

      {/* TODO: Column of buttons */}
      {/* - Apply styles.buttons */}
      <View>
        {/* TODO: Edit button */}
        {/* - variant="primary" */}
        {/* - onPress: navigate to "AddEdit" with current activity */}

        {/* TODO: Delete button */}
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
