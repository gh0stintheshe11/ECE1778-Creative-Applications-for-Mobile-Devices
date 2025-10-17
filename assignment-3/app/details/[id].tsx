import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useActivities } from "../../contexts/ActivityContext";
import { globalStyles } from "../../styles/globalStyles";
import DetailsCard from "../../components/DetailsCard";
import ActionButton from "../../components/ActionButton";

export default function DetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { activities, deleteActivity } = useActivities();
  const actId = Array.isArray(id) ? id[0] : id;
  const activity = activities.find((a) => a.id === actId);

  if (!activity) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.headerText}>Activity Not Found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteActivity(activity.id);
    router.push("/");
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>Activity Details</Text>
      <DetailsCard activity={activity} />

      <View style={styles.buttons}>
        <ActionButton
          variant="primary"
          onPress={() => router.push(`/add-edit?id=${activity.id}`)}
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
  buttons: { flexDirection: "row", gap: 10, marginTop: 10 },
  button: { flex: 1 },
});
