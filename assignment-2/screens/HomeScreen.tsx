import { View, FlatList, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Activity, NavigationProp } from "../types";
import { globalStyles } from "../styles/globalStyles";
import ActivityListItem from "../components/ActivityListItem";
import PrimaryButton from "../components/PrimaryButton";

type Props = {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
};

export default function HomeScreen({ activities, setActivities }: Props) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={globalStyles.container} testID="container">
      <Text style={globalStyles.headerText}>Fitness Tracker</Text>

      <PrimaryButton onPress={() => navigation.navigate("AddEdit", {})}>
        Add New Activity
      </PrimaryButton>

      <View style={styles.buttonSpacer} />

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityListItem activity={item} setActivities={setActivities} />
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
