import {
	Pressable,
	Text,
	StyleSheet,
	StyleProp,
	ViewStyle,
} from "react-native";
import { colors } from "../constants/colors";

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
			style={({ pressed }) => [
				styles.button,
				{
					backgroundColor: pressed
						? variantColors[variant].pressed
						: variantColors[variant].base,
				},
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
