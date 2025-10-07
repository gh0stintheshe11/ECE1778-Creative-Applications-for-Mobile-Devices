import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
// TODO: Import colors from constants

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
      // TODO: Apply styles.button, dynamic background color when pressed, and any additional style from props
      style={({ pressed }) => [style]}
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
    >
      {/* TODO: Apply styles.text */}
      <Text>{children}</Text>
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
