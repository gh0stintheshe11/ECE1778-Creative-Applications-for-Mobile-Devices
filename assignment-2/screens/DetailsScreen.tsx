import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Activity, NavigationProp } from "../types";
import { globalStyles } from "../styles/globalStyles";
import DetailsCard from "../components/DetailsCard";
import ActionButton from "../components/ActionButton";

type Props = {
  route: { params: { activity: Activity } };
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
};

export default function DetailsScreen({ route, setActivities }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { activity } = route.params;

  const handleDelete = () => {
    setActivities((prev) => prev.filter((a) => a.id !== activity.id));
    navigation.navigate("Home");
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>Activity Details</Text>
      <DetailsCard activity={activity} />

      <View style={styles.buttons}>
        <ActionButton
          variant="primary"
          onPress={() => navigation.navigate("AddEdit", { activity })}
          style={styles.button}
          testID="edit-button"
        >
          Edit
        </ActionButton>
        <ActionButton
          variant="danger"
          onPress={handleDelete}
          style={styles.button}
          testID="delete-button"
        >
          Delete
        </ActionButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  button: { flex: 1 },
});
