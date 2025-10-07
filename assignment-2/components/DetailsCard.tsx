import { Text, StyleSheet } from "react-native";
// TODO: Import Activity type from "../types"
// TODO: Import Card component
// TODO: Import colors from constants

type Props = {
  // TODO: Define Props type with a single property "activity" of type Activity
};

export default function DetailsCard({ activity }: Props) {
  return (
    <Card>
      <Text style={styles.text}>Type: {activity.type}</Text>
      {/* TODO: Display activity duration */}
      {/* TODO: Display activity calories */}
    </Card>
  );
}

const styles = StyleSheet.create({
  // TODO: Text style for all details
  text: {},
});
