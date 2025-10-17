import { View, FlatList, StyleSheet, Text, ListRenderItem } from "react-native";
import { useRouter } from "expo-router";
import { useActivities } from "../contexts/ActivityContext";
import { globalStyles } from "../styles/globalStyles";
import ActivityListItem from "../components/ActivityListItem";
import PrimaryButton from "../components/PrimaryButton";
import { Activity } from "../types";

export default function HomeScreen() {
  const router = useRouter();
  const { activities } = useActivities();

  return (
    <View style={globalStyles.container} testID="container">
      <Text style={globalStyles.headerText}>Fitness Tracker</Text>

      <PrimaryButton onPress={() => router.push("/add-edit")}> 
        Add New Activity
      </PrimaryButton>

      <View style={styles.buttonSpacer} />

      <FlatList<Activity>
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Activity }) => (
          <ActivityListItem activity={item} />
        )}
        contentContainerStyle={styles.list}
        testID="activity-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 20 },
  buttonSpacer: { height: 20 },
});
