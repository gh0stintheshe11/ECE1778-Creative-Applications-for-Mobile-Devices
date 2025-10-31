import { View, FlatList, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { selectActivities } from "../features/activities/activitiesSlice";
import { globalStyles } from "../styles/globalStyles";
import ActivityListItem from "../components/ActivityListItem";
import PrimaryButton from "../components/PrimaryButton";

export default function HomeScreen() {
  const router = useRouter();
  const activities = useSelector(selectActivities);

  return (
    <View style={globalStyles.container} testID="container">
      <Text style={globalStyles.headerText}>Fitness Tracker</Text>

      <PrimaryButton onPress={() => router.push("/add-edit")}>Add New Activity</PrimaryButton>

      <View style={styles.buttonSpacer} />
      <FlatList
        data={activities}
        keyExtractor={(item: { id: string }) => item.id}
        renderItem={({ item }: { item: any }) => (
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
