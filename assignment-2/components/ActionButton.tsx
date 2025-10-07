import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
// TODO: Import colors from constants

type Variant = "primary" | "danger";

type Props = {
  onPress: () => void;
  children: string;
  variant: Variant;
  style?: StyleProp<ViewStyle>;
  testID?: string | undefined;
};

export default function ActionButton({
  onPress,
  children,
  variant,
  style,
  testID,
}: Props) {
  const variantColors = {
    primary: { base: colors.primary, pressed: colors.primaryPressed },
    danger: { base: colors.danger, pressed: colors.dangerPressed },
  };

  return (
    <Pressable
      // TODO: Apply styles.button, dynamic background color based on variant & pressed state, and any additional style
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
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
