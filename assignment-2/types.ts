import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Activity type from Assignment 1
export type Activity = {};

// TODO: Define RootStackParamList mapping screen names to their route params
export type RootStackParamList = {
  Home: undefined; // Home screen has no parameters
  // TODO: Add AddEdit (with optional Activity) and Details (with required Activity)
};

// TODO: Create NavigationProp type alias using NativeStackNavigationProp<RootStackParamList>
