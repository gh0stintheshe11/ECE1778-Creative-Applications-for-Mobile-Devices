import {
	View,
	StyleSheet,
	ViewProps,
	StyleProp,
	ViewStyle,
} from "react-native";
import { colors } from "../constants/colors";

type Props = ViewProps & {
	style?: StyleProp<ViewStyle>;
};

export default function Card({ children, style, ...props }: Props) {
	return (
		<View style={[styles.card, style]} {...props}>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 8,
		padding: 15,
		marginBottom: 10,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},
});
