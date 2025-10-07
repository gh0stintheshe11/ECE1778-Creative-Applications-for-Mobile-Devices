import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Activity, NavigationProp } from "../types";
import { globalStyles } from "../styles/globalStyles";
// TODO: Import DetailsCard and ActionButton components

type Props = {
  route: { params: { activity: Activity } };
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
};

export default function DetailsScreen({ route, setActivities }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { activity } = route.params;

  const handleDelete = () => {
    // TODO: Remove activity from state
    // TODO: Navigate back to "Home"
  };

  return (
    <View style={globalStyles.container}>
      {/* TODO: Display header text "Activity Details" using globalStyles.headerText */}
      {/* TODO: Render DetailsCard to display the activity */}

      {/* TODO: Row of ActionButtons */}
      <View style={styles.buttons}>
        {/* TODO: Edit button */}
        {/* - variant="primary" */}
        {/* - navigates to "AddEdit" with the current activity */}
        {/* - use styles.button */}
        {/* - IMPORTANT: Include testID="edit-button" for autograding */}

        {/* TODO: Delete button */}
        {/* - variant="danger" */}
        {/* - removes activity from state and navigates to "Home" */}
        {/* - use styles.button */}
        {/* - IMPORTANT: Include testID="delete-button" for autograding */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // TODO: Row style for buttons
  buttons: {},
  // TODO: Individual button style
  button: {},
});
