import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { colors } from "../constants/colors";

type Props = {
  onPress: () => void;
  children: string;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
};

export default function PrimaryButton({
  onPress,
  children,
  style,
  testID,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? colors.primaryPressed : colors.primary },
        style,
      ]}
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
