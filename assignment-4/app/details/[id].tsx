import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { deleteActivity, selectActivityById } from "../../features/activities/activitiesSlice";
import type { RootState, AppDispatch } from "../../store/store";
import { globalStyles } from "../../styles/globalStyles";
import DetailsCard from "../../components/DetailsCard";
import ActionButton from "../../components/ActionButton";

export default function DetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const actId = Array.isArray(id) ? id[0] : (id as string | undefined);
  const activity = useSelector((state: RootState) =>
    actId ? selectActivityById(state, actId) : undefined
  );

  if (!activity) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.headerText}>Activity Not Found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    dispatch(deleteActivity(activity.id));
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
