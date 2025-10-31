import { Text, StyleSheet } from "react-native";
import { Activity } from "../types";
import Card from "./Card";
import { colors } from "../constants/colors";

type Props = {
	activity: Activity;
};

export default function DetailsCard({ activity }: Props) {
	return (
		<Card>
			<Text style={styles.text}>Type: {activity.type}</Text>
			<Text style={styles.text}>Duration: {activity.duration} min</Text>
			<Text style={styles.text}>Calories: {activity.calories} cal</Text>
		</Card>
	);
}

const styles = StyleSheet.create({
	text: {
		fontSize: 18,
		color: colors.textPrimary,
		marginVertical: 5,
	},
});
