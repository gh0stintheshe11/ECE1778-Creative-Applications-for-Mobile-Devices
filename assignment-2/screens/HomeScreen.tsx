import { View, FlatList, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Activity, NavigationProp } from "../types";
import { globalStyles } from "../styles/globalStyles";
// TODO: Import ActivityListItem
// TODO: Import PrimaryButton

type Props = {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
};

export default function HomeScreen({ activities, setActivities }: Props) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={globalStyles.container} testID="container">
      {/* TODO: Display header text "Fitness Tracker" using globalStyles.headerText */}

      {/* TODO: Add a PrimaryButton with label "Add New Activity"
          - On press, navigate to "AddEdit"  */}

      <View style={styles.buttonSpacer} />

      {/* TODO: Add a FlatList to render activities
          - Use activities as data
          - keyExtractor should use item.id
          - renderItem should render ActivityListItem with activity + setActivities
          - Add contentContainerStyle for bottom padding (20)
          - Add testID="activity-list" */}
    </View>
  );
}

const styles = StyleSheet.create({
  // TODO: Define list padding (paddingBottom: 20)
  list: {},

  // TODO: Define button spacer (height: 20)
  buttonSpacer: {},
});
